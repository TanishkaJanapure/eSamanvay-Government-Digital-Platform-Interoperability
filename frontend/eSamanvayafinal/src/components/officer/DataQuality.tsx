import { useMemo, useState } from "react";
import { buildQualityIssuesFromApplications, type OfficerQualityIssue } from "./citizenApplications";
import { useCitizenApplications } from "./useCitizenApplications";

/* ─── Types ───────────────────────────────────────────── */
type IssueType = "missing" | "conflict" | "validation" | "timeout";
type IssueSeverity = "critical" | "high" | "medium" | "low";

type QualityIssue = OfficerQualityIssue;

const ISSUE_TYPE_META: Record<IssueType, { label: string; color: string; bg: string }> = {
  missing: { label: "Missing Data", color: "#DC2626", bg: "#FEF2F2" },
  conflict: { label: "Conflict", color: "#D97706", bg: "#FFFBEB" },
  validation: { label: "Validation Failure", color: "#7C3AED", bg: "#F5F3FF" },
  timeout: { label: "Source Timeout", color: "#64748B", bg: "#F8FAFC" },
};

const SEVERITY_META: Record<IssueSeverity, { label: string; color: string }> = {
  critical: { label: "Critical", color: "#DC2626" },
  high: { label: "High", color: "#D97706" },
  medium: { label: "Medium", color: "#7C3AED" },
  low: { label: "Low", color: "#64748B" },
};

const STATUS_META = {
  open: { label: "Open", color: "#DC2626", bg: "#FEF2F2" },
  resolved: { label: "Resolved", color: "#0D9488", bg: "#F0FDFA" },
  escalated: { label: "Escalated", color: "#D97706", bg: "#FFFBEB" },
};

/* ─── Donut helper ────────────────────────────────────── */
function QualityDonut({ pct }: { pct: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  const color = pct >= 90 ? "#0D9488" : pct >= 70 ? "#F59E0B" : "#EF4444";

  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#F1F5F9" strokeWidth="13" />
      <circle
        cx="55" cy="55" r={r}
        fill="none"
        stroke={color}
        strokeWidth="13"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      <text x="55" y="51" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0F172A">{pct}%</text>
      <text x="55" y="65" textAnchor="middle" fontSize="9" fill="#94A3B8">quality</text>
    </svg>
  );
}

/* ─── Issue detail panel ──────────────────────────────── */
function IssueDetail({ issue, onClose, onResolve }: { issue: QualityIssue; onClose: () => void; onResolve: (id: string) => void }) {
  const tm = ISSUE_TYPE_META[issue.issueType];
  const sm = STATUS_META[issue.status];
  const sev = SEVERITY_META[issue.severity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl border shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-start justify-between px-5 py-4 border-b sticky top-0 bg-white" style={{ borderColor: "#F1F5F9" }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-xs font-bold" style={{ color: "#94A3B8" }}>{issue.id}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
              <span className="text-xs font-bold" style={{ color: sev.color }}>{sev.label} severity</span>
            </div>
            <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>{tm.label} — <code className="text-xs px-1 py-0.5 rounded" style={{ background: "#F1F5F9" }}>{issue.field}</code></h3>
          </div>
          <button onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="#CBD5E1" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[["Application ID", issue.appId], ["Citizen", issue.citizen], ["Source(s)", issue.source], ["Detected", issue.detectedAt]].map(([k, v]) => (
              <div key={k}><div style={{ color: "#94A3B8" }}>{k}</div><div className="font-semibold mt-0.5" style={{ color: "#334155" }}>{v}</div></div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Issue description</p>
            <p className="text-xs leading-relaxed px-3 py-2.5 rounded-lg" style={{ background: "#F8FAFC", color: "#334155" }}>{issue.description}</p>
          </div>

          {issue.resolution && (
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#0D9488" }}>Resolution</p>
              <p className="text-xs leading-relaxed px-3 py-2.5 rounded-lg" style={{ background: "#F0FDFA", color: "#334155", border: "1px solid #99F6E4" }}>{issue.resolution}</p>
            </div>
          )}

          {issue.status === "open" && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { onResolve(issue.id); onClose(); }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white"
                style={{ background: "#0D9488" }}
              >
                Mark Resolved
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border"
                style={{ borderColor: "#D97706", color: "#D97706" }}
              >
                Escalate to Senior
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function DataQuality() {
  const { apps } = useCitizenApplications();
  const baseIssues = useMemo(() => buildQualityIssuesFromApplications(), [apps]);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<QualityIssue | null>(null);
  const [typeFilter, setTypeFilter] = useState<IssueType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"open" | "resolved" | "escalated" | "all">("all");

  const issues = useMemo(
    () =>
      baseIssues.map((i) =>
        resolvedIds.has(i.id)
          ? { ...i, status: "resolved" as const, resolution: "Manually resolved by officer." }
          : i,
      ),
    [baseIssues, resolvedIds],
  );

  function resolveIssue(id: string) {
    setResolvedIds((prev) => new Set(prev).add(id));
  }

  const total = apps.length;
  const verified = apps.filter((a) => a.verificationStatus === "VERIFIED").length;
  const missing = issues.filter((i) => i.issueType === "missing").length;
  const conflict = issues.filter((i) => i.issueType === "conflict").length;
  const validation = issues.filter((i) => i.issueType === "validation").length;
  const openCount = issues.filter((i) => i.status === "open").length;
  const qualityPct = total === 0 ? 0 : Math.round((verified / total) * 100);

  const filtered = issues.filter((i) => {
    const matchType = typeFilter === "all" || i.issueType === typeFilter;
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchType && matchStatus;
  });

  return (
    <div className="space-y-6">
      {selected && <IssueDetail issue={selected} onClose={() => setSelected(null)} onResolve={resolveIssue} />}

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Data Quality Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Record validation, conflict detection, and issue resolution across all application data</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Processed", value: total.toLocaleString(), color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
          { label: "Verified Records", value: verified.toLocaleString(), color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
          { label: "Open Issues", value: openCount, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { label: "Auto-Resolved", value: issues.filter((i) => i.status === "resolved").length, color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "white", borderColor: s.border }}>
            <div className="text-3xl font-bold" style={{ color: "#0F172A", letterSpacing: "-0.03em" }}>{s.value}</div>
            <div className="text-xs mt-1.5 font-medium" style={{ color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quality score + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Donut */}
        <div className="bg-white rounded-xl border p-5 flex items-center gap-6" style={{ borderColor: "#E2E8F0" }}>
          <QualityDonut pct={qualityPct} />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>Overall Data Quality Score</p>
              <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{verified} of {total} records fully verified</p>
            </div>
            {[
              { label: "Missing Data", count: missing, color: "#DC2626", pct: Math.round((missing / total) * 100 * 10) / 10 },
              { label: "Conflicts", count: conflict, color: "#D97706", pct: Math.round((conflict / total) * 100 * 10) / 10 },
              { label: "Validation Failures", count: validation, color: "#7C3AED", pct: Math.round((validation / total) * 100 * 10) / 10 },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "#64748B" }}>{row.label}</span>
                  <span className="font-semibold" style={{ color: row.color }}>{row.count} ({row.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#F1F5F9" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(row.pct * 10, 100)}%`, background: row.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issue type breakdown */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#0F172A" }}>Issues by Type & Status</h2>
          <div className="space-y-3">
            {(["missing", "conflict", "validation"] as IssueType[]).map((type) => {
              const typeIssues = issues.filter((i) => i.issueType === type);
              const openN = typeIssues.filter((i) => i.status === "open").length;
              const resolvedN = typeIssues.filter((i) => i.status === "resolved").length;
              const escalatedN = typeIssues.filter((i) => i.status === "escalated").length;
              const tm = ISSUE_TYPE_META[type];
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ color: tm.color, background: tm.bg, minWidth: "130px" }}>{tm.label}</span>
                  <div className="flex-1 flex items-center gap-2">
                    {openN > 0 && <div className="h-6 rounded flex items-center justify-center text-xs font-bold text-white px-2" style={{ background: "#DC2626", minWidth: `${openN * 20}px` }}>{openN}</div>}
                    {escalatedN > 0 && <div className="h-6 rounded flex items-center justify-center text-xs font-bold text-white px-2" style={{ background: "#D97706", minWidth: `${escalatedN * 20}px` }}>{escalatedN}</div>}
                    {resolvedN > 0 && <div className="h-6 rounded flex items-center justify-center text-xs font-bold text-white px-2" style={{ background: "#0D9488", minWidth: `${resolvedN * 20}px` }}>{resolvedN}</div>}
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#64748B" }}>{typeIssues.length} total</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-4 pt-3 border-t" style={{ borderColor: "#F1F5F9" }}>
            {[{ label: "Open", color: "#DC2626" }, { label: "Escalated", color: "#D97706" }, { label: "Resolved", color: "#0D9488" }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs" style={{ color: "#64748B" }}>
                <div className="w-2.5 h-2.5 rounded" style={{ background: l.color }} /> {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issue list */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b flex-wrap gap-3" style={{ borderColor: "#F1F5F9" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>Issue Log</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as IssueType | "all")}
              className="px-3 py-1.5 rounded-lg border text-xs outline-none"
              style={{ borderColor: "#E2E8F0", color: "#334155" }}
            >
              <option value="all">All Types</option>
              <option value="missing">Missing Data</option>
              <option value="conflict">Conflict</option>
              <option value="validation">Validation</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "open" | "resolved" | "escalated" | "all")}
              className="px-3 py-1.5 rounded-lg border text-xs outline-none"
              style={{ borderColor: "#E2E8F0", color: "#334155" }}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: "#F1F5F9" }}>
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-sm" style={{ color: "#94A3B8" }}>
              {total === 0
                ? "No applications yet. Verification issues appear when citizen applications fail eSamanvaya checks."
                : "No open data quality issues for current applications."}
            </div>
          )}
          {filtered.map((issue) => {
            const tm = ISSUE_TYPE_META[issue.issueType];
            const sm = STATUS_META[issue.status];
            const sev = SEVERITY_META[issue.severity];
            return (
              <div
                key={issue.id}
                className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setSelected(issue)}
              >
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: tm.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs" style={{ color: "#94A3B8" }}>{issue.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: tm.color, background: tm.bg }}>{tm.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
                    <span className="text-xs font-bold" style={{ color: sev.color }}>{sev.label}</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: "#0F172A" }}>
                    <code className="px-1 py-0.5 rounded text-xs" style={{ background: "#F1F5F9" }}>{issue.field}</code>
                    {" "}&mdash; {issue.citizen} · {issue.appId}
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "#64748B" }}>{issue.description.slice(0, 90)}{issue.description.length > 90 ? "…" : ""}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs" style={{ color: "#94A3B8" }}>{issue.detectedAt.split(" · ")[0]}</span>
                  <div className="text-xs mt-1 font-semibold" style={{ color: "#1D4ED8" }}>View Details →</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
