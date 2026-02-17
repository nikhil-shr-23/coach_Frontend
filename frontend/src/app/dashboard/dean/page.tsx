"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/dashboard/user-nav";
import { Notifications } from "@/components/dashboard/notifications";

const API_BASE = "http://localhost:8080";

const UNIVERSITY_SCHOOLS = [
  { code: "OAD", name: "Architecture & Design" },
  { code: "SBAS", name: "Basic & Applied Sciences" },
  { code: "SMAS", name: "Medical & Allied Sciences - Pharmacy" },
  { code: "SOED", name: "Education" },
  { code: "SOHMCT", name: "Hotel Mgmt. & Catering Tech." },
  { code: "SPRS", name: "Physiotherapy & Rehab Sciences" },
  { code: "SOAS", name: "Agriculture" },
  { code: "SEMCE", name: "Media & Communication" },
  { code: "SOLA", name: "Liberal Arts" },
  { code: "SOET", name: "Engineering & Technology" },
  { code: "SOMC", name: "Management & Commerce" },
  { code: "SOLS", name: "Law" },
] as const;

interface Faculty {
  id: number;
  name: string;
  department: string;
  lecturesAnalyzed: number;
  avgScore: number;
  lastActive: string | null;
}

interface DeanInfo {
  name: string;
  email: string;
  role: string;
  isSuperAdmin: boolean;
  school?: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-500";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-600";
  if (score >= 60) return "bg-amber-500/10 text-amber-600";
  return "bg-red-500/10 text-red-600";
}

function DeanDashboardContent() {
  const searchParams = useSearchParams();
  const querySchool = searchParams.get("school") || "";

  const [deanInfo, setDeanInfo] = useState<DeanInfo | null>(null);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDean, setIsLoadingDean] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch dean info on mount
  useEffect(() => {
    const fetchDeanInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/dashboard/dean/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data: DeanInfo = await res.json();
          setDeanInfo(data);

          // If dean (not super admin), lock to their school
          if (!data.isSuperAdmin && data.school) {
            setSelectedSchool(data.school);
          } else if (querySchool) {
            setSelectedSchool(querySchool);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dean info", error);
      } finally {
        setIsLoadingDean(false);
      }
    };
    fetchDeanInfo();
  }, [querySchool]);

  // Fetch faculty when a school is selected
  useEffect(() => {
    if (!selectedSchool) {
      setFacultyList([]);
      return;
    }

    const fetchFaculty = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE}/api/dashboard/school/${encodeURIComponent(selectedSchool)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data = await res.json();
          const mapped: Faculty[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            department: item.department || "General",
            lecturesAnalyzed: item.lecturesAnalyzed || 0,
            avgScore: Math.round((item.avgScore || 0) * 10) / 10,
            lastActive: item.lastActive
              ? new Date(item.lastActive).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : null,
          }));
          setFacultyList(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch faculty", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculty();
  }, [selectedSchool]);

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isLocked = deanInfo && !deanInfo.isSuperAdmin && !!deanInfo.school;
  const schoolInfo = UNIVERSITY_SCHOOLS.find((s) => s.name === selectedSchool);

  // Aggregate stats
  const totalFaculty = facultyList.length;
  const totalLectures = facultyList.reduce(
    (sum, f) => sum + f.lecturesAnalyzed,
    0,
  );
  const avgScore =
    totalFaculty > 0
      ? Math.round(
          facultyList.reduce((sum, f) => sum + f.avgScore, 0) / totalFaculty,
        )
      : 0;

  // Department breakdown
  const deptMap = new Map<
    string,
    { count: number; lectures: number; scoreSum: number }
  >();
  facultyList.forEach((f) => {
    const dept = f.department || "General";
    if (!deptMap.has(dept))
      deptMap.set(dept, { count: 0, lectures: 0, scoreSum: 0 });
    const entry = deptMap.get(dept)!;
    entry.count++;
    entry.lectures += f.lecturesAnalyzed;
    entry.scoreSum += f.avgScore;
  });

  const departments = Array.from(deptMap.entries()).map(([name, stats]) => ({
    name,
    count: stats.count,
    lectures: stats.lectures,
    avgScore: stats.count > 0 ? Math.round(stats.scoreSum / stats.count) : 0,
  }));

  if (isLoadingDean) {
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
  }

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
                KR Mangalam University
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="border-dashed font-ui text-xs uppercase tracking-wider px-3 py-1"
            >
              Dean
            </Badge>
            {isLocked && schoolInfo && (
              <Badge className="bg-primary/10 text-primary border border-dashed border-primary/30 font-ui text-xs px-3 py-1">
                {schoolInfo.code}
              </Badge>
            )}
            <Notifications />
            <Separator orientation="vertical" className="h-6" />
            <UserNav
              name={deanInfo?.name || "Dean"}
              email={deanInfo?.email || "dean@krmangalam.edu.in"}
              initials={
                deanInfo?.name
                  ? deanInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "DN"
              }
              role="Dean"
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Faculty Tracker
          </h2>
          <p className="font-sans text-muted-foreground text-sm mt-1">
            {isLocked
              ? `Viewing teachers under ${schoolInfo?.code || selectedSchool}`
              : "Select a school to view and track teacher performance"}
          </p>
        </div>

        {/* School Selector Grid — only show if NOT locked to one school */}
        {!isLocked && (
          <div className="mb-8">
            <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Select School
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {UNIVERSITY_SCHOOLS.map((school) => (
                <button
                  key={school.code}
                  onClick={() =>
                    setSelectedSchool(
                      selectedSchool === school.name ? "" : school.name,
                    )
                  }
                  className={`group relative border-2 border-dashed rounded-xl p-3 text-left transition-all duration-300 cursor-pointer ${
                    selectedSchool === school.name
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/60 hover:border-primary/40 hover:bg-card"
                  }`}
                >
                  <div
                    className={`text-sm font-display font-bold mb-0.5 transition-colors ${
                      selectedSchool === school.name
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {school.code}
                  </div>
                  <div className="text-[10px] font-ui text-muted-foreground leading-tight line-clamp-2">
                    {school.name}
                  </div>
                  {selectedSchool === school.name && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected School Content */}
        {selectedSchool ? (
          <>
            {/* School Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center bg-primary/5">
                  <span className="font-display text-base font-bold text-primary">
                    {schoolInfo?.code || "?"}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {schoolInfo?.name || selectedSchool}
                  </h3>
                  <p className="text-xs font-ui text-muted-foreground">
                    School of {schoolInfo?.name || selectedSchool}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
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
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>
                  <span className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                    Total Faculty
                  </span>
                </div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {totalFaculty}
                </p>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
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
                      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    />
                  </svg>
                  <span className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                    Lectures Analyzed
                  </span>
                </div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {totalLectures}
                </p>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
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
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                  <span className="text-xs font-ui font-medium text-muted-foreground uppercase tracking-wider">
                    School Avg. Score
                  </span>
                </div>
                <p
                  className={`font-display text-2xl font-bold ${getScoreColor(avgScore)}`}
                >
                  {avgScore}%
                </p>
              </div>
            </div>

            {/* Department Breakdown */}
            {departments.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Department Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {departments.map((dept) => (
                    <div
                      key={dept.name}
                      className="border border-dashed border-border/60 rounded-xl p-3 bg-card"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-sans text-sm font-semibold text-foreground truncate mr-2">
                          {dept.name}
                        </h4>
                        <span
                          className={`text-sm font-bold whitespace-nowrap ${getScoreColor(dept.avgScore)}`}
                        >
                          {dept.avgScore}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-ui">
                        <span>{dept.count} Faculty</span>
                        <span>{dept.lectures} Lectures</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Faculty Table */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
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
                      <th className="text-left px-6 py-3.5 text-[10px] font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                        Faculty Name
                      </th>
                      <th className="text-left px-6 py-3.5 text-[10px] font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                        Department
                      </th>
                      <th className="text-center px-6 py-3.5 text-[10px] font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                        Lectures
                      </th>
                      <th className="text-center px-6 py-3.5 text-[10px] font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                        Avg. Score
                      </th>
                      <th className="text-left px-6 py-3.5 text-[10px] font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-border">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-dashed border-primary/40 rounded-lg animate-spin" />
                            <span className="text-sm font-ui text-muted-foreground">
                              Loading faculty...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredFaculty.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-12 text-muted-foreground font-ui text-sm"
                        >
                          {searchQuery
                            ? `No faculty found matching "${searchQuery}"`
                            : "No faculty registered in this school yet"}
                        </td>
                      </tr>
                    ) : (
                      filteredFaculty.map((faculty) => (
                        <tr
                          key={faculty.id}
                          className="hover:bg-muted/20 transition-colors group"
                        >
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8 border border-dashed border-border">
                                <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
                                  {faculty.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-sans text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {faculty.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-sm font-ui text-muted-foreground">
                            {faculty.department}
                          </td>
                          <td className="px-6 py-3.5 text-center">
                            <span className="font-sans text-sm font-medium text-foreground">
                              {faculty.lecturesAnalyzed}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${getScoreBg(faculty.avgScore)}`}
                            >
                              {faculty.avgScore}%
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-xs font-ui text-muted-foreground">
                            {faculty.lastActive || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="border-2 border-dashed border-border rounded-xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-primary/40"
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
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-1">
              Select a School
            </h3>
            <p className="font-sans text-sm text-muted-foreground max-w-md mx-auto">
              Choose one of the university schools above to view and track
              teacher performance across their departments.
            </p>
          </div>
        )}

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

export default function DeanDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-dashed border-primary/40 rounded-lg animate-spin mx-auto" />
            <p className="text-sm font-ui text-muted-foreground">
              Loading dashboard...
            </p>
          </div>
        </div>
      }
    >
      <DeanDashboardContent />
    </Suspense>
  );
}
