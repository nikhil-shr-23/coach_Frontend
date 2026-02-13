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

type UserRole = "superadmin" | "admin" | "teacher";

interface School {
  id: string;
  name: string;
  shortName: string;
  dean: string;
  facultyCount: number;
  lecturesAnalyzed: number;
  avgScore: number;
  status: "active" | "pending" | "inactive";
}

const SCHOOLS: School[] = [
  {
    id: "soet",
    name: "School of Engineering & Technology",
    shortName: "SOET",
    dean: "Dr. Rajesh Kumar",
    facultyCount: 62,
    lecturesAnalyzed: 184,
    avgScore: 78,
    status: "active",
  },
  {
    id: "soad",
    name: "School of Architecture & Design",
    shortName: "SOAD",
    dean: "Dr. Meena Sharma",
    facultyCount: 28,
    lecturesAnalyzed: 91,
    avgScore: 82,
    status: "active",
  },
  {
    id: "somc",
    name: "School of Management & Commerce",
    shortName: "SOMC",
    dean: "Dr. Ankit Verma",
    facultyCount: 45,
    lecturesAnalyzed: 132,
    avgScore: 75,
    status: "active",
  },
  {
    id: "somj",
    name: "School of Media & Journalism",
    shortName: "SOMJ",
    dean: "Dr. Priya Singh",
    facultyCount: 22,
    lecturesAnalyzed: 67,
    avgScore: 80,
    status: "active",
  },
  {
    id: "soed",
    name: "School of Education",
    shortName: "SOED",
    dean: "Dr. Sunil Gupta",
    facultyCount: 30,
    lecturesAnalyzed: 105,
    avgScore: 85,
    status: "active",
  },
  {
    id: "sols",
    name: "School of Legal Studies",
    shortName: "SOLS",
    dean: "Dr. Kavita Rao",
    facultyCount: 26,
    lecturesAnalyzed: 72,
    avgScore: 77,
    status: "active",
  },
  {
    id: "sohs",
    name: "School of Health Sciences",
    shortName: "SOHS",
    dean: "Dr. Arun Patel",
    facultyCount: 38,
    lecturesAnalyzed: 114,
    avgScore: 81,
    status: "active",
  },
  {
    id: "sobs",
    name: "School of Basic Sciences",
    shortName: "SOBS",
    dean: "Dr. Neha Joshi",
    facultyCount: 34,
    lecturesAnalyzed: 98,
    avgScore: 76,
    status: "pending",
  },
  {
    id: "sofa",
    name: "School of Fine Arts",
    shortName: "SOFA",
    dean: "Dr. Vikram Bhat",
    facultyCount: 18,
    lecturesAnalyzed: 43,
    avgScore: 83,
    status: "active",
  },
  {
    id: "sohs2",
    name: "School of Hospitality Sciences",
    shortName: "SOHS",
    dean: "Dr. Rekha Nair",
    facultyCount: 20,
    lecturesAnalyzed: 56,
    avgScore: 79,
    status: "pending",
  },
  {
    id: "soas",
    name: "School of Applied Sciences",
    shortName: "SOAS",
    dean: "Dr. Deepak Mishra",
    facultyCount: 32,
    lecturesAnalyzed: 88,
    avgScore: 74,
    status: "active",
  },
  {
    id: "sop",
    name: "School of Pharmacy",
    shortName: "SOP",
    dean: "Dr. Pooja Agarwal",
    facultyCount: 24,
    lecturesAnalyzed: 61,
    avgScore: 80,
    status: "inactive",
  },
];

function getStatusColor(status: School["status"]) {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "pending":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "inactive":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 70) return "text-amber-600";
  return "text-red-500";
}

export default function DashboardPage() {
  const [currentRole] = useState<UserRole>("superadmin");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchools = SCHOOLS.filter(
    (school) =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.dean.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalFaculty = SCHOOLS.reduce((sum, s) => sum + s.facultyCount, 0);
  const totalLectures = SCHOOLS.reduce((sum, s) => sum + s.lecturesAnalyzed, 0);
  const avgOverallScore = Math.round(
    SCHOOLS.reduce((sum, s) => sum + s.avgScore, 0) / SCHOOLS.length,
  );
  const activeSchools = SCHOOLS.filter((s) => s.status === "active").length;

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
              {currentRole === "superadmin"
                ? "Super Admin"
                : currentRole === "admin"
                  ? "Dean"
                  : "Faculty"}
            </Badge>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border border-dashed border-border">
                <AvatarFallback className="font-ui text-xs font-semibold bg-primary/10 text-primary">
                  SA
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-sans font-medium text-foreground leading-none">
                  Super Admin
                </p>
                <p className="text-xs font-ui text-muted-foreground mt-0.5">
                  admin@krmangalam.edu.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            University Overview
          </h2>
          <p className="font-sans text-muted-foreground text-sm mt-1">
            Monitor pedagogical metrics across all schools
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Schools",
              value: SCHOOLS.length.toString(),
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
                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                  />
                </svg>
              ),
            },
            {
              label: "Total Faculty",
              value: totalFaculty.toString(),
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
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              ),
            },
            {
              label: "Lectures Analyzed",
              value: totalLectures.toString(),
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
              label: "Avg. Score",
              value: `${avgOverallScore}%`,
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
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-2 border-dashed border-border rounded-xl p-4 bg-card"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="text-muted-foreground">{stat.icon}</div>
                <span className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-lg font-semibold text-foreground">
              All Schools
            </h3>
            <Badge variant="secondary" className="font-ui text-xs">
              {activeSchools} Active
            </Badge>
          </div>
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
              placeholder="Search schools, deans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-dashed border-border bg-background font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSchools.map((school) => (
            <Card
              key={school.id}
              className="border-2 border-dashed border-border/70 hover:border-primary/30 transition-all duration-300 hover:shadow-md group cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-dashed border-primary/20">
                      <AvatarFallback className="font-ui text-xs font-bold bg-primary/10 text-primary">
                        {school.shortName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-sans text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {school.shortName}
                      </CardTitle>
                      <CardDescription className="text-xs font-ui mt-0.5 leading-tight">
                        {school.name}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-ui uppercase tracking-wider border-dashed ${getStatusColor(school.status)}`}
                  >
                    {school.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Separator className="mb-4 border-dashed" />

                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-3.5 h-3.5 text-muted-foreground/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  <span className="text-xs font-ui text-muted-foreground">
                    {school.dean}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-dashed border-border/50 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">
                      Faculty
                    </p>
                    <p className="font-sans text-base font-bold text-foreground mt-0.5">
                      {school.facultyCount}
                    </p>
                  </div>
                  <div className="border border-dashed border-border/50 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">
                      Lectures
                    </p>
                    <p className="font-sans text-base font-bold text-foreground mt-0.5">
                      {school.lecturesAnalyzed}
                    </p>
                  </div>
                  <div className="border border-dashed border-border/50 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider">
                      Score
                    </p>
                    <p
                      className={`font-sans text-base font-bold mt-0.5 ${getScoreColor(school.avgScore)}`}
                    >
                      {school.avgScore}%
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full mt-4 font-ui text-xs uppercase tracking-wider h-9 border border-dashed border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  View School Dashboard →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchools.length === 0 && (
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <p className="font-sans text-sm text-muted-foreground">
              No schools found matching &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

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
