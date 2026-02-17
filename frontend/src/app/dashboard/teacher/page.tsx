"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  Plus,
  Trash2,
  Upload,
  X,
  Mic,
  FileAudio,
  Clock,
  MapPin,
  BookOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE = "http://localhost:8080";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;
const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8AM to 6PM

const SLOT_COLORS = [
  "bg-primary/10 border-primary/30 text-primary",
  "bg-emerald-500/10 border-emerald-500/30 text-emerald-700",
  "bg-amber-500/10 border-amber-500/30 text-amber-700",
  "bg-rose-500/10 border-rose-500/30 text-rose-700",
  "bg-violet-500/10 border-violet-500/30 text-violet-700",
  "bg-cyan-500/10 border-cyan-500/30 text-cyan-700",
  "bg-orange-500/10 border-orange-500/30 text-orange-700",
];

interface Lecture {
  id: string;
  lectureTitle: string;
  lectureAudioUrl: string;
  score: number;
  uploadedAt: string;
  reviewRatio: number | null;
  questionVelocity: number | null;
  waitTime: number | null;
  teacherTalkingTime: number | null;
  hinglishFluency: number | null;
}

interface TeacherStats {
  id: number;
  name: string;
  department: string;
  lecturesAnalyzed: number;
  avgScore: number;
  lastActive: string;
  email: string;
  timetableId: number;
}

interface TimetableSlot {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  courseName: string;
  roomNumber: string;
  subjectName: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-500";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-emerald-500/10";
  if (score >= 60) return "bg-amber-500/10";
  return "bg-red-500/10";
}

function getMetricColor(value: number, max: number) {
  const pct = (value / max) * 100;
  if (pct >= 75)
    return {
      text: "text-emerald-600",
      stroke: "#059669",
      bg: "bg-emerald-500",
    };
  if (pct >= 50)
    return { text: "text-amber-600", stroke: "#d97706", bg: "bg-amber-500" };
  return { text: "text-red-500", stroke: "#ef4444", bg: "bg-red-500" };
}

function CircularProgress({
  value,
  max,
  size = 72,
  strokeWidth = 5,
  label,
  unit,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  unit: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = getMetricColor(value, max);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className={`font-display text-lg font-bold ${color.text}`}>
          {Math.round(pct)}
        </span>
        <span className="text-[8px] font-ui text-muted-foreground uppercase">
          {unit}
        </span>
      </div>
    </div>
  );
}

interface MetricCardConfig {
  key: string;
  name: string;
  principle: string;
  description: string;
  value: number;
  max: number;
  unit: string;
  icon: React.ReactNode;
}

function timeToHour(time: string): number {
  const parts = time.split(":");
  return parseInt(parts[0]) + parseInt(parts[1]) / 60;
}

function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<TeacherStats | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [timetableId, setTimetableId] = useState<number | null>(null);
  const [teacherProfileId, setTeacherProfileId] = useState<number | null>(null);

  // Add Class
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
    courseName: "",
    roomNumber: "",
    subjectName: "",
  });

  // Upload Recording
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    classSlotId: "" as string,
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active tab for mobile
  const [activeTab, setActiveTab] = useState<
    "timetable" | "lectures" | "upload"
  >("timetable");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const profileRes = await fetch(`${API_BASE}/api/dashboard/teacher/me`, {
        headers,
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setTeacher(profileData);

        const lecturesRes = await fetch(`${API_BASE}/api/lectures/my-recent`, {
          headers,
        });
        if (lecturesRes.ok) setLectures(await lecturesRes.json());

        const fullProfileRes = await fetch(
          `${API_BASE}/api/teacher-profiles/me`,
          { headers },
        );
        if (fullProfileRes.ok) {
          const fullProfile = await fullProfileRes.json();
          setTeacherProfileId(fullProfile.id);
          if (fullProfile.timetableId) {
            setTimetableId(fullProfile.timetableId);
            const classesRes = await fetch(
              `${API_BASE}/api/classes?timetableId=${fullProfile.timetableId}`,
              { headers },
            );
            if (classesRes.ok) setTimetable(await classesRes.json());
          }
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async () => {
    if (
      !newClass.courseName ||
      !newClass.startTime ||
      !newClass.endTime ||
      !newClass.roomNumber
    ) {
      alert("Please fill all fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!timetableId) {
        alert("No timetable found.");
        return;
      }
      const res = await fetch(`${API_BASE}/api/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newClass,
          timetableId,
          subjectName: newClass.courseName,
        }),
      });
      if (res.ok) {
        const addedClass = await res.json();
        setTimetable([...timetable, addedClass]);
        setIsAddClassOpen(false);
        setNewClass({
          dayOfWeek: "MONDAY",
          startTime: "",
          endTime: "",
          courseName: "",
          roomNumber: "",
          subjectName: "",
        });
      } else {
        alert("Failed to add class");
      }
    } catch (e) {
      console.error(e);
      alert("Error adding class");
    }
  };

  const handleDeleteClass = async (id: number) => {
    if (!confirm("Remove this class from your timetable?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/classes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTimetable(timetable.filter((t) => t.id !== id));
      else alert("Failed to delete class");
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadRecording = async () => {
    if (!uploadForm.title) {
      alert("Please enter a lecture title");
      return;
    }
    if (!teacherProfileId) {
      alert("Teacher profile not found");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("teacherProfileId", teacherProfileId.toString());
      formData.append("lectureTitle", uploadForm.title);
      if (uploadForm.classSlotId)
        formData.append("classSlotId", uploadForm.classSlotId);
      if (audioFile) formData.append("audio", audioFile);

      const res = await fetch(`${API_BASE}/api/lectures`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setUploadSuccess(true);
        setUploadForm({ title: "", classSlotId: "" });
        setAudioFile(null);
        // Refresh lectures
        const lecturesRes = await fetch(`${API_BASE}/api/lectures/my-recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (lecturesRes.ok) setLectures(await lecturesRes.json());
        setTimeout(() => {
          setUploadSuccess(false);
          setIsUploadOpen(false);
        }, 2000);
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error uploading recording");
    } finally {
      setUploading(false);
    }
  };

  // Map slots to calendar grid
  const getSlotStyle = (slot: TimetableSlot) => {
    const startHour = timeToHour(slot.startTime);
    const endHour = timeToHour(slot.endTime);
    const top = ((startHour - 8) / 11) * 100;
    const height = ((endHour - startHour) / 11) * 100;
    return { top: `${top}%`, height: `${Math.max(height, 6)}%` };
  };

  const getSlotColor = (index: number) =>
    SLOT_COLORS[index % SLOT_COLORS.length];

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-dashed border-primary/40 rounded-lg animate-spin mx-auto" />
          <p className="text-sm font-ui text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );

  if (!teacher)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="font-sans text-muted-foreground">
            Failed to load dashboard.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-dashed border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
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
                Teacher Dashboard
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
              name={teacher.name}
              email={teacher.email || ""}
              initials={teacher.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
              role="Teacher"
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Profile Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-dashed border-primary/20">
              <AvatarFallback className="font-ui text-lg font-bold bg-primary/10 text-primary">
                {teacher.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {teacher.name}
              </h2>
              <p className="text-sm font-ui text-muted-foreground">
                {teacher.department}
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            {[
              {
                label: "Avg. Score",
                value: `${Math.round(teacher.avgScore)}%`,
                color: getScoreColor(teacher.avgScore),
              },
              {
                label: "Lectures",
                value: teacher.lecturesAnalyzed.toString(),
                color: "text-foreground",
              },
              { label: "Streak", value: "5 Days", color: "text-amber-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-2 border-dashed border-border rounded-xl px-4 py-2.5 bg-card text-center min-w-[90px]"
              >
                <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p
                  className={`font-display text-xl font-bold mt-0.5 ${stat.color}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ───── PEDAGOGICAL COACH ───── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center">
              <svg
                className="w-4.5 h-4.5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Pedagogical Coach
              </h3>
              <p className="text-xs font-ui text-muted-foreground">
                Rosenshine&apos;s Principles of Instruction — AI-detected
                metrics
              </p>
            </div>
          </div>

          {(() => {
            // Compute averages from lectures with metric data
            const metricsLectures = lectures.filter(
              (l) => l.reviewRatio !== null && l.reviewRatio !== undefined,
            );
            const avg = (field: keyof Lecture) => {
              if (metricsLectures.length === 0) return null;
              const sum = metricsLectures.reduce(
                (acc, l) => acc + (Number(l[field]) || 0),
                0,
              );
              return sum / metricsLectures.length;
            };
            const reviewRatio = avg("reviewRatio") ?? 72;
            const questionVelocity = avg("questionVelocity") ?? 6.3;
            const waitTime = avg("waitTime") ?? 2.8;
            const ttt = avg("teacherTalkingTime") ?? 68;
            const hinglish = avg("hinglishFluency") ?? 85;

            const metrics: MetricCardConfig[] = [
              {
                key: "review",
                name: "Review Ratio",
                principle: "Principle 1: Daily Review",
                description:
                  "Keywords/concepts from previous lecture detected in first 5-8 minutes",
                value: reviewRatio,
                max: 100,
                unit: "%",
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
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                ),
              },
              {
                key: "questions",
                name: "Question Velocity",
                principle: "Principle 2: Ask Questions",
                description:
                  "Number of questions asked by the teacher per 10 minutes",
                value: questionVelocity,
                max: 15,
                unit: "Q/10min",
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
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                  </svg>
                ),
              },
              {
                key: "wait",
                name: "Wait Time",
                principle: "Principle 3: Check Understanding",
                description:
                  "Average silence after a question is asked (Target: >3 seconds)",
                value: waitTime,
                max: 6,
                unit: "sec",
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
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                ),
              },
              {
                key: "ttt",
                name: "Teacher Talking Time",
                principle: "Principle 6: Guide Practice",
                description: "Ratio of teacher voice vs. student voice/silence",
                value: ttt,
                max: 100,
                unit: "% TTT",
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
                      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    />
                  </svg>
                ),
              },
              {
                key: "hinglish",
                name: "Hinglish Fluency",
                principle: "Contextual Necessity",
                description:
                  "Accurate transcription of code-switching (Hindi/English mix)",
                value: hinglish,
                max: 100,
                unit: "%",
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
                      d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                    />
                  </svg>
                ),
              },
            ];

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.map((m) => {
                  const pct = Math.min((m.value / m.max) * 100, 100);
                  const color = getMetricColor(m.value, m.max);
                  const isBar = m.key === "questions";
                  const isTTT = m.key === "ttt";

                  return (
                    <div
                      key={m.key}
                      className="border-2 border-dashed border-border/70 rounded-xl bg-card p-4 flex flex-col group hover:border-primary/30 transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg border border-dashed border-primary/20 flex items-center justify-center text-primary">
                          {m.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-ui font-semibold text-foreground truncate">
                            {m.name}
                          </p>
                          <p className="text-[8px] font-ui text-muted-foreground/60 uppercase tracking-wider truncate">
                            {m.principle}
                          </p>
                        </div>
                      </div>

                      {/* Visual */}
                      <div className="flex-1 flex items-center justify-center my-2">
                        {isTTT ? (
                          /* Split bar for TTT */
                          <div className="w-full space-y-2">
                            <div className="flex justify-between text-[9px] font-ui text-muted-foreground">
                              <span>Teacher {Math.round(m.value)}%</span>
                              <span>Student {Math.round(100 - m.value)}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-muted/50 overflow-hidden flex">
                              <div
                                className="h-full bg-primary/70 rounded-l-full transition-all duration-1000"
                                style={{ width: `${m.value}%` }}
                              />
                              <div className="h-full bg-emerald-500/40 rounded-r-full flex-1" />
                            </div>
                            <p
                              className={`text-center font-display text-lg font-bold ${m.value > 75 ? "text-amber-600" : m.value > 50 ? "text-emerald-600" : "text-red-500"}`}
                            >
                              {Math.round(m.value)}%
                            </p>
                          </div>
                        ) : isBar ? (
                          /* Bar for Question Velocity */
                          <div className="w-full space-y-1">
                            <div className="flex items-end gap-1 justify-center h-12">
                              {Array.from(
                                { length: Math.min(Math.round(m.value), 15) },
                                (_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 rounded-t-sm ${color.bg} transition-all duration-500`}
                                    style={{
                                      height: `${20 + Math.random() * 80}%`,
                                      opacity: 0.5 + (i / 15) * 0.5,
                                      animationDelay: `${i * 0.05}s`,
                                    }}
                                  />
                                ),
                              )}
                            </div>
                            <p
                              className={`text-center font-display text-lg font-bold ${color.text}`}
                            >
                              {m.value.toFixed(1)}
                            </p>
                            <p className="text-center text-[8px] font-ui text-muted-foreground">
                              {m.unit}
                            </p>
                          </div>
                        ) : (
                          /* Circular progress for Review, Wait, Hinglish */
                          <div className="relative">
                            <CircularProgress
                              value={m.value}
                              max={m.max}
                              label={m.name}
                              unit={m.unit}
                            />
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-[9px] font-ui text-muted-foreground/60 leading-tight mt-auto">
                        {m.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Tab Navigation for Mobile */}
        <div className="flex gap-2 mb-6 md:hidden">
          {(["timetable", "lectures", "upload"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-ui uppercase tracking-wider transition-all border-2 border-dashed ${
                activeTab === tab
                  ? "border-primary/40 bg-primary/5 text-primary font-semibold"
                  : "border-border text-muted-foreground hover:border-primary/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ───── TIMETABLE CALENDAR ───── */}
          <div
            className={`lg:col-span-8 ${activeTab !== "timetable" ? "hidden md:block" : ""}`}
          >
            <div className="border-2 border-dashed border-border/70 rounded-xl bg-card overflow-hidden">
              {/* Calendar Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-dashed border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border border-dashed border-primary/20 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
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
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      Weekly Timetable
                    </h3>
                    <p className="text-xs font-ui text-muted-foreground">
                      Your regular class schedule
                    </p>
                  </div>
                </div>
                <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 border-dashed font-ui text-xs uppercase tracking-wider"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-display">
                        Add New Class
                      </DialogTitle>
                      <DialogDescription className="font-ui text-xs">
                        Add a class to your weekly timetable.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="day"
                          className="text-right font-ui text-xs uppercase tracking-wider"
                        >
                          Day
                        </Label>
                        <Select
                          onValueChange={(val: string) =>
                            setNewClass({ ...newClass, dayOfWeek: val })
                          }
                          defaultValue={newClass.dayOfWeek}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS.map((d) => (
                              <SelectItem key={d} value={d}>
                                {DAY_SHORT[d]} —{" "}
                                {d.charAt(0) + d.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-ui text-xs uppercase tracking-wider">
                          Course
                        </Label>
                        <Input
                          className="col-span-3"
                          placeholder="e.g. Data Structures"
                          value={newClass.courseName}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              courseName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-ui text-xs uppercase tracking-wider">
                          Start
                        </Label>
                        <Input
                          type="time"
                          className="col-span-3"
                          value={newClass.startTime}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-ui text-xs uppercase tracking-wider">
                          End
                        </Label>
                        <Input
                          type="time"
                          className="col-span-3"
                          value={newClass.endTime}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              endTime: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-ui text-xs uppercase tracking-wider">
                          Room
                        </Label>
                        <Input
                          className="col-span-3"
                          placeholder="e.g. LH-301"
                          value={newClass.roomNumber}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              roomNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleAddClass}
                        className="font-ui text-xs uppercase tracking-wider"
                      >
                        Save Class
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* Day Headers */}
                  <div className="grid grid-cols-[60px_repeat(6,1fr)] border-b border-dashed border-border">
                    <div className="p-2" />
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className="p-2 text-center border-l border-dashed border-border"
                      >
                        <span className="text-[10px] font-ui font-semibold text-muted-foreground uppercase tracking-widest">
                          {DAY_SHORT[day]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Time Rows */}
                  <div
                    className="relative grid grid-cols-[60px_repeat(6,1fr)]"
                    style={{ height: "550px" }}
                  >
                    {/* Hour lines */}
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className="absolute left-0 right-0 border-t border-dashed border-border/50"
                        style={{ top: `${((hour - 8) / 11) * 100}%` }}
                      >
                        <span className="absolute -top-2.5 left-1.5 text-[10px] font-ui text-muted-foreground/60">
                          {hour > 12 ? hour - 12 : hour}
                          {hour >= 12 ? "P" : "A"}
                        </span>
                      </div>
                    ))}

                    {/* Day columns */}
                    {DAYS.map((day, dayIndex) => (
                      <div
                        key={day}
                        className="absolute top-0 bottom-0 border-l border-dashed border-border/40"
                        style={{
                          left: `${((dayIndex + 1) / 7) * 100}%`,
                          width: `${(1 / 7) * 100}%`,
                        }}
                      >
                        {timetable
                          .filter((slot) => slot.dayOfWeek === day)
                          .map((slot, i) => {
                            const style = getSlotStyle(slot);
                            const colorClass = getSlotColor(
                              timetable.indexOf(slot),
                            );
                            return (
                              <div
                                key={slot.id}
                                className={`absolute left-1 right-1 rounded-lg border-2 border-dashed px-2 py-1.5 cursor-pointer group transition-all hover:shadow-md ${colorClass}`}
                                style={style}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-sans font-semibold truncate leading-tight">
                                      {slot.courseName}
                                    </p>
                                    <p className="text-[9px] font-ui opacity-70 mt-0.5 truncate">
                                      {formatTime12(slot.startTime)} —{" "}
                                      {formatTime12(slot.endTime)}
                                    </p>
                                    <p className="text-[9px] font-ui opacity-60 truncate">
                                      {slot.roomNumber}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClass(slot.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-500/10"
                                  >
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Row */}
              {timetable.length === 0 && (
                <div className="border-t border-dashed border-border p-8 text-center">
                  <div className="w-10 h-10 rounded-lg border-2 border-dashed border-border mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-muted-foreground/40" />
                  </div>
                  <p className="font-sans text-sm text-muted-foreground">
                    No classes scheduled yet.
                  </p>
                  <p className="font-ui text-xs text-muted-foreground/60 mt-1">
                    Click &ldquo;Add Class&rdquo; to get started
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ───── RIGHT SIDEBAR ───── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upload Recording Card */}
            <div
              className={`${activeTab !== "upload" ? "hidden md:block" : ""}`}
            >
              <div className="border-2 border-dashed border-border/70 rounded-xl bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-dashed border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-dashed border-primary/20 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      Upload Recording
                    </h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <Label className="font-ui text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Lecture Title
                    </Label>
                    <Input
                      placeholder="e.g. Intro to Algorithms — Week 3"
                      value={uploadForm.title}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="font-ui text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Link to Class (Optional)
                    </Label>
                    <Select
                      onValueChange={(val: string) =>
                        setUploadForm({ ...uploadForm, classSlotId: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timetable.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id.toString()}>
                            {DAY_SHORT[slot.dayOfWeek]} · {slot.courseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-ui text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Audio File
                    </Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          setAudioFile(e.target.files[0]);
                      }}
                    />
                    {audioFile ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5">
                        <FileAudio className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-sans font-medium text-foreground truncate">
                            {audioFile.name}
                          </p>
                          <p className="text-[10px] font-ui text-muted-foreground">
                            {(audioFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setAudioFile(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="p-1 rounded hover:bg-red-500/10"
                        >
                          <X className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/30 transition-colors flex flex-col items-center gap-2 group"
                      >
                        <div className="w-10 h-10 rounded-lg border-2 border-dashed border-border group-hover:border-primary/30 flex items-center justify-center transition-colors">
                          <Mic className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-sans text-muted-foreground group-hover:text-foreground transition-colors">
                            Click to upload audio
                          </p>
                          <p className="text-[10px] font-ui text-muted-foreground/50 mt-0.5">
                            MP3, WAV, M4A — up to 200MB
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                  <Button
                    onClick={handleUploadRecording}
                    disabled={!uploadForm.title || uploading}
                    className="w-full font-ui text-xs uppercase tracking-wider h-10 gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-dashed border-primary-foreground/50 rounded animate-spin" />
                        Uploading...
                      </>
                    ) : uploadSuccess ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        Uploaded!
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Upload Recording
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Lectures Card */}
            <div
              className={`${activeTab !== "lectures" ? "hidden md:block" : ""}`}
            >
              <div className="border-2 border-dashed border-border/70 rounded-xl bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-dashed border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-dashed border-primary/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary"
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
                      <h3 className="font-display text-base font-semibold text-foreground">
                        Recent Lectures
                      </h3>
                      <p className="text-[10px] font-ui text-muted-foreground">
                        Latest analyzed sessions
                      </p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-dashed divide-border">
                  {lectures.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-10 h-10 rounded-lg border-2 border-dashed border-border mx-auto mb-3 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-muted-foreground/40" />
                      </div>
                      <p className="font-sans text-sm text-muted-foreground">
                        No lectures yet.
                      </p>
                      <p className="font-ui text-xs text-muted-foreground/60 mt-1">
                        Upload a recording to get started
                      </p>
                    </div>
                  ) : (
                    lectures.map((lecture) => (
                      <div
                        key={lecture.id}
                        className="px-5 py-3.5 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-sans text-sm font-medium text-foreground truncate pr-3">
                            {lecture.lectureTitle}
                          </h4>
                          <div
                            className={`text-right flex-shrink-0 rounded-md px-2 py-0.5 ${getScoreBg(lecture.score)}`}
                          >
                            <span
                              className={`text-sm font-display font-bold ${getScoreColor(lecture.score)}`}
                            >
                              {Math.round(lecture.score)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-3 h-3 text-muted-foreground/40" />
                          <span className="text-[10px] font-ui text-muted-foreground">
                            {new Date(lecture.uploadedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        {/* Mini metric bars */}
                        <div className="flex gap-1">
                          {[
                            {
                              label: "RR",
                              val: lecture.reviewRatio ?? 72,
                              max: 100,
                            },
                            {
                              label: "QV",
                              val: lecture.questionVelocity ?? 6,
                              max: 15,
                            },
                            { label: "WT", val: lecture.waitTime ?? 3, max: 6 },
                            {
                              label: "TTT",
                              val: lecture.teacherTalkingTime ?? 65,
                              max: 100,
                            },
                            {
                              label: "HF",
                              val: lecture.hinglishFluency ?? 85,
                              max: 100,
                            },
                          ].map((bar) => {
                            const pct = Math.min(
                              (bar.val / bar.max) * 100,
                              100,
                            );
                            const barColor =
                              pct >= 75
                                ? "bg-emerald-500"
                                : pct >= 50
                                  ? "bg-amber-500"
                                  : "bg-red-500";
                            return (
                              <div
                                key={bar.label}
                                className="flex-1"
                                title={`${bar.label}: ${Math.round(pct)}%`}
                              >
                                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${barColor} transition-all duration-700`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <p className="text-[7px] font-ui text-muted-foreground/50 text-center mt-0.5">
                                  {bar.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-dashed border-border pt-6 flex items-center justify-between">
          <p className="text-xs font-ui text-muted-foreground/40">
            KR Mangalam University · Classroom Observation Tool
          </p>
          <p className="text-xs font-ui text-muted-foreground/40">
            End-to-end encrypted · Privacy-first
          </p>
        </div>
      </main>
    </div>
  );
}
