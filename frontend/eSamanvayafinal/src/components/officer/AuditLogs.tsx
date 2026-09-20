import { useMemo, useState } from "react";
import { buildAuditLogsFromApplications } from "./citizenApplications";
import { useCitizenApplications } from "./useCitizenApplications";

/* ─── Types ───────────────────────────────────────────── */
type LogStatus = "success" | "failure" | "partial";
type LogAction = "data-fetch" | "verify" | "submit" | "consent" | "revoke" | "schema-validate" | "retry" | "flag";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorType: "system" | "officer" | "citizen";
  service: string;
  action: LogAction;
  appId?: string;
  status: LogStatus;
  httpStatus?: number;
  latencyMs?: number;
  requestSummary: string;
  responseSummary: string;
  details?: string;
}

const STATUS_META: Record<LogStatus, { label: string; color: string; bg: string }> = {
  success: { label: "Success", color: "#0D9488", bg: "#F0FDFA" },
  failure: { label: "Failure", color: "#DC2626", bg: "#FEF2F2" },
  partial: { label: "Partial", color: "#D97706", bg: "#FFFBEB" },
};

const ACTION_META: Record<LogAction, { label: string; color: string }> = {
  "data-fetch": { label: "Data Fetch", color: "#1D4ED8" },
  "verify": { label: "Verification", color: "#7C3AED" },
  "submit": { label: "Submission", color: "#0D9488" },
  "consent": { label: "Consent", color: "#0891B2" },
  "revoke": { label: "Revocation", color: "#D97706" },
  "schema-validate": { label: "Schema Validate", color: "#64748B" },
  "retry": { label: "Retry", color: "#D97706" },
  "flag": { label: "Manual Flag", color: "#DC2626" },
};

const ACTOR_TYPE_META = {
  system: { label: "System", bg: "#F1F5F9", color: "#475569" },
  officer: { label: "Officer", bg: "#EFF6FF", color: "#1D4ED8" },
  citizen: { label: "Citizen", bg: "#F0FDFA", color: "#0D9488" },
};

const BASE_SERVICES = ["All Services", "DigiLocker (NIC)", "Internal Consent Store", "eSamanvaya Verification API", "MahaDBT Submission API"];
const ACTIONS = ["All Actions", "Data Fetch", "Verification", "Submission", "Consent", "Revocation", "Schema Validate", "Retry", "Manual Flag"];
const STATUSES = ["All Status", "Success", "Failure", "Partial"];

/* ─── Log detail panel ────────────────────────────────── */
function LogDetail({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  const sm = STATUS_META[log.status];
  const am = ACTION_META[log.action];
  const atm = ACTOR_TYPE_META[log.actorType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl border shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-start justify-between px-5 py-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: "#F1F5F9" }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-xs font-bold" style={{ color: "#94A3B8" }}>{log.id}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
            </div>
            <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>{am.label} — {log.service}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            {[
              ["Timestamp", log.timestamp],
              ["Actor", log.actor],
              ["Actor Type", atm.label],
              ["HTTP Status", log.httpStatus ? `${log.httpStatus}` : "—"],
              ["Latency", log.latencyMs ? `${log.latencyMs}ms` : "—"],
              ["Application ID", log.appId ?? "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ color: "#94A3B8" }}>{k}</div>
                <div className="font-semibold font-mono" style={{ color: "#334155" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Request */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Request</p>
            <div className="px-3.5 py-3 rounded-lg text-xs font-mono leading-relaxed" style={{ background: "#F8FAFC", color: "#334155", border: "1px solid #E2E8F0" }}>
              {log.requestSummary}
            </div>
          </div>

          {/* Response */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Response</p>
            <div className="px-3.5 py-3 rounded-lg text-xs font-mono leading-relaxed" style={{ background: log.status === "failure" ? "#FEF2F2" : log.status === "partial" ? "#FFFBEB" : "#F0FDFA", color: "#334155", border: `1px solid ${log.status === "failure" ? "#FECACA" : log.status === "partial" ? "#FDE68A" : "#99F6E4"}` }}>
              {log.responseSummary}
            </div>
          </div>

          {/* Details */}
          {log.details && (
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Officer Notes / System Details</p>
              <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{log.details}</p>
            </div>
          )}

          <p className="text-xs pt-2" style={{ color: "#CBD5E1" }}>Audit logs are retained for 7 years per Data Governance Policy DGP-2024-MH-01.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function AuditLogs() {
  const { apps } = useCitizenApplications();
  const logs: AuditLog[] = useMemo(
    () => buildAuditLogsFromApplications().map((l) => ({ ...l })),
    [apps],
  );
  const services = useMemo(() => {
    const fromLogs = [...new Set(logs.map((l) => l.service))];
    return [...BASE_SERVICES, ...fromLogs.filter((s) => !BASE_SERVICES.includes(s))];
  }, [logs]);

  const [search, setSearch] = useState("");
  const [service, setService] = useState("All Services");
  const [action, setAction] = useState("All Actions");
  const [status, setStatus] = useState("All Status");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detail, setDetail] = useState<AuditLog | null>(null);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchQ = !q || l.id.includes(q) || l.actor.toLowerCase().includes(q) || (l.appId ?? "").toLowerCase().includes(q) || l.service.toLowerCase().includes(q);
    const matchSvc = service === "All Services" || l.service === service;
    const matchAct = action === "All Actions" || ACTION_META[l.action].label === action;
    const matchSt = status === "All Status" || STATUS_META[l.status].label === status;
    return matchQ && matchSvc && matchAct && matchSt;
  });

  return (
    <div className="space-y-5">
      {detail && <LogDetail log={detail} onClose={() => setDetail(null)} />}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-0.5">
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Government Audit Logs</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "#FEF2F2", color: "#DC2626" }}>Officer Only</span>
        </div>
        <p className="text-sm" style={{ color: "#64748B" }}>Complete system and officer activity log — all API calls, data accesses, and actions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 space-y-3" style={{ borderColor: "#E2E8F0" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Log ID, actor, Application ID, or service..."
          className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
        />
        <div className="flex flex-wrap gap-3">
          {([
            { label: "Service", value: service, setter: setService, opts: services },
            { label: "Action", value: action, setter: setAction, opts: ACTIONS },
            { label: "Status", value: status, setter: setStatus, opts: STATUSES },
          ] as const).map(({ label, value, setter, opts }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "#64748B" }}>{label}:</span>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border text-xs outline-none"
                style={{ borderColor: "#E2E8F0", color: "#334155" }}
              >
                {opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs" style={{ color: "#94A3B8" }}>{filtered.length} log{filtered.length !== 1 ? "s" : ""} shown</p>

      {/* Log rows */}
      <div className="space-y-2">
        {filtered.map((log) => {
          const sm = STATUS_META[log.status];
          const am = ACTION_META[log.action];
          const atm = ACTOR_TYPE_META[log.actorType];
          const isOpen = expanded === log.id;

          return (
            <div key={log.id} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
              <div
                className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors flex-wrap"
                onClick={() => setExpanded(isOpen ? null : log.id)}
              >
                {/* Status dot */}
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sm.color }} />

                {/* Timestamp */}
                <span className="font-mono text-xs flex-shrink-0" style={{ color: "#94A3B8", width: "140px" }}>{log.timestamp}</span>

                {/* Actor */}
                <span className="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0" style={{ background: atm.bg, color: atm.color }}>{log.actor}</span>

                {/* Service */}
                <span className="text-xs flex-shrink-0 hidden sm:block" style={{ color: "#64748B", width: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.service}</span>

                {/* Action */}
                <span className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0" style={{ background: "#F8FAFC", color: am.color }}>{am.label}</span>

                {/* App ID */}
                {log.appId && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{log.appId}</span>
                )}

                <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
                  {log.httpStatus && <span className="text-xs font-mono" style={{ color: "#CBD5E1" }}>{log.httpStatus}</span>}
                  <svg
                    width="14" height="14"
                    fill="none" stroke="#CBD5E1" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Expanded preview */}
              {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: "#F1F5F9" }}>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: "#94A3B8" }}>Request</p>
                      <p className="text-xs font-mono leading-relaxed px-3 py-2 rounded-lg" style={{ background: "#F8FAFC", color: "#334155" }}>{log.requestSummary}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: "#94A3B8" }}>Response</p>
                      <p className="text-xs font-mono leading-relaxed px-3 py-2 rounded-lg" style={{ background: log.status === "failure" ? "#FEF2F2" : "#F8FAFC", color: "#334155" }}>{log.responseSummary}</p>
                    </div>
                  </div>
                  {log.latencyMs && (
                    <p className="text-xs mt-2" style={{ color: "#94A3B8" }}>Latency: <strong>{log.latencyMs}ms</strong></p>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDetail(log); }}
                    className="mt-3 text-xs font-semibold"
                    style={{ color: "#1D4ED8" }}
                  >
                    View full log details →
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: "#94A3B8" }}>
            {logs.length === 0
              ? "No audit entries yet. Logs are generated from citizen application consent, verification, and MahaDBT submission events."
              : "No logs match the current filters."}
          </div>
        )}
      </div>

      <p className="text-xs text-center" style={{ color: "#CBD5E1" }}>
        Audit logs are retained for 7 years · Access restricted to authorised officers · DGP-2024-MH-01
      </p>
    </div>
  );
}
