"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserNav } from "@/components/dashboard/user-nav";
import { Notifications } from "@/components/dashboard/notifications";

interface Lecture {
  id: string; // Using ID for key
  subject: string;
  date: string;
  duration: string;
  status: "analyzed" | "processing" | "pending";
  reviewRatio: number | null;
  questionVelocity: number | null;
  waitTime: number | null;
  ttt: number | null;
}

interface TeacherStats {
  id: number;
  name: string;
  department: string;
  lecturesAnalyzed: number;
  avgScore: number;
  lastActive: string;
  email: string;
}

// Placeholder for timetable until backend supports it
interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  room: string;
  section: string;
}

const TIMETABLE: TimetableSlot[] = [
  {
    day: "Monday",
    time: "09:00 – 10:00",
    subject: "Data Structures",
    room: "LH-301",
    section: "CSE-A",
  },
  // Add more slots if needed or fetch dynamically later
];

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:8080/api/dashboard/teacher/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setTeacher(data);
        } else {
          console.error("Failed to fetch teacher stats");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-lg text-primary">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          Pedagogical <span className="text-slate-400 font-normal">|</span>{" "}
          Teacher
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Notifications />
          <UserNav
            name={teacher.name}
            email={teacher.email || ""}
            initials={teacher.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            role="Teacher"
          />
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {teacher.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 pt-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {teacher.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <Badge variant="outline" className="font-normal">
                  {teacher.department}
                </Badge>
                <span>•</span>
                <span>{teacher.department}</span>{" "}
                {/* Assuming Dept and School are same or similar for now, or fetch school too */}
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 uppercase tracking-wider font-medium">
                  Avg. Score
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  {Math.round(teacher.avgScore)}/100
                </span>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 uppercase tracking-wider font-medium">
                  Lectures
                </span>
                <span className="text-2xl font-bold text-slate-700">
                  {teacher.lecturesAnalyzed}
                </span>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 uppercase tracking-wider font-medium">
                  Streak
                </span>
                <span className="text-2xl font-bold text-amber-500">
                  5 Days {/* Placeholder */}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Lectures</CardTitle>
                <CardDescription>
                  Your recently analyzed classroom sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 text-slate-400 italic">
                  No recent lectures found. (Lectures list to be implemented)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Col */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {TIMETABLE.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50/50"
                  >
                    <div className="w-12 text-center">
                      <div className="text-sm font-bold text-slate-700">
                        {slot.time.split(" ")[0]}
                      </div>
                      <div className="text-xs text-slate-400">
                        {slot.time.split(" ")[0].split(":")[0] < "12"
                          ? "AM"
                          : "PM"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {slot.subject}
                      </div>
                      <div className="text-sm text-slate-500">
                        {slot.room} • {slot.section}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
