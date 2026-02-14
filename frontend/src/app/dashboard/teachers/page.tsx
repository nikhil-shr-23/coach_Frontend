"use client";

import { useState } from "react";
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
  id: string;
  subject: string;
  date: string;
  duration: string;
  status: "analyzed" | "processing" | "pending";
  reviewRatio: number | null;
  questionVelocity: number | null;
  waitTime: number | null;
  ttt: number | null;
}

interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  room: string;
  section: string;
}

const TEACHER = {
  name: "Dr. Ananya Mehta",
  email: "ananya.mehta@krmangalam.edu.in",
  department: "Computer Science & Engineering",
  school: "SOET",
  designation: "Associate Professor",
  overallScore: 81,
  totalLectures: 24,
  streak: 5,
};

const TIMETABLE: TimetableSlot[] = [
  {
    day: "Monday",
    time: "09:00 – 10:00",
    subject: "Data Structures",
    room: "LH-301",
    section: "CSE-A",
  },
  {
    day: "Monday",
    time: "11:00 – 12:00",
    subject: "Design & Analysis of Algorithms",
    room: "LH-204",
    section: "CSE-B",
  },
  {
    day: "Tuesday",
    time: "10:00 – 11:00",
    subject: "Data Structures",
    room: "LH-301",
    section: "CSE-B",
  },
  {
    day: "Tuesday",
    time: "14:00 – 15:00",
    subject: "Data Structures Lab",
    room: "Lab-102",
    section: "CSE-A",
  },
  {
    day: "Wednesday",
    time: "09:00 – 10:00",
    subject: "Design & Analysis of Algorithms",
    room: "LH-204",
    section: "CSE-A",
  },
  {
    day: "Wednesday",
    time: "11:00 – 12:00",
    subject: "Data Structures",
    room: "LH-301",
    section: "CSE-A",
  },
  {
    day: "Thursday",
    time: "10:00 – 11:00",
    subject: "Design & Analysis of Algorithms",
    room: "LH-204",
    section: "CSE-B",
  },
  {
    day: "Thursday",
    time: "14:00 – 16:00",
    subject: "DAA Lab",
    room: "Lab-103",
    section: "CSE-A",
  },
  {
    day: "Friday",
    time: "09:00 – 10:00",
    subject: "Data Structures",
    room: "LH-301",
    section: "CSE-B",
  },
  {
    day: "Friday",
    time: "11:00 – 12:00",
    subject: "Design & Analysis of Algorithms",
    room: "LH-204",
    section: "CSE-A",
  },
];

const LECTURES: Lecture[] = [
  {
    id: "l1",
    subject: "Data Structures – Linked Lists",
    date: "Feb 12, 2026",
    duration: "48 min",
    status: "analyzed",
    reviewRatio: 85,
    questionVelocity: 4.2,
    waitTime: 3.8,
    ttt: 72,
  },
  {
    id: "l2",
    subject: "DAA – Dynamic Programming",
    date: "Feb 11, 2026",
    duration: "45 min",
    status: "analyzed",
    reviewRatio: 78,
    questionVelocity: 3.5,
    waitTime: 2.9,
    ttt: 68,
  },
  {
    id: "l3",
    subject: "Data Structures – Stacks & Queues",
    date: "Feb 10, 2026",
    duration: "50 min",
    status: "analyzed",
    reviewRatio: 92,
    questionVelocity: 5.1,
    waitTime: 4.2,
    ttt: 65,
  },
  {
    id: "l4",
    subject: "DAA – Greedy Algorithms",
    date: "Feb 9, 2026",
    duration: "44 min",
    status: "processing",
    reviewRatio: null,
    questionVelocity: null,
    waitTime: null,
    ttt: null,
  },
  {
    id: "l5",
    subject: "Data Structures – Arrays",
    date: "Feb 7, 2026",
    duration: "46 min",
    status: "analyzed",
    reviewRatio: 88,
    questionVelocity: 4.8,
    waitTime: 3.5,
    ttt: 70,
  },
  {
    id: "l6",
    subject: "DAA – Divide & Conquer",
    date: "Feb 6, 2026",
    duration: "47 min",
    status: "analyzed",
    reviewRatio: 80,
    questionVelocity: 3.9,
    waitTime: 3.1,
    ttt: 74,
  },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getStatusBadge(status: Lecture["status"]) {
  switch (status) {
    case "analyzed":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "processing":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "pending":
      return "bg-muted text-muted-foreground border-border";
  }
}

function getMetricColor(
  value: number | null,
  thresholds: { good: number; ok: number },
) {
  if (value === null) return "text-muted-foreground";
  if (value >= thresholds.good) return "text-emerald-600";
  if (value >= thresholds.ok) return "text-amber-600";
  return "text-red-500";
}

export default function TeacherDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "timetable" | "upload"
  >("dashboard");
  const [lectureTitle, setLectureTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !lectureTitle) {
      alert("Please provide a title and select a file.");
      return;
    }

    const token = localStorage.getItem("token");
    const teacherProfileId = localStorage.getItem("teacherProfileId");

    if (!token || !teacherProfileId) {
      alert("Authentication error. Please login again.");
      window.location.href = "/";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("audio", selectedFile);
    formData.append("lectureTitle", lectureTitle);
    formData.append("teacherProfileId", teacherProfileId);

    try {
      const res = await fetch("http://localhost:8080/api/lectures", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setAnalysisResult(data);
      alert("Lecture analyzed successfully! Score: " + data.score);
      setLectureTitle("");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      alert("Error uploading lecture.");
    } finally {
      setUploading(false);
    }
  };

  const avgReview = Math.round(
    LECTURES.filter((l) => l.reviewRatio !== null).reduce(
      (s, l) => s + l.reviewRatio!,
      0,
    ) / LECTURES.filter((l) => l.reviewRatio !== null).length,
  );
  const avgQV = (
    LECTURES.filter((l) => l.questionVelocity !== null).reduce(
      (s, l) => s + l.questionVelocity!,
      0,
    ) / LECTURES.filter((l) => l.questionVelocity !== null).length
  ).toFixed(1);
  const avgWT = (
    LECTURES.filter((l) => l.waitTime !== null).reduce(
      (s, l) => s + l.waitTime!,
      0,
    ) / LECTURES.filter((l) => l.waitTime !== null).length
  ).toFixed(1);
  const avgTTT = Math.round(
    LECTURES.filter((l) => l.ttt !== null).reduce((s, l) => s + l.ttt!, 0) /
      LECTURES.filter((l) => l.ttt !== null).length,
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-dashed border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
              <svg
                className="w-4.5 h-4.5 text-primary"
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
            <div>
              <h1 className="font-display text-lg font-bold text-foreground leading-none">
                Pedagogical
              </h1>
              <p className="text-xs font-ui text-muted-foreground mt-0.5">
                KR Mangalam University
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="border-dashed font-ui text-xs uppercase tracking-wider px-3 py-1"
            >
              Faculty
            </Badge>
            <Notifications />
            <Separator orientation="vertical" className="h-6" />
            <UserNav
              name={TEACHER.name}
              email={TEACHER.email}
              initials="AM"
              role="Faculty"
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex gap-1 border-b border-dashed border-border">
          {(
            [
              {
                key: "dashboard",
                label: "My Dashboard",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                ),
              },
              {
                key: "timetable",
                label: "Timetable",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                ),
              },
              {
                key: "upload",
                label: "Upload Lecture",
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                ),
              },
            ] as {
              key: "dashboard" | "timetable" | "upload";
              label: string;
              icon: React.ReactNode;
            }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-ui font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
                <p className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                  Overall Score
                </p>
                <p
                  className={`font-display text-2xl font-bold mt-2 ${TEACHER.overallScore >= 80 ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {TEACHER.overallScore}%
                </p>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
                <p className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                  Review Ratio
                </p>
                <p
                  className={`font-display text-2xl font-bold mt-2 ${getMetricColor(avgReview, { good: 80, ok: 65 })}`}
                >
                  {avgReview}%
                </p>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
                <p className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                  Q. Velocity
                </p>
                <p
                  className={`font-display text-2xl font-bold mt-2 ${getMetricColor(Number(avgQV), { good: 4, ok: 3 })}`}
                >
                  {avgQV}
                  <span className="text-sm font-normal text-muted-foreground">
                    /10min
                  </span>
                </p>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
                <p className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                  Wait Time
                </p>
                <p
                  className={`font-display text-2xl font-bold mt-2 ${getMetricColor(Number(avgWT), { good: 3, ok: 2 })}`}
                >
                  {avgWT}
                  <span className="text-sm font-normal text-muted-foreground">
                    s
                  </span>
                </p>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
                <p className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                  Talk Time
                </p>
                <p
                  className={`font-display text-2xl font-bold mt-2 ${getMetricColor(100 - avgTTT, { good: 30, ok: 20 })}`}
                >
                  {avgTTT}%
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    TTT
                  </span>
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Recent Lectures
                </h3>
                <Badge variant="secondary" className="font-ui text-xs">
                  {TEACHER.totalLectures} Total
                </Badge>
              </div>

              <div className="space-y-3">
                {LECTURES.map((lecture) => (
                  <Card
                    key={lecture.id}
                    className="border border-dashed border-border/70 hover:border-primary/30 transition-all duration-300 hover:shadow-sm"
                  >
                    <CardContent className="py-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg border border-dashed border-primary/20 flex items-center justify-center shrink-0">
                            <svg
                              className="w-5 h-5 text-primary/60"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-sans text-sm font-semibold text-foreground">
                              {lecture.subject}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-ui text-muted-foreground">
                                {lecture.date}
                              </span>
                              <span className="text-muted-foreground/30">
                                ·
                              </span>
                              <span className="text-xs font-ui text-muted-foreground">
                                {lecture.duration}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 lg:gap-5">
                          {lecture.status === "analyzed" ? (
                            <>
                              <div className="text-center min-w-[52px]">
                                <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">
                                  Review
                                </p>
                                <p
                                  className={`font-sans text-sm font-bold ${getMetricColor(lecture.reviewRatio, { good: 80, ok: 65 })}`}
                                >
                                  {lecture.reviewRatio}%
                                </p>
                              </div>
                              <div className="text-center min-w-[52px]">
                                <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">
                                  Q.Vel
                                </p>
                                <p
                                  className={`font-sans text-sm font-bold ${getMetricColor(lecture.questionVelocity, { good: 4, ok: 3 })}`}
                                >
                                  {lecture.questionVelocity}
                                </p>
                              </div>
                              <div className="text-center min-w-[52px]">
                                <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">
                                  Wait
                                </p>
                                <p
                                  className={`font-sans text-sm font-bold ${getMetricColor(lecture.waitTime, { good: 3, ok: 2 })}`}
                                >
                                  {lecture.waitTime}s
                                </p>
                              </div>
                              <div className="text-center min-w-[52px]">
                                <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">
                                  TTT
                                </p>
                                <p
                                  className={`font-sans text-sm font-bold ${getMetricColor(100 - (lecture.ttt ?? 0), { good: 30, ok: 20 })}`}
                                >
                                  {lecture.ttt}%
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2 px-4">
                              <svg
                                className="w-4 h-4 animate-spin text-amber-500"
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
                              <span className="text-xs font-ui text-amber-600">
                                Processing…
                              </span>
                            </div>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-ui uppercase tracking-wider border-dashed ml-2 ${getStatusBadge(lecture.status)}`}
                          >
                            {lecture.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "timetable" && (
          <div className="h-[calc(100vh-12rem)] min-h-[600px] flex flex-col border-2 border-dashed border-border rounded-xl bg-card overflow-hidden">
            <div className="flex border-b border-dashed border-border bg-muted/30">
              <div className="w-16 border-r border-dashed border-border shrink-0"></div>
              <div className="flex-1 grid grid-cols-5 divide-x divide-dashed divide-border">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="py-3 text-center border-dashed border-border"
                  >
                    <span className="text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                      {day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto relative">
              <div className="flex relative min-h-[600px]">
                {/* Time labels */}
                <div className="w-16 border-r border-dashed border-border bg-muted/5 shrink-0 flex flex-col font-mono text-[10px] text-muted-foreground">
                  {Array.from({ length: 9 }).map((_, i) => {
                    const hour = i + 9; // 9:00 to 17:00
                    return (
                      <div
                        key={hour}
                        className="h-20 border-b border-dashed border-border/50 relative"
                      >
                        <span className="absolute -top-2 left-2">
                          {hour}:00
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Grid columns */}
                <div className="flex-1 grid grid-cols-5 divide-x divide-dashed divide-border relative bg-[url('/grid-pattern.svg')]">
                  {/* Horizontal time lines */}
                  <div className="absolute inset-0 z-0 flex flex-col">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-20 border-b border-dashed border-border/30 w-full"
                      />
                    ))}
                  </div>

                  {DAYS.map((day) => (
                    <div key={day} className="relative h-full z-10 group">
                      {/* Hover effect column */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />

                      {TIMETABLE.filter((s) => s.day === day).map(
                        (slot, idx) => {
                          // Simple parsing: "09:00 - 10:00" -> start hour 9, duration 1 hr
                          const startHour = parseInt(
                            slot.time.split("–")[0].trim().split(":")[0],
                          );
                          const endHour = parseInt(
                            slot.time.split("–")[1].trim().split(":")[0],
                          );
                          const duration = endHour - startHour; // standard slots
                          const topOffset = (startHour - 9) * 5; // 5rem (h-20) per hour
                          const height = duration * 5;

                          return (
                            <div
                              key={idx}
                              className="absolute inset-x-1 p-2 rounded-lg border border-primary/20 bg-primary/10 hover:bg-primary/15 hover:border-primary/40 transition-all cursor-pointer shadow-sm group/event"
                              style={{
                                top: `${topOffset}rem`, // 20 units (80px) = 5rem
                                height: `${height}rem`,
                              }}
                            >
                              <div className="flex flex-col h-full justify-between">
                                <div>
                                  <p className="font-sans text-xs font-bold text-primary truncate leading-tight">
                                    {slot.subject}
                                  </p>
                                  <p className="font-ui text-[10px] text-primary/70 mt-0.5">
                                    {slot.time}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="h-4 px-1 text-[8px] border-primary/20 text-primary/80 bg-background/50 backdrop-blur-sm"
                                  >
                                    {slot.room}
                                  </Badge>
                                  <span className="font-ui text-[9px] font-semibold text-primary/60">
                                    {slot.section}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "upload" && (
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-dashed border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl font-bold">
                  Upload Lecture Recording
                </CardTitle>
                <CardDescription className="font-sans text-sm">
                  Upload an MP3 recording of your lecture for AI-powered
                  pedagogical analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-ui text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    Subject / Title
                  </Label>
                  <Input
                    placeholder="e.g. Data Structures – Binary Trees"
                    className="border-dashed font-sans h-11"
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-ui text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    Lecture Date
                  </Label>
                  <Input type="date" className="border-dashed font-sans h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="font-ui text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    Audio File (MP3)
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept=".mp3,audio/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <svg
                      className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <p className="font-sans text-sm text-muted-foreground">
                      {selectedFile
                        ? selectedFile.name
                        : "Drag & drop your MP3 file here"}
                    </p>
                    <p className="font-ui text-xs text-muted-foreground/50 mt-1">
                      or click to browse · Max 200MB
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full h-11 font-ui font-semibold text-sm tracking-wide uppercase"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
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
                      Analyzing...
                    </span>
                  ) : (
                    "Upload & Analyze"
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2">
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
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                  <p className="text-xs text-muted-foreground/40 font-ui">
                    Your recordings are private and encrypted
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 border-t border-dashed border-border pt-6 flex items-center justify-between">
          <p className="text-xs font-ui text-muted-foreground/40">
            KR Mangalam University · Classroom Observation Tool
          </p>
          <p className="text-xs font-ui text-muted-foreground/40">
            Your data is private · For your eyes only
          </p>
        </div>
      </main>
    </div>
  );
}
