import { useState } from "react";

/* ─── Types ───────────────────────────────────────────── */
type ConsentStatus = "active" | "revoked" | "expired";

interface ConsentRecord {
  id: string;
  service: string;
  department: string;
  purpose: string;
  dataShared: string[];
  dataSource: string;
  grantedAt: string;
  expiresAt: string;
  status: ConsentStatus;
  appId?: string;
}

/* ─── Data ────────────────────────────────────────────── */
const INITIAL_CONSENTS: ConsentRecord[] = [
  {
    id: "CST-101",
    service: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna",
    department: "Directorate of Technical Education / MahaDBT",
    purpose: "EBC/EWS eligibility verification and application processing for MahaDBT scholarship disbursement",
    dataShared: ["Name", "Date of Birth", "Income Certificate", "Education Records", "Bank Account (PFMS)", "Aadhaar Number (masked)"],
    dataSource: "DigiLocker, Aadhaar eKYC, PFMS",
    grantedAt: "26 Nov 2024 · 11:35 AM",
    expiresAt: "25 May 2025",
    status: "active",
    appId: "ESM2026001234",
  },
  {
    id: "CST-097",
    service: "Income Certificate",
    department: "Revenue Department",
    purpose: "Income verification from Revenue Department records for certificate issuance",
    dataShared: ["Name", "Address", "PAN (masked)", "Occupation", "Annual Income"],
    dataSource: "Revenue Department Database",
    grantedAt: "12 Nov 2024 · 10:00 AM",
    expiresAt: "11 Nov 2025",
    status: "active",
    appId: "AP-2024-8821",
  },
  {
    id: "CST-089",
    service: "Ration Card Annual Renewal",
    department: "Civil Supplies Department",
    purpose: "Annual renewal — household composition and income verification",
    dataShared: ["Name", "Address", "Household Members", "Annual Income"],
    dataSource: "Aadhaar eKYC, Income Certificate DB",
    grantedAt: "5 Nov 2024 · 10:15 AM",
    expiresAt: "4 Dec 2024",
    status: "expired",
  },
  {
    id: "CST-072",
    service: "Birth Certificate",
    department: "Municipal Corporation, Pune",
    purpose: "Identity and birth record verification for certificate issuance",
    dataShared: ["Name", "Date of Birth", "Parents' Names", "Hospital Records"],
    dataSource: "Municipal Birth Registry",
    grantedAt: "21 Nov 2024 · 10:34 AM",
    expiresAt: "20 Nov 2025",
    status: "active",
    appId: "AP-2024-9105",
  },
  {
    id: "CST-051",
    service: "PM-KISAN Beneficiary Registration",
    department: "Agriculture Department",
    purpose: "Land holding verification and farmer eligibility check for PM-KISAN benefit",
    dataShared: ["Name", "Aadhaar Number (masked)", "Land Records", "Bank Account"],
    dataSource: "Mahabhulekh, PFMS",
    grantedAt: "18 Nov 2024 · 9:20 AM",
    expiresAt: "17 Nov 2025",
    status: "active",
    appId: "ESM2026000891",
  },
  {
    id: "CST-034",
    service: "Employment Registration",
    department: "Employment & Self-Employment Department",
    purpose: "Skill and qualification verification for employment exchange registration",
    dataShared: ["Name", "Qualifications", "Work Experience", "Contact Details"],
    dataSource: "DigiLocker (Degree Certificate)",
    grantedAt: "3 Nov 2024 · 11:00 AM",
    expiresAt: "2 Nov 2024",
    status: "revoked",
    appId: "AP-2024-7760",
  },
];

const STATUS_META: Record<ConsentStatus, { label: string; color: string; bg: string; border: string }> = {
  active: { label: "Active", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
  revoked: { label: "Revoked", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  expired: { label: "Expired", color: "#94A3B8", bg: "#F8FAFC", border: "#E2E8F0" },
};

/* ─── Revoke confirmation dialog ──────────────────────── */
function RevokeDialog({ consent, onConfirm, onCancel }: { consent: ConsentRecord; onConfirm: () => void; onCancel: () => void }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl border shadow-2xl max-w-md w-full" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: "#F1F5F9" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "#FEF2F2" }}>
            <svg width="20" height="20" fill="none" stroke="#DC2626" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold" style={{ color: "#0F172A" }}>Revoke Consent — {consent.id}</h3>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>{consent.service}</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="px-4 py-3 rounded-xl" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "#D97706" }}>Before you revoke</p>
            <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
              Revoking this consent will stop eSamanvaya from sharing your data with <strong>{consent.department}</strong> for this service.
              {consent.appId && ` Your application ${consent.appId} may be affected.`} Data already processed may remain in the department's records per their retention policy.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#64748B" }}>Data access that will stop:</p>
            <div className="flex flex-wrap gap-1.5">
              {consent.dataShared.map((d) => (
                <span key={d} className="px-2 py-0.5 rounded text-xs" style={{ background: "#F1F5F9", color: "#475569" }}>{d}</span>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 flex-shrink-0"
              style={{ accentColor: "#DC2626" }}
            />
            <span className="text-xs leading-relaxed" style={{ color: "#334155" }}>
              I understand that revoking this consent may affect my application, and any data already shared cannot be recalled from the department.
            </span>
          </label>
        </div>

        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:bg-slate-50"
            style={{ borderColor: "#E2E8F0", color: "#64748B" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!agreed}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: agreed ? "#DC2626" : "#CBD5E1", cursor: agreed ? "pointer" : "not-allowed" }}
          >
            Revoke Consent
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Consent detail expanded ─────────────────────────── */
function ConsentDetail({ consent, onRevoke }: { consent: ConsentRecord; onRevoke: () => void }) {
  return (
    <div className="px-5 pb-5 pt-0 border-t space-y-4" style={{ borderColor: "#F1F5F9" }}>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {[
          ["Consent ID", consent.id],
          ["Department", consent.department],
          ["Data Source", consent.dataSource],
          ["Granted", consent.grantedAt],
          ["Expires / Expired", consent.expiresAt],
          ...(consent.appId ? [["Application ID", consent.appId]] : []),
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ color: "#94A3B8" }}>{k}</div>
            <div className="font-semibold mt-0.5" style={{ color: "#334155" }}>{v}</div>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "#64748B" }}>Purpose</p>
        <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{consent.purpose}</p>
      </div>

      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "#64748B" }}>Data being shared</p>
        <div className="flex flex-wrap gap-1.5">
          {consent.dataShared.map((d) => (
            <span key={d} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{d}</span>
          ))}
        </div>
      </div>

      {consent.status === "active" && (
        <button
          onClick={onRevoke}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-colors hover:bg-red-50"
          style={{ borderColor: "#FECACA", color: "#DC2626" }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Revoke this consent
        </button>
      )}
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function ConsentManagement() {
  const [consents, setConsents] = useState<ConsentRecord[]>(INITIAL_CONSENTS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<ConsentRecord | null>(null);
  const [filter, setFilter] = useState<"all" | ConsentStatus>("all");

  function handleRevoke(id: string) {
    setConsents((prev) => prev.map((c) => c.id === id ? { ...c, status: "revoked" as ConsentStatus } : c));
    setRevoking(null);
    setExpanded(null);
  }

  const active = consents.filter((c) => c.status === "active").length;
  const revoked = consents.filter((c) => c.status === "revoked").length;
  const expired = consents.filter((c) => c.status === "expired").length;

  const filtered = filter === "all" ? consents : consents.filter((c) => c.status === filter);

  return (
    <div className="space-y-5">
      {revoking && (
        <RevokeDialog
          consent={revoking}
          onConfirm={() => handleRevoke(revoking.id)}
          onCancel={() => setRevoking(null)}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Consent Management</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>All data-sharing consents you have granted to government services through eSamanvaya</p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active", count: active, color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
          { label: "Revoked", count: revoked, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { label: "Expired", count: expired, color: "#94A3B8", bg: "#F8FAFC", border: "#E2E8F0" },
        ].map((t) => (
          <button
            key={t.label}
            onClick={() => setFilter(filter === (t.label.toLowerCase() as ConsentStatus) ? "all" : t.label.toLowerCase() as ConsentStatus)}
            className="rounded-xl border p-4 text-left transition-all"
            style={{ background: "white", borderColor: filter === t.label.toLowerCase() ? t.color : t.border, boxShadow: filter === t.label.toLowerCase() ? `0 0 0 2px ${t.border}` : "none" }}
          >
            <div className="text-2xl font-bold" style={{ color: "#0F172A" }}>{t.count}</div>
            <div className="text-xs mt-1 font-medium" style={{ color: t.color }}>{t.label}</div>
          </button>
        ))}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
        <svg width="15" height="15" className="flex-shrink-0 mt-0.5" fill="none" stroke="#1D4ED8" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: "#1E40AF" }}>
          You are in control of your data. eSamanvaya only shares the minimum necessary data, with your explicit consent, for the stated purpose. You may revoke any active consent at any time.
        </p>
      </div>

      {/* Consent list */}
      <div className="space-y-3">
        {filtered.map((consent) => {
          const sm = STATUS_META[consent.status];
          const isOpen = expanded === consent.id;

          return (
            <div key={consent.id} className="bg-white rounded-xl border overflow-hidden transition-all" style={{ borderColor: "#E2E8F0" }}>
              <div
                className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : consent.id)}
              >
                {/* Left accent */}
                <div className="w-1 h-full rounded-full self-stretch flex-shrink-0" style={{ background: sm.color, minHeight: "40px" }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-mono text-xs font-bold" style={{ color: "#94A3B8" }}>{consent.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
                      </div>
                      <p className="text-sm font-semibold leading-snug" style={{ color: "#0F172A" }}>{consent.service}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{consent.department}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs" style={{ color: "#94A3B8" }}>Granted</div>
                      <div className="text-xs font-medium" style={{ color: "#475569" }}>{consent.grantedAt.split(" · ")[0]}</div>
                      {consent.status === "active" && (
                        <div className="text-xs mt-0.5" style={{ color: "#0D9488" }}>Expires {consent.expiresAt}</div>
                      )}
                    </div>
                  </div>

                  {/* Data chips preview */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {consent.dataShared.slice(0, 4).map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded text-xs" style={{ background: "#F1F5F9", color: "#64748B" }}>{d}</span>
                    ))}
                    {consent.dataShared.length > 4 && (
                      <span className="px-2 py-0.5 rounded text-xs" style={{ background: "#F1F5F9", color: "#94A3B8" }}>+{consent.dataShared.length - 4} more</span>
                    )}
                  </div>
                </div>

                {/* Chevron */}
                <svg
                  width="16" height="16" fill="none" stroke="#CBD5E1" strokeWidth="2" viewBox="0 0 24 24"
                  className="flex-shrink-0 mt-1"
                  style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              {isOpen && (
                <ConsentDetail
                  consent={consent}
                  onRevoke={() => setRevoking(consent)}
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-center" style={{ color: "#CBD5E1" }}>
        Consent records are maintained for 7 years per DGP-2024-MH-01 · Your data, your control
      </p>
    </div>
  );
}
