"use client";

import { useState } from "react";
import Link from "next/link";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserNav } from "@/components/dashboard/user-nav";
import { Notifications } from "@/components/dashboard/notifications";

interface Department {
  name: string;
  facultyCount: number;
  lecturesAnalyzed: number;
  avgScore: number;
}

interface Faculty {
  id: string;
  name: string;
  department: string;
  lecturesAnalyzed: number;
  avgScore: number;
  status: "active" | "inactive";
  lastActive: string;
}

const SCHOOL = {
  name: "School of Engineering & Technology",
  shortName: "SOET",
  dean: "Dr. Rajesh Kumar",
  totalFaculty: 62,
  totalLectures: 184,
  avgScore: 78,
};

const DEPARTMENTS: Department[] = [
  {
    name: "Computer Science (CSE)",
    facultyCount: 24,
    lecturesAnalyzed: 85,
    avgScore: 81,
  },
  {
    name: "Electronics (ECE)",
    facultyCount: 12,
    lecturesAnalyzed: 32,
    avgScore: 76,
  },
  {
    name: "Mechanical (ME)",
    facultyCount: 14,
    lecturesAnalyzed: 41,
    avgScore: 74,
  },
  { name: "Civil (CE)", facultyCount: 12, lecturesAnalyzed: 26, avgScore: 79 },
];

const FACULTY_LIST: Faculty[] = [
  {
    id: "f1",
    name: "Dr. Ananya Mehta",
    department: "Computer Science",
    lecturesAnalyzed: 24,
    avgScore: 81,
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "f2",
    name: "Prof. Suresh Gupta",
    department: "Mechanical",
    lecturesAnalyzed: 18,
    avgScore: 72,
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: "f3",
    name: "Dr. Kavita Singh",
    department: "Electronics",
    lecturesAnalyzed: 15,
    avgScore: 78,
    status: "active",
    lastActive: "3 days ago",
  },
  {
    id: "f4",
    name: "Mr. Rahul Sharma",
    department: "Computer Science",
    lecturesAnalyzed: 12,
    avgScore: 85,
    status: "active",
    lastActive: "5 hours ago",
  },
  {
    id: "f5",
    name: "Ms. Priyanka Das",
    department: "Civil",
    lecturesAnalyzed: 9,
    avgScore: 79,
    status: "inactive",
    lastActive: "1 week ago",
  },
  {
    id: "f6",
    name: "Dr. Amit Verma",
    department: "Mechanical",
    lecturesAnalyzed: 22,
    avgScore: 75,
    status: "active",
    lastActive: "2 days ago",
  },
  {
    id: "f7",
    name: "Prof. Neha Kapoor",
    department: "Electronics",
    lecturesAnalyzed: 17,
    avgScore: 74,
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: "f8",
    name: "Dr. Vikas Reddy",
    department: "Civil",
    lecturesAnalyzed: 17,
    avgScore: 79,
    status: "active",
    lastActive: "4 hours ago",
  },
];

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 70) return "text-amber-600";
  return "text-red-500";
}

export default function DeanDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaculty = FACULTY_LIST.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-dashed border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
              Dean · {SCHOOL.shortName}
            </Badge>
            <Notifications />
            <Separator orientation="vertical" className="h-6" />
            <UserNav
              name={SCHOOL.dean}
              email="dean.soet@krmangalam.edu.in"
              initials="RK"
              role="Dean"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              {SCHOOL.name}
            </h2>
            <Badge
              variant="secondary"
              className="font-ui text-xs uppercase tracking-wider"
            >
              {SCHOOL.shortName}
            </Badge>
          </div>
          <p className="font-sans text-muted-foreground text-sm">
            School Overview & Faculty Performance
          </p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-muted-foreground">
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
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <span className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                Total Faculty
              </span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">
              {SCHOOL.totalFaculty}
            </p>
          </div>
          <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-muted-foreground">
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
              </div>
              <span className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                Lectures Analyzed
              </span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">
              {SCHOOL.totalLectures}
            </p>
          </div>
          <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-muted-foreground">
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
              </div>
              <span className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                School Avg. Score
              </span>
            </div>
            <p
              className={`font-display text-2xl font-bold ${getScoreColor(SCHOOL.avgScore)}`}
            >
              {SCHOOL.avgScore}%
            </p>
          </div>
          <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-muted-foreground">
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
              </div>
              <span className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                Pending Reviews
              </span>
            </div>
            <p className="font-display text-2xl font-bold text-amber-600">12</p>
          </div>
        </div>

        {/* Department Breakdown */}
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Department Performance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {DEPARTMENTS.map((dept) => (
            <Card
              key={dept.name}
              className="border border-dashed border-border/70 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-sans text-sm font-semibold text-foreground">
                  {dept.name}
                </h4>
                <span
                  className={`text-sm font-bold ${getScoreColor(dept.avgScore)}`}
                >
                  {dept.avgScore}%
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-ui">
                <span>{dept.facultyCount} Faculty</span>
                <span>{dept.lecturesAnalyzed} Lectures</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Faculty List */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Faculty Directory
          </h3>
          <div className="relative w-full sm:w-72">
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-dashed border-border bg-background font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-border rounded-xl overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b border-dashed border-border">
                  <th className="text-left px-6 py-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                    Faculty Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                    Department
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                    Lectures
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                    Avg. Score
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-border">
                {filteredFaculty.map((faculty) => (
                  <tr
                    key={faculty.id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-dashed border-border">
                          <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
                            {faculty.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-sans text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {faculty.name}
                          </p>
                          <p
                            className={`text-[10px] font-ui uppercase tracking-wide ${faculty.status === "active" ? "text-emerald-600" : "text-muted-foreground"}`}
                          >
                            {faculty.status}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-ui text-muted-foreground">
                      {faculty.department}
                    </td>
                    <td className="px-6 py-4 text-sm font-sans font-medium text-foreground">
                      {faculty.lecturesAnalyzed}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                          faculty.avgScore >= 80
                            ? "bg-emerald-500/10 text-emerald-600"
                            : faculty.avgScore >= 70
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {faculty.avgScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-ui text-muted-foreground">
                      {faculty.lastActive}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 border border-dashed border-border hover:bg-primary/5 hover:border-primary/30"
                      >
                        <span className="sr-only">Open menu</span>
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                          />
                        </svg>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredFaculty.length === 0 && (
            <div className="p-12 text-center text-muted-foreground font-ui text-sm">
              No faculty members found matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

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
