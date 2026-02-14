"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginRes = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
      });

      if (!loginRes.ok) throw new Error("Login failed");

      const token = await loginRes.text();
      localStorage.setItem("token", token);

      if (!email.includes("admin") && !email.includes("dean")) {
        const profileRes = await fetch(
          "http://localhost:8080/api/teacher-profiles/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (profileRes.ok) {
          const profile = await profileRes.json();
          localStorage.setItem("teacherProfileId", profile.id);
        }
      }

      if (email.includes("admin")) {
        window.location.href = "/dashboard";
      } else if (email.includes("dean")) {
        window.location.href = "/dashboard/dean";
      } else {
        window.location.href = "/dashboard/teachers";
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Is the backend running?");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="relative flex-1 lg:flex-3 flex flex-col justify-between p-8 lg:p-16 overflow-hidden bg-linear-to-br from-primary via-primary/90 to-accent">
        <div className="absolute top-12 right-12 w-48 h-48 border-2 border-dashed border-white/20 rounded-2xl rotate-12" />
        <div className="absolute bottom-24 left-12 w-36 h-36 border-2 border-dashed border-white/15 rounded-xl -rotate-6" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 border border-dashed border-white/10 rounded-lg rotate-45" />
        <div className="absolute bottom-12 right-24 w-16 h-16 border border-dashed border-white/10 rounded-md rotate-12" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg border-2 border-dashed border-white/40 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
            </div>
            <span className="text-white/90 font-ui text-sm font-semibold tracking-widest uppercase">
              Admin Portal
            </span>
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight mt-8">
            Pedagogical
          </h1>
          <p className="font-ui text-lg lg:text-xl text-white/70 mt-4 max-w-md leading-relaxed">
            A Fitbit for Teaching — Private, automated, evidence-based feedback
            for faculty.
          </p>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0">
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            {[
              { label: "Review Ratio", value: "Daily Review" },
              { label: "Question Velocity", value: "Per 10 Min" },
              { label: "Wait Time", value: "Target >3s" },
              { label: "TTT Analysis", value: "Voice Ratio" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="border border-dashed border-white/20 rounded-lg p-3 backdrop-blur-sm bg-white/5"
              >
                <p className="text-white/50 text-xs font-ui font-medium uppercase tracking-wider">
                  {metric.label}
                </p>
                <p className="text-white/80 text-sm font-sans font-semibold mt-1">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs font-ui mt-6 tracking-wide">
            KR Mangalam University · Classroom Observation Tool
          </p>
        </div>
      </div>

      <div className="flex-1 lg:flex-2 flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-md">
          <div className="border-2 border-dashed border-border rounded-2xl p-6 lg:p-8">
            <Card className="border border-dashed border-border/60 shadow-lg">
              <CardHeader className="space-y-3 pb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-widest">
                    Secure Access
                  </span>
                </div>
                <CardTitle className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  Welcome back
                </CardTitle>
                <CardDescription className="font-sans text-muted-foreground text-sm leading-relaxed">
                  Sign in to access the observation dashboard and faculty
                  analytics.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-ui text-xs font-semibold uppercase tracking-wider text-foreground/70"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@krmangalam.edu.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-dashed border-border focus:border-primary font-sans pl-10 h-11 transition-colors"
                      />
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="font-ui text-xs font-semibold uppercase tracking-wider text-foreground/70"
                      >
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs font-ui text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-dashed border-border focus:border-primary font-sans pl-10 h-11 transition-colors"
                      />
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 font-ui font-semibold text-sm tracking-wide uppercase transition-all duration-200 hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Authenticating…
                      </span>
                    ) : (
                      "Sign In to Dashboard"
                    )}
                  </Button>

                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-px bg-border border-t border-dashed border-border" />
                    <span className="text-xs font-ui text-muted-foreground/60 uppercase tracking-widest">
                      or
                    </span>
                    <div className="flex-1 h-px bg-border border-t border-dashed border-border" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 font-ui font-medium text-sm tracking-wide border-dashed transition-all duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 23 23"
                      fill="none"
                    >
                      <path d="M11 0H0V11H11V0Z" fill="#F25022" />
                      <path d="M23 0H12V11H23V0Z" fill="#7FBA00" />
                      <path d="M11 12H0V23H11V12Z" fill="#00A4EF" />
                      <path d="M23 12H12V23H23V12Z" fill="#FFB900" />
                    </svg>
                    Continue with Microsoft Outlook
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <div className="flex items-center justify-center gap-2 mt-6">
              <svg
                className="w-3.5 h-3.5 text-muted-foreground/40"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
              <p className="text-xs text-muted-foreground/40 font-ui">
                End-to-end encrypted · Privacy-first design
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
