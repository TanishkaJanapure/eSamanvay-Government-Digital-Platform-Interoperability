import { useMemo, useState } from "react";
import { buildOfficerTimeline, type OfficerMonitoredApp } from "./citizenApplications";
import { useCitizenApplications } from "./useCitizenApplications";

/* ─── Types ───────────────────────────────────────────── */
type AppStatus = OfficerMonitoredApp["status"];

interface TimelineEvent {
  stage: string;
  description: string;
  status: "done" | "active" | "pending" | "blocked";
  timestamp?: string;
  actor?: string;
}

const STATUS_META: Record<AppStatus, { label: string; color: string; bg: string; border: string }> = {
  draft: { label: "Draft", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
  submitted: { label: "Submitted", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  verified: { label: "Verified", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
  "not-verified": { label: "Not Verified", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  scrutiny: { label: "Under Scrutiny", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  "dept-verify": { label: "Dept. Verification", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  approved: { label: "Approved", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
  disbursed: { label: "Benefit Disbursed", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
  blocked: { label: "Blocked", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
};

const TIMELINE_STATUS_META = {
  done: { color: "#0D9488", bg: "#F0FDFA", border: "#0D9488", dot: "#0D9488" },
  active: { color: "#1D4ED8", bg: "#EFF6FF", border: "#1D4ED8", dot: "#1D4ED8" },
  pending: { color: "#94A3B8", bg: "#F8FAFC", border: "#E2E8F0", dot: "#CBD5E1" },
  blocked: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", dot: "#DC2626" },
};

const BASE_STATUSES = ["All Status", "Submitted", "Verified", "Not Verified", "Under Scrutiny", "Dept. Verification", "Blocked"];

function EmptyApplicationsState() {
  return (
    <div className="bg-white rounded-xl border px-6 py-16 text-center" style={{ borderColor: "#E2E8F0" }}>
      <div
        className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
      >
        <svg width="24" height="24" fill="none" stroke="#94A3B8" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-base font-semibold mb-1" style={{ color: "#0F172A" }}>No applications yet</h2>
      <p className="text-sm max-w-md mx-auto" style={{ color: "#64748B" }}>
        Applications appear here when citizens complete consent and verification in the citizen portal. Submit an application through Find Services to see it listed.
      </p>
    </div>
  );
}

/* ─── Timeline detail ─────────────────────────────────── */
function TimelineDetail({ app, onBack }: { app: OfficerMonitoredApp; onBack: () => void }) {
  const events: TimelineEvent[] = buildOfficerTimeline(app.source);
  const sm = STATUS_META[app.status];

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: "#1D4ED8" }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Application List
      </button>

      {/* App summary */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-sm font-bold" style={{ color: "#1D4ED8" }}>{app.id}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: "#0D9488", background: "#F0FDFA" }}>
                Verification: {app.verificationStatus}
              </span>
            </div>
            <h2 className="text-base font-semibold" style={{ color: "#0F172A" }}>{app.service}</h2>
            <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>{app.department}</p>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: "#94A3B8" }}>Citizen</div>
            <div className="text-sm font-semibold" style={{ color: "#0F172A" }}>{app.citizen}</div>
            <div className="text-xs font-mono" style={{ color: "#64748B" }}>{app.citizenId}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t" style={{ borderColor: "#F1F5F9" }}>
          <div><div className="text-xs" style={{ color: "#94A3B8" }}>DigiLocker ID</div><div className="text-sm font-mono font-medium" style={{ color: "#334155" }}>{app.digilockerId}</div></div>
          <div><div className="text-xs" style={{ color: "#94A3B8" }}>Income Certificate No.</div><div className="text-sm font-mono font-medium" style={{ color: "#334155" }}>{app.incomeCertificateNumber}</div></div>
          <div><div className="text-xs" style={{ color: "#94A3B8" }}>Seat Number</div><div className="text-sm font-mono font-medium" style={{ color: "#334155" }}>{app.seatNumber}</div></div>
          <div><div className="text-xs" style={{ color: "#94A3B8" }}>Application Status</div><div className="text-sm font-medium" style={{ color: "#334155" }}>{app.applicationStatus}</div></div>
          <div><div className="text-xs" style={{ color: "#94A3B8" }}>Submitted</div><div className="text-sm font-medium" style={{ color: "#334155" }}>{app.submittedAt}</div></div>
          <div><div className="text-xs" style={{ color: "#94A3B8" }}>Last Updated</div><div className="text-sm font-medium" style={{ color: "#334155" }}>{app.lastUpdated}</div></div>
        </div>

        {app.flagged && (
          <div className="mt-4 flex items-start gap-2 px-3.5 py-3 rounded-lg" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <svg width="15" height="15" className="flex-shrink-0 mt-0.5" fill="none" stroke="#DC2626" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-xs" style={{ color: "#DC2626" }}><strong>Flagged:</strong> {app.flagged}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <h2 className="text-sm font-semibold mb-5" style={{ color: "#0F172A" }}>Workflow Timeline</h2>
        <div className="space-y-0">
          {events.map((ev, i) => {
            const m = TIMELINE_STATUS_META[ev.status];
            const isLast = i === events.length - 1;
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 z-10"
                    style={{ background: m.bg, borderColor: m.border }}
                  >
                    {ev.status === "done" ? (
                      <svg width="13" height="13" fill="none" stroke={m.dot} strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : ev.status === "active" ? (
                      <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: m.dot }} />
                    ) : ev.status === "blocked" ? (
                      <svg width="13" height="13" fill="none" stroke={m.dot} strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full" style={{ background: m.dot }} />
                    )}
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 my-1" style={{ background: ev.status === "done" ? "#0D9488" : "#E2E8F0", minHeight: "32px" }} />
                  )}
                </div>

                <div className="pb-5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: ev.status === "pending" ? "#94A3B8" : "#0F172A" }}>{ev.stage}</span>
                    {ev.status === "active" && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>Current</span>
                    )}
                  </div>
                  {ev.description && (
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "#64748B" }}>{ev.description}</p>
                  )}
                  {(ev.timestamp || ev.actor) && (
                    <div className="flex items-center gap-3 mt-1.5">
                      {ev.timestamp && <span className="text-xs font-mono" style={{ color: "#94A3B8" }}>{ev.timestamp}</span>}
                      {ev.actor && <span className="text-xs" style={{ color: "#94A3B8" }}>· {ev.actor}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Main list ───────────────────────────────────────── */
export default function ApplicationMonitoring() {
  const { apps } = useCitizenApplications();
  const [selected, setSelected] = useState<OfficerMonitoredApp | null>(null);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const depts = useMemo(() => {
    const unique = [...new Set(apps.map((a) => a.department))];
    return ["All Departments", ...unique];
  }, [apps]);

  if (selected) return <TimelineDetail app={selected} onBack={() => setSelected(null)} />;

  if (apps.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Application Monitoring</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>All citizen applications across connected government services</p>
        </div>
        <EmptyApplicationsState />
      </div>
    );
  }

  const filtered = apps.filter((a) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      a.id.toLowerCase().includes(q) ||
      a.citizen.toLowerCase().includes(q) ||
      a.service.toLowerCase().includes(q) ||
      a.digilockerId.toLowerCase().includes(q);
    const matchDept = dept === "All Departments" || a.department === dept;
    const matchStatus =
      statusFilter === "All Status" ||
      STATUS_META[a.status].label === statusFilter ||
      (statusFilter === "Verified" && a.verificationStatus === "VERIFIED");
    return matchQ && matchDept && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Application Monitoring</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>All citizen applications across connected government services</p>
      </div>

      <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Application ID, citizen name, or service..."
            className="flex-1 px-3.5 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
          />
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#E2E8F0", color: "#334155" }}
          >
            {depts.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: "#E2E8F0", color: "#334155" }}
          >
            {BASE_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <p className="text-xs" style={{ color: "#94A3B8" }}>{filtered.length} application{filtered.length !== 1 ? "s" : ""} shown</p>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                {["Application ID", "Citizen", "Service / Department", "Stage", "Status", "Processing", "Last Updated", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#64748B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => {
                const sm = STATUS_META[app.status];
                const statusLabel =
                  app.verificationStatus === "VERIFIED" && app.status === "verified"
                    ? "Verified"
                    : sm.label;
                return (
                  <tr
                    key={app.id}
                    className="border-b last:border-0"
                    style={{ borderColor: "#F1F5F9", background: i % 2 === 0 ? "white" : "#FAFCFF" }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold" style={{ color: "#1D4ED8" }}>{app.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold" style={{ color: "#0F172A" }}>{app.citizen}</div>
                      <div className="text-xs font-mono" style={{ color: "#94A3B8" }}>{app.citizenId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium" style={{ color: "#334155" }}>{app.service}</div>
                      <div className="text-xs" style={{ color: "#94A3B8" }}>{app.department}</div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{app.stage}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap" style={{ color: sm.color, background: sm.bg }}>{statusLabel}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: app.processingDays > 14 ? "#D97706" : "#64748B", fontWeight: app.processingDays > 14 ? 600 : 400 }}>
                      {app.processingDays}d
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#94A3B8" }}>{app.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(app)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-slate-50"
                        style={{ borderColor: "#E2E8F0", color: "#1D4ED8" }}
                      >
                        View Timeline
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: "#94A3B8" }}>No applications match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
