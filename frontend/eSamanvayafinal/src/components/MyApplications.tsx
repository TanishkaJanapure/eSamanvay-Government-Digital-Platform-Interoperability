import { useState } from "react";
import { IcFile, IcClock, IcCheck, IcArrowRight, IcSearch, IcFilter } from "./Icons";

const APPLICATIONS = [
  {
    id: "AP-2024-9105",
    name: "Birth Certificate",
    dept: "Municipal Corporation, Pune",
    category: "Certificates",
    status: "Submitted" as const,
    submitted: "21 Nov 2024",
    updated: "22 Nov 2024",
    progress: 25,
    timeline: [
      { label: "Application Submitted", done: true, date: "21 Nov 2024, 10:34 AM" },
      { label: "Document Verification", done: false, date: "Pending" },
      { label: "Officer Review", done: false, date: "Pending" },
      { label: "Certificate Issued", done: false, date: "Pending" },
    ],
  },
  {
    id: "AP-2024-8821",
    name: "Income Certificate",
    dept: "Revenue Department, Pune",
    category: "Revenue",
    status: "Completed" as const,
    submitted: "1 Nov 2024",
    updated: "12 Nov 2024",
    progress: 100,
    timeline: [
      { label: "Application Submitted", done: true, date: "1 Nov 2024, 09:12 AM" },
      { label: "Document Verification", done: true, date: "3 Nov 2024, 2:45 PM" },
      { label: "Officer Review", done: true, date: "8 Nov 2024, 11:00 AM" },
      { label: "Certificate Issued", done: true, date: "12 Nov 2024, 4:30 PM" },
    ],
  },
  {
    id: "AP-2024-7643",
    name: "Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna",
    dept: "Directorate of Technical Education / MahaDBT",
    category: "Education",
    status: "Under Verification" as const,
    submitted: "5 Nov 2024",
    updated: "20 Nov 2024",
    progress: 55,
    timeline: [
      { label: "Application Submitted", done: true, date: "5 Nov 2024, 3:20 PM" },
      { label: "Document Verification", done: true, date: "12 Nov 2024, 10:00 AM" },
      { label: "Eligibility Review", done: false, date: "In Progress" },
      { label: "Scholarship Sanctioned", done: false, date: "Pending" },
    ],
  },
  {
    id: "AP-2024-6392",
    name: "Property Tax Exemption",
    dept: "Revenue Department, Pune",
    category: "Revenue",
    status: "Draft" as const,
    submitted: "—",
    updated: "28 Oct 2024",
    progress: 10,
    timeline: [
      { label: "Application Started", done: true, date: "28 Oct 2024" },
      { label: "Documents Pending", done: false, date: "Action required" },
      { label: "Submission", done: false, date: "Pending" },
      { label: "Approval", done: false, date: "Pending" },
    ],
  },
];

type Status = "All" | "Draft" | "Submitted" | "Under Verification" | "Completed";

const STATUS_META: Record<string, { color: string; bg: string; border: string }> = {
  Draft: { color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
  Submitted: { color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  "Under Verification": { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  Completed: { color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
};

export default function MyApplications() {
  const [filter, setFilter] = useState<Status>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = APPLICATIONS.filter((a) => {
    const matchStatus = filter === "All" || a.status === filter;
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>My Applications</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Track and manage all your government service applications</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: "#1D4ED8" }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 4.5v15M4.5 12h15" />
          </svg>
          New Application
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border bg-white"
          style={{ borderColor: "#E2E8F0" }}
        >
          <IcSearch size={15} className="text-slate-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or application ID…"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#0F172A" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Draft", "Submitted", "Under Verification", "Completed"] as Status[]).map((s) => {
            const meta = s === "All" ? null : STATUS_META[s];
            const active = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-3 py-2 rounded-lg text-xs font-semibold border transition-colors"
                style={{
                  background: active ? (meta?.bg ?? "#0F172A") : "white",
                  color: active ? (meta?.color ?? "white") : "#64748B",
                  borderColor: active ? (meta?.border ?? "#0F172A") : "#E2E8F0",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Application list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <IcFile size={22} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium" style={{ color: "#334155" }}>No applications found</p>
          </div>
        ) : (
          filtered.map((app) => {
            const meta = STATUS_META[app.status];
            const isOpen = expanded === app.id;
            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-sm"
                style={{ borderColor: "#E2E8F0" }}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {app.status === "Completed" ? <IcCheck size={16} /> : <IcFile size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>{app.name}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-0.5 text-xs" style={{ color: "#94A3B8" }}>
                      <span>{app.dept}</span>
                      <span>·</span>
                      <span>{app.id}</span>
                      <span>·</span>
                      <span>Updated {app.updated}</span>
                    </div>
                  </div>
                  {/* Progress pill */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${app.progress}%`, background: meta.color }}
                      />
                    </div>
                    <span className="text-xs font-medium w-7 text-right" style={{ color: meta.color }}>{app.progress}%</span>
                  </div>
                  <svg
                    width="16" height="16" fill="none" stroke="#94A3B8" strokeWidth="2" viewBox="0 0 24 24"
                    className={`flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Expanded timeline */}
                {isOpen && (
                  <div className="border-t px-5 py-4" style={{ borderColor: "#F1F5F9" }}>
                    <p className="text-xs font-semibold mb-4" style={{ color: "#94A3B8" }}>APPLICATION TIMELINE</p>
                    <div className="space-y-0">
                      {app.timeline.map((step, i) => (
                        <div key={step.label} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                              style={{
                                background: step.done ? "#1D4ED8" : "#F1F5F9",
                                border: step.done ? "none" : "2px solid #E2E8F0",
                              }}
                            >
                              {step.done
                                ? <IcCheck size={13} stroke="white" />
                                : <IcClock size={13} stroke="#94A3B8" />}
                            </div>
                            {i < app.timeline.length - 1 && (
                              <div
                                className="w-px flex-1 my-1"
                                style={{ background: step.done ? "#BFDBFE" : "#F1F5F9", minHeight: "20px" }}
                              />
                            )}
                          </div>
                          <div className="pb-5">
                            <div
                              className="text-sm font-medium"
                              style={{ color: step.done ? "#0F172A" : "#94A3B8" }}
                            >
                              {step.label}
                            </div>
                            <div className="text-xs mt-0.5" style={{ color: "#CBD5E1" }}>{step.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {app.status === "Draft" && (
                        <button
                          className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                          style={{ background: "#1D4ED8" }}
                        >
                          Complete & Submit
                        </button>
                      )}
                      {app.status === "Completed" && (
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: "#E2E8F0", color: "#334155" }}>
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
                          </svg>
                          Download Certificate
                        </button>
                      )}
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
                        View Full Details <IcArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
