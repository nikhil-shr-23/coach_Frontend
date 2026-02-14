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
import { Plus, Trash2 } from "lucide-react";
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

interface Lecture {
  id: string; // Using ID for key
  lectureTitle: string;
  lectureAudioUrl: string;
  score: number;
  uploadedAt: string;
  status: "analyzed" | "processing" | "pending"; // Might need adjustment based on backend response
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
  subjectName: string; // Add if available
}

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<TeacherStats | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Class Form State
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
    courseName: "",
    roomNumber: "",
    subjectName: "", // Optional if not used
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Teacher Stats
        const profileRes = await fetch(
          "http://localhost:8080/api/dashboard/teacher/me",
          { headers },
        );
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setTeacher(profileData);

          // 2. Fetch Recent Lectures
          const lecturesRes = await fetch(
            "http://localhost:8080/api/lectures/my-recent",
            { headers },
          );
          if (lecturesRes.ok) {
            const lecturesData = await lecturesRes.json();
            // Map backend response to frontend interface if needed
            setLectures(lecturesData);
          }

          // 3. Fetch Timetable if available
          // Since we don't have the timetable ID in the stats DTO yet (we added it to response but maybe not stats DTO),
          // let's fetch profile ME endpoint or just list classes with timetableId if we have it.
          // Actually `TeacherProfileResponse` has it (accessed via `/api/teacher-profiles/me`), but `/api/dashboard/teacher/me` returns `FacultyStatsDTO`.
          // Let's rely on `/api/teacher-profiles/me` to get the timetable ID properly.

          const fullProfileRes = await fetch(
            "http://localhost:8080/api/teacher-profiles/me",
            { headers },
          );
          if (fullProfileRes.ok) {
            const fullProfile = await fullProfileRes.json();
            if (fullProfile.timetableId) {
              const classesRes = await fetch(
                `http://localhost:8080/api/classes?timetableId=${fullProfile.timetableId}`,
                { headers },
              );
              if (classesRes.ok) {
                setTimetable(await classesRes.json());
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddClass = async () => {
    // Basic validation
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

      // We need timetableId. Let's fetch it again or store it in state better.
      // Quick fix: fetch users profile again to get ID.
      const fullProfileRes = await fetch(
        "http://localhost:8080/api/teacher-profiles/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const fullProfile = await fullProfileRes.json();
      const timetableId = fullProfile.timetableId;

      if (!timetableId) {
        alert("No timetable found for this teacher.");
        return;
      }

      const res = await fetch("http://localhost:8080/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newClass,
          timetableId: timetableId,
          subjectName: newClass.courseName, // fallback
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
    if (!confirm("Are you sure you want to remove this class?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/classes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setTimetable(timetable.filter((t) => t.id !== id));
      } else {
        alert("Failed to delete class");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (!teacher)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Failed to load dashboard.
      </div>
    );

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
                <span>{teacher.department}</span>
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
                  5 Days
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
                {lectures.length === 0 ? (
                  <div className="flex items-center justify-center p-8 text-slate-400 italic">
                    No recent lectures found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lectures.map((lecture) => (
                      <div
                        key={lecture.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium text-slate-900">
                            {lecture.lectureTitle}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {new Date(lecture.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="block text-lg font-bold text-emerald-600">
                            {Math.round(lecture.score)}/100
                          </span>
                          <span className="text-xs text-slate-400">Score</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Col */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Schedule</CardTitle>
                <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Class
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Class</DialogTitle>
                      <DialogDescription>
                        Add a new class to your regular weekly timetable.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="day" className="text-right">
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
                            {[
                              "MONDAY",
                              "TUESDAY",
                              "WEDNESDAY",
                              "THURSDAY",
                              "FRIDAY",
                              "SATURDAY",
                              "SUNDAY",
                            ].map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="course" className="text-right">
                          Course
                        </Label>
                        <Input
                          id="course"
                          className="col-span-3"
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
                        <Label htmlFor="start" className="text-right">
                          Start Time
                        </Label>
                        <Input
                          id="start"
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
                        <Label htmlFor="end" className="text-right">
                          End Time
                        </Label>
                        <Input
                          id="end"
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
                        <Label htmlFor="room" className="text-right">
                          Room
                        </Label>
                        <Input
                          id="room"
                          className="col-span-3"
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
                      <Button onClick={handleAddClass}>Save Class</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {timetable.length === 0 ? (
                  <div className="text-sm text-slate-500 italic text-center py-4">
                    No classes scheduled.
                  </div>
                ) : (
                  timetable.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50/50 group relative"
                    >
                      <div className="w-12 text-center">
                        <div className="text-sm font-bold text-slate-700">
                          {slot.startTime.toString().slice(0, 5)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {slot.dayOfWeek.toString().slice(0, 3)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {slot.courseName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {slot.roomNumber}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClass(slot.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
