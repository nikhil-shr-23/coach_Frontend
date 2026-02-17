"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Fetch user profile to determine redirect
      fetch("http://localhost:8080/api/teacher-profiles/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          // If profile fetch fails, it might be a new user or just fail.
          // Default to teacher dashboard or profile setup if needed.
          // For now, redirect to teacher dashboard as safe default
          router.push("/dashboard/teacher");
          return null;
        })
        .then((profile) => {
          if (profile) {
            localStorage.setItem("teacherProfileId", profile.id);
            router.push("/dashboard/teacher");
          }
        })
        .catch((err) => {
          console.error("Profile fetch error", err);
          // Fallback
          router.push("/dashboard/teacher");
        });
    } else {
      // No token, redirect to login
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground font-ui animate-pulse">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthSuccessContent />
    </Suspense>
  );
}
