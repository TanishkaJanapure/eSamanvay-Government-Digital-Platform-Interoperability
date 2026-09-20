import { useState, useEffect } from "react";

/* ─── Types ───────────────────────────────────────────── */
type HealthStatus = "healthy" | "slow" | "down";

interface ApiService {
  id: string;
  name: string;
  shortName: string;
  owner: string;
  status: HealthStatus;
  latencyMs: number;
  p95Ms: number;
  uptime: string;
  lastSuccess: string;
  errorCount24h: number;
  retrying: boolean;
  endpoint: string;
  dependsOn: string[];
}

/* ─── Data ────────────────────────────────────────────── */
const SERVICES: ApiService[] = [
  { id: "aadhaar", name: "Aadhaar eKYC (UIDAI)", shortName: "Aadhaar eKYC", owner: "UIDAI, MeitY", status: "healthy", latencyMs: 142, p95Ms: 310, uptime: "99.91%", lastSuccess: "12s ago", errorCount24h: 2, retrying: false, endpoint: "ekyc.uidai.gov.in/verify", dependsOn: [] },
  { id: "digilocker", name: "DigiLocker Document Store (NIC)", shortName: "DigiLocker", owner: "NIC, MeitY", status: "healthy", latencyMs: 208, p95Ms: 490, uptime: "99.73%", lastSuccess: "4s ago", errorCount24h: 6, retrying: false, endpoint: "api.digilocker.gov.in/v2", dependsOn: ["aadhaar"] },
  { id: "pfms", name: "PFMS Payment Gateway (CGA)", shortName: "PFMS", owner: "Controller General of Accounts", status: "slow", latencyMs: 1840, p95Ms: 3200, uptime: "98.21%", lastSuccess: "2m ago", errorCount24h: 41, retrying: true, endpoint: "pfms.nic.in/api/dbt", dependsOn: ["aadhaar"] },
  { id: "income-db", name: "Income Certificate Database", shortName: "Income DB", owner: "Revenue Dept, GoMH", status: "healthy", latencyMs: 95, p95Ms: 180, uptime: "99.98%", lastSuccess: "8s ago", errorCount24h: 0, retrying: false, endpoint: "revenue.maharashtra.gov.in/income-api", dependsOn: [] },
  { id: "caste-reg", name: "Caste Certificate Registry", shortName: "Caste Registry", owner: "Social Justice Dept, GoMH", status: "healthy", latencyMs: 113, p95Ms: 220, uptime: "99.89%", lastSuccess: "15s ago", errorCount24h: 1, retrying: false, endpoint: "sjsa.maharashtra.gov.in/caste-api", dependsOn: ["aadhaar"] },
  { id: "mahabhulekh", name: "Land Records (Mahabhulekh)", shortName: "Mahabhulekh", owner: "Revenue Dept, GoMH", status: "healthy", latencyMs: 189, p95Ms: 420, uptime: "99.44%", lastSuccess: "31s ago", errorCount24h: 9, retrying: false, endpoint: "bhulekh.mahabhumi.gov.in/api", dependsOn: ["income-db"] },
  { id: "iudx", name: "IUDX Data Exchange", shortName: "IUDX", owner: "IISc / Smart Cities Mission", status: "healthy", latencyMs: 231, p95Ms: 510, uptime: "99.67%", lastSuccess: "18s ago", errorCount24h: 3, retrying: false, endpoint: "api.iudx.org.in/v1", dependsOn: [] },
  { id: "civil-supplies", name: "Civil Supplies (PDS)", shortName: "Civil Supplies", owner: "Civil Supplies Dept, GoMH", status: "healthy", latencyMs: 178, p95Ms: 340, uptime: "99.81%", lastSuccess: "22s ago", errorCount24h: 0, retrying: false, endpoint: "civilsupplies.maharashtra.gov.in/api", dependsOn: ["aadhaar", "income-db"] },
];

const STATUS_META: Record<HealthStatus, { label: string; color: string; bg: string; border: string; barColor: string }> = {
  healthy: { label: "Healthy", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", barColor: "#0D9488" },
  slow: { label: "Slow", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", barColor: "#F59E0B" },
  down: { label: "Down", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", barColor: "#EF4444" },
};

/* ─── Live latency jitter ─────────────────────────────── */
function useJitter(base: number, status: HealthStatus) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    if (status === "down") return;
    const t = setInterval(() => {
      const jitter = status === "slow" ? (Math.random() - 0.3) * 400 : (Math.random() - 0.5) * 40;
      setVal(Math.max(50, Math.round(base + jitter)));
    }, 2500);
    return () => clearInterval(t);
  }, [base, status]);
  return val;
}

/* ─── Service card ────────────────────────────────────── */
function ServiceCard({ svc, onSelect, selected }: { svc: ApiService; onSelect: () => void; selected: boolean }) {
  const lat = useJitter(svc.latencyMs, svc.status);
  const m = STATUS_META[svc.status];
  const MAX_BAR = svc.status === "slow" ? 4000 : 1000;

  return (
    <div
      className="bg-white rounded-xl border p-4 cursor-pointer transition-all"
      style={{ borderColor: selected ? "#1D4ED8" : "#E2E8F0", boxShadow: selected ? "0 0 0 2px #BFDBFE" : "none" }}
      onClick={onSelect}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: "#0F172A" }}>{svc.name}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "#94A3B8" }}>{svc.owner}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0" style={{ background: m.bg, color: m.color }}>
          <div className={`w-1.5 h-1.5 rounded-full ${svc.status === "slow" ? "animate-pulse" : ""}`} style={{ background: m.color }} />
          {m.label}
        </div>
      </div>

      {/* Latency bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1" style={{ color: "#94A3B8" }}>
          <span>Response time</span>
          <span className="font-mono font-semibold" style={{ color: m.color }}>{lat}ms</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min((lat / MAX_BAR) * 100, 100)}%`, background: m.barColor }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div style={{ color: "#94A3B8" }}>Uptime</div>
          <div className="font-semibold" style={{ color: "#334155" }}>{svc.uptime}</div>
        </div>
        <div>
          <div style={{ color: "#94A3B8" }}>Errors 24h</div>
          <div className="font-semibold" style={{ color: svc.errorCount24h > 10 ? "#DC2626" : "#334155" }}>{svc.errorCount24h}</div>
        </div>
        <div>
          <div style={{ color: "#94A3B8" }}>Last OK</div>
          <div className="font-semibold" style={{ color: "#334155" }}>{svc.lastSuccess}</div>
        </div>
      </div>

      {svc.retrying && (
        <div className="mt-3 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: "#FFFBEB", color: "#D97706" }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Auto-retrying · Circuit breaker open
        </div>
      )}
    </div>
  );
}

/* ─── Dependency graph (SVG) ──────────────────────────── */
const NODE_POS: Record<string, [number, number]> = {
  "aadhaar":      [300, 80],
  "digilocker":   [120, 220],
  "pfms":         [480, 220],
  "income-db":    [300, 220],
  "caste-reg":    [120, 360],
  "mahabhulekh":  [480, 360],
  "civil-supplies":[300, 360],
  "iudx":         [60,  80],
};

function DependencyGraph({ services, selectedId }: { services: ApiService[]; selectedId: string | null }) {
  const edges: [string, string][] = [];
  services.forEach((s) => s.dependsOn.forEach((dep) => edges.push([dep, s.id])));

  return (
    <div className="overflow-x-auto">
      <svg width="580" height="440" viewBox="0 0 580 440" style={{ minWidth: "420px" }}>
        {/* Edges */}
        {edges.map(([from, to], i) => {
          const [x1, y1] = NODE_POS[from] ?? [0, 0];
          const [x2, y2] = NODE_POS[to] ?? [0, 0];
          const isHighlighted = selectedId === from || selectedId === to;
          return (
            <line
              key={i}
              x1={x1} y1={y1 + 22} x2={x2} y2={y2 - 22}
              stroke={isHighlighted ? "#1D4ED8" : "#CBD5E1"}
              strokeWidth={isHighlighted ? 2 : 1.5}
              strokeDasharray={isHighlighted ? "0" : "4 3"}
              markerEnd="url(#arrow)"
            />
          );
        })}

        {/* Arrow marker */}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#94A3B8" />
          </marker>
        </defs>

        {/* Nodes */}
        {services.map((svc) => {
          const [cx, cy] = NODE_POS[svc.id] ?? [0, 0];
          const m = STATUS_META[svc.status];
          const isSelected = selectedId === svc.id;
          const isDep = selectedId
            ? (services.find((s) => s.id === selectedId)?.dependsOn.includes(svc.id) ||
               services.find((s) => s.id === svc.id)?.dependsOn.includes(selectedId!))
            : false;

          return (
            <g key={svc.id}>
              <rect
                x={cx - 68} y={cy - 22}
                width={136} height={44}
                rx={10}
                fill={isSelected ? "#EFF6FF" : "white"}
                stroke={isSelected ? "#1D4ED8" : isDep ? "#93C5FD" : "#E2E8F0"}
                strokeWidth={isSelected ? 2 : 1.5}
              />
              <circle cx={cx - 52} cy={cy} r={5} fill={m.color} />
              <text x={cx - 42} y={cy - 4} fontSize="10" fontWeight="600" fill="#0F172A" fontFamily="Inter, system-ui">{svc.shortName}</text>
              <text x={cx - 42} y={cy + 9} fontSize="8.5" fill="#94A3B8" fontFamily="Inter, system-ui">{svc.latencyMs}ms</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Detail panel ────────────────────────────────────── */
function DetailPanel({ svc, onClose }: { svc: ApiService; onClose: () => void }) {
  const m = STATUS_META[svc.status];
  const deps = SERVICES.filter((s) => svc.dependsOn.includes(s.id));
  const dependents = SERVICES.filter((s) => s.dependsOn.includes(svc.id));

  return (
    <div className="bg-white rounded-xl border p-5 space-y-4" style={{ borderColor: "#E2E8F0" }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: m.color }}>{m.label}</span>
          </div>
          <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>{svc.name}</h3>
          <p className="text-xs" style={{ color: "#64748B" }}>{svc.owner}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {[
          ["Endpoint", svc.endpoint],
          ["Avg Latency", `${svc.latencyMs}ms`],
          ["P95 Latency", `${svc.p95Ms}ms`],
          ["Uptime (30d)", svc.uptime],
          ["Errors (24h)", String(svc.errorCount24h)],
          ["Last Success", svc.lastSuccess],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ color: "#94A3B8" }}>{k}</div>
            <div className="font-mono font-semibold break-all" style={{ color: "#334155" }}>{v}</div>
          </div>
        ))}
      </div>

      {deps.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "#64748B" }}>Depends on</p>
          <div className="flex flex-wrap gap-2">
            {deps.map((d) => (
              <span key={d.id} className="px-2 py-1 rounded-lg text-xs font-medium" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{d.shortName}</span>
            ))}
          </div>
        </div>
      )}
      {dependents.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "#64748B" }}>Used by</p>
          <div className="flex flex-wrap gap-2">
            {dependents.map((d) => (
              <span key={d.id} className="px-2 py-1 rounded-lg text-xs font-medium" style={{ background: "#F0FDFA", color: "#0D9488" }}>{d.shortName}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function ApiHealth() {
  const [view, setView] = useState<"cards" | "graph">("cards");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = SERVICES.find((s) => s.id === selectedId) ?? null;
  const healthy = SERVICES.filter((s) => s.status === "healthy").length;
  const slow = SERVICES.filter((s) => s.status === "slow").length;
  const down = SERVICES.filter((s) => s.status === "down").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>API & Workflow Health</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Real-time status of all connected government data services</p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: `${healthy} Healthy`, color: "#0D9488", bg: "#F0FDFA" },
            { label: `${slow} Slow`, color: "#D97706", bg: "#FFFBEB" },
            ...(down > 0 ? [{ label: `${down} Down`, color: "#DC2626", bg: "#FEF2F2" }] : []),
          ].map((b) => (
            <span key={b.label} className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ color: b.color, background: b.bg }}>{b.label}</span>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-white border rounded-lg p-1 w-fit" style={{ borderColor: "#E2E8F0" }}>
        {(["cards", "graph"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-4 py-1.5 rounded text-xs font-semibold transition-all"
            style={{
              background: view === v ? "#0F172A" : "transparent",
              color: view === v ? "white" : "#64748B",
            }}
          >
            {v === "cards" ? "Service Cards" : "Dependency View"}
          </button>
        ))}
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((svc) => (
            <ServiceCard
              key={svc.id}
              svc={svc}
              selected={selectedId === svc.id}
              onSelect={() => setSelectedId(selectedId === svc.id ? null : svc.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs mb-4" style={{ color: "#94A3B8" }}>Click a node to inspect. Arrows show data dependencies (A → B means B calls A).</p>
            <DependencyGraph services={SERVICES} selectedId={selectedId} />
          </div>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <DetailPanel svc={selected} onClose={() => setSelectedId(null)} />
      )}

      <p className="text-xs" style={{ color: "#CBD5E1" }}>
        Latency values are simulated for prototype purposes. Dependency map is indicative.
      </p>
    </div>
  );
}
