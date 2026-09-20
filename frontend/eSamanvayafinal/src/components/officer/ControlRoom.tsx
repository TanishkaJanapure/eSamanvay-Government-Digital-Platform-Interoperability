import { useState, useEffect, useMemo } from "react";
import { buildDeptBars, buildRecentActivities, officerApplicationCounts } from "./citizenApplications";
import { useCitizenApplications } from "./useCitizenApplications";

/* ─── Types ───────────────────────────────────────────── */
interface StatCard { label: string; value: string; sub: string; color: string; bg: string; border: string; trend?: string; trendUp?: boolean }
interface ServiceHealth { name: string; status: "healthy" | "slow" | "down"; latency: number; uptime: string }

const API_HEALTH: ServiceHealth[] = [
  { name: "Aadhaar eKYC (UIDAI)", status: "healthy", latency: 142, uptime: "99.91%" },
  { name: "DigiLocker (NIC)", status: "healthy", latency: 208, uptime: "99.73%" },
  { name: "PFMS Payment Gateway", status: "slow", latency: 1840, uptime: "98.21%" },
  { name: "Income Certificate DB", status: "healthy", latency: 95, uptime: "99.98%" },
  { name: "Caste Certificate Registry", status: "healthy", latency: 113, uptime: "99.89%" },
  { name: "Land Records (Mahabhulekh)", status: "healthy", latency: 189, uptime: "99.44%" },
  { name: "IUDX Data Exchange", status: "healthy", latency: 231, uptime: "99.67%" },
  { name: "Civil Supplies (PDS)", status: "healthy", latency: 178, uptime: "99.81%" },
];

const STATUS_META = {
  healthy: { label: "Healthy", color: "#0D9488", bg: "#F0FDFA", dot: "#0D9488" },
  slow: { label: "Slow", color: "#D97706", bg: "#FFFBEB", dot: "#D97706" },
  down: { label: "Down", color: "#DC2626", bg: "#FEF2F2", dot: "#DC2626" },
};

const ACT_META = {
  ok: { color: "#0D9488", bg: "#F0FDFA" },
  warn: { color: "#D97706", bg: "#FFFBEB" },
  err: { color: "#DC2626", bg: "#FEF2F2" },
};

/* ─── Live clock ──────────────────────────────────────── */
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <span style={{ color: "#64748B", fontSize: "13px" }}>
      {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

/* ─── Donut chart ─────────────────────────────────────── */
function DonutChart({ completed, inProgress, blocked }: { completed: number; inProgress: number; blocked: number }) {
  const total = completed + inProgress + blocked;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * circ);

  const segments = [
    { pct: pct(completed), color: "#0D9488", offset: 0 },
    { pct: pct(inProgress), color: "#F59E0B", offset: pct(completed) },
    { pct: pct(blocked), color: "#EF4444", offset: pct(completed) + pct(inProgress) },
  ];

  return (
    <div className="flex items-center gap-6">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#F1F5F9" strokeWidth="16" />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx="65" cy="65" r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="16"
            strokeDasharray={`${s.pct} ${circ - s.pct}`}
            strokeDashoffset={-s.offset + circ / 4}
            strokeLinecap="round"
          />
        ))}
        <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F172A">{total}</text>
        <text x="65" y="76" textAnchor="middle" fontSize="10" fill="#94A3B8">total</text>
      </svg>
      <div className="space-y-2.5">
        {[
          { label: "Completed", count: completed, color: "#0D9488" },
          { label: "In Progress", count: inProgress, color: "#F59E0B" },
          { label: "Blocked", count: blocked, color: "#EF4444" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-xs" style={{ color: "#64748B" }}>{item.label}</span>
            <span className="text-xs font-bold ml-auto pl-4" style={{ color: "#0F172A" }}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bar chart ───────────────────────────────────────── */
function DeptBarChart({ rows }: { rows: { dept: string; total: number; done: number }[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm py-8 text-center" style={{ color: "#94A3B8" }}>
        No citizen applications recorded yet. Data appears when applications move past draft in the citizen portal.
      </p>
    );
  }
  const max = Math.max(...rows.map((d) => d.total), 1);
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.dept}>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium" style={{ color: "#334155" }}>{row.dept}</span>
            <span className="text-xs" style={{ color: "#94A3B8" }}>{row.done}/{row.total}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
            <div
              className="h-full rounded-full relative"
              style={{ width: `${(row.total / max) * 100}%`, background: "#BFDBFE" }}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ width: `${(row.done / row.total) * 100}%`, background: "#1D4ED8" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function ControlRoom() {
  const { apps } = useCitizenApplications();
  const counts = useMemo(() => officerApplicationCounts(), [apps]);
  const deptBars = useMemo(() => buildDeptBars(), [apps]);
  const recent = useMemo(() => buildRecentActivities(), [apps]);

  const stats: StatCard[] = [
    { label: "Total Applications", value: String(counts.total), sub: "Citizen portal (local)", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
    { label: "In Progress", value: String(counts.inProgress), sub: "Consent through verification", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
    { label: "Completed", value: String(counts.completed), sub: "Submitted to MahaDBT", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
    { label: "Blocked / Failed", value: String(counts.blocked), sub: "Verification not passed", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  ];

  const healthy = API_HEALTH.filter((s) => s.status === "healthy").length;
  const slow = API_HEALTH.filter((s) => s.status === "slow").length;
  const down = API_HEALTH.filter((s) => s.status === "down").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Government Control Room</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Platform-wide operations overview · <LiveClock /></p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: "#E2E8F0", background: "white", color: "#0D9488" }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#0D9488" }} />
          Live · Auto-refresh 30s
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "white", borderColor: s.border }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: s.color }}>{s.label}</span>
            </div>
            <div className="text-3xl font-bold" style={{ color: "#0F172A", letterSpacing: "-0.03em" }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "#94A3B8" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Donut */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#0F172A" }}>Application Status Distribution</h2>
          <DonutChart completed={counts.completed} inProgress={counts.inProgress} blocked={counts.blocked} />
        </div>

        {/* Dept bars */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>Applications by Department</h2>
            <div className="flex items-center gap-3 text-xs" style={{ color: "#94A3B8" }}>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2 rounded" style={{ background: "#1D4ED8" }} />Completed</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2 rounded" style={{ background: "#BFDBFE" }} />Total</span>
            </div>
          </div>
          <DeptBarChart rows={deptBars} />
        </div>
      </div>

      {/* API health summary */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>Connected Government Services — API Health</h2>
          <div className="flex items-center gap-3">
            {[{ label: `${healthy} Healthy`, color: "#0D9488", bg: "#F0FDFA" }, { label: `${slow} Slow`, color: "#D97706", bg: "#FFFBEB" }, { label: `${down} Down`, color: "#DC2626", bg: "#FEF2F2" }].map((b) => (
              <span key={b.label} className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: b.color, background: b.bg }}>{b.label}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {API_HEALTH.map((svc) => {
            const m = STATUS_META[svc.status];
            return (
              <div key={svc.name} className="flex items-center gap-3 px-3.5 py-3 rounded-xl border" style={{ background: m.bg, borderColor: "#E2E8F0" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.dot }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: "#0F172A" }}>{svc.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>{svc.latency}ms · {svc.uptime}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "#0F172A" }}>Recent System Activity</h2>
        <div className="space-y-2">
          {recent.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: "#94A3B8" }}>No application activity yet from the citizen portal.</p>
          ) : (
            recent.map((a, i) => {
              const m = ACT_META[a.status];
              return (
                <div key={`${a.appId}-${i}`} className="flex items-start gap-3 px-3 py-2.5 rounded-lg" style={{ background: i % 2 === 0 ? "#F8FAFC" : "transparent" }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: m.color }} />
                  <span className="text-xs font-mono flex-shrink-0 mt-0.5" style={{ color: "#94A3B8", width: "60px" }}>{a.time}</span>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#475569", width: "140px" }}>{a.system}</span>
                  <span className="text-xs flex-1" style={{ color: "#334155" }}>{a.action}</span>
                  {a.appId && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "#EFF6FF", color: "#1D4ED8", flexShrink: 0 }}>{a.appId}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
