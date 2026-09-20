import { useState } from "react";

/* ─── Types ───────────────────────────────────────────── */
type AccessResult = "verified" | "failed" | "partial" | "pending";

interface DataAccessEvent {
  id: string;
  timestamp: string;
  service: string;
  department: string;
  requestedBy: string;
  purpose: string;
  fields: string[];
  result: AccessResult;
  retentionPolicy: string;
  retentionStatus: string;
  appId?: string;
  consentId?: string;
  note?: string;
}

/* ─── Data ────────────────────────────────────────────── */
const EVENTS: DataAccessEvent[] = [
  {
    id: "DAE-001",
    timestamp: "26 Nov 2024 · 11:40 AM",
    service: "Aadhaar eKYC",
    department: "UIDAI, MeitY",
    requestedBy: "eSamanvaya — Scholarship Application Flow",
    purpose: "Identity verification (name, DOB, address) for Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC/EWS) eligibility",
    fields: ["Full Name", "Date of Birth", "Residential Address", "Gender"],
    result: "partial",
    retentionPolicy: "Deleted post-verification (no storage by eSamanvaya)",
    retentionStatus: "Purged after session",
    appId: "ESM2026001234",
    consentId: "CST-101",
    note: "DOB mismatch (Aadhaar: 04 Mar 1994 vs DigiLocker: 14 Mar 1994). Conflict flagged; citizen resolved manually.",
  },
  {
    id: "DAE-002",
    timestamp: "26 Nov 2024 · 11:38 AM",
    service: "DigiLocker",
    department: "NIC, MeitY",
    requestedBy: "eSamanvaya — Document Collection Step",
    purpose: "Retrieve income certificate, education records, and Aadhaar for EBC/EWS scholarship application pre-fill",
    fields: ["Income Certificate", "Education Records", "Aadhaar Card", "Birth Certificate"],
    result: "verified",
    retentionPolicy: "Document references retained for 180 days (consent period)",
    retentionStatus: "Active — expires 25 May 2025",
    appId: "ESM2026001234",
    consentId: "CST-101",
  },
  {
    id: "DAE-003",
    timestamp: "26 Nov 2024 · 11:38 AM",
    service: "PFMS Payment Gateway",
    department: "Controller General of Accounts",
    requestedBy: "eSamanvaya — Bank Account Fetch",
    purpose: "Retrieve bank account details for Direct Benefit Transfer of scholarship amount",
    fields: ["Bank Account Number", "IFSC Code", "Account Holder Name"],
    result: "failed",
    retentionPolicy: "Not fetched — no data retained",
    retentionStatus: "No data stored (fetch failed)",
    appId: "ESM2026001234",
    consentId: "CST-101",
    note: "PFMS response timed out (1840ms). Bank details entered manually by citizen as fallback.",
  },
  {
    id: "DAE-004",
    timestamp: "12 Nov 2024 · 10:05 AM",
    service: "Revenue Department Database",
    department: "Revenue Department, GoMH",
    requestedBy: "eSamanvaya — Income Certificate Application",
    purpose: "Retrieve household income records for income certificate issuance",
    fields: ["Annual Income", "Occupation", "Property Details"],
    result: "verified",
    retentionPolicy: "Referenced in certificate — retained by Revenue Dept for 5 years",
    retentionStatus: "Active in Revenue Dept records",
    appId: "AP-2024-8821",
    consentId: "CST-097",
  },
  {
    id: "DAE-005",
    timestamp: "5 Nov 2024 · 10:20 AM",
    service: "Aadhaar eKYC",
    department: "UIDAI, MeitY",
    requestedBy: "Civil Supplies Dept — Ration Card Renewal",
    purpose: "Annual ration card renewal — household member verification",
    fields: ["Name", "Date of Birth", "Address"],
    result: "partial",
    retentionPolicy: "Deleted post-verification",
    retentionStatus: "Purged",
    consentId: "CST-089",
    note: "Consent expired on 4 Dec 2024. Access was within consent window at time of fetch.",
  },
  {
    id: "DAE-006",
    timestamp: "21 Nov 2024 · 10:38 AM",
    service: "Municipal Birth Registry",
    department: "Municipal Corporation, Pune",
    requestedBy: "eSamanvaya — Birth Certificate Application",
    purpose: "Verify birth registration details for certificate issuance",
    fields: ["Birth Date", "Birth Place", "Parent Names", "Hospital Name"],
    result: "pending",
    retentionPolicy: "Retained until certificate issued, then archived by MC",
    retentionStatus: "Pending — application in progress",
    appId: "AP-2024-9105",
    consentId: "CST-072",
  },
];

const RESULT_META: Record<AccessResult, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  verified: {
    label: "Successfully Verified",
    color: "#0D9488",
    bg: "#F0FDFA",
    border: "#99F6E4",
    icon: (
      <svg width="14" height="14" fill="none" stroke="#0D9488" strokeWidth="2.2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  failed: {
    label: "Fetch Failed",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    icon: (
      <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth="2.2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  partial: {
    label: "Partial — See Note",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: (
      <svg width="14" height="14" fill="none" stroke="#D97706" strokeWidth="2.2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H2.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0L21.303 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  pending: {
    label: "Pending",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    icon: (
      <svg width="14" height="14" fill="none" stroke="#1D4ED8" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
      </svg>
    ),
  },
};

/* ─── Event card ──────────────────────────────────────── */
function EventCard({ event }: { event: DataAccessEvent }) {
  const [open, setOpen] = useState(false);
  const rm = RESULT_META[event.result];

  return (
    <div className="relative pl-8">
      {/* Timeline line */}
      <div
        className="absolute left-3 top-4 bottom-0 w-0.5"
        style={{ background: "linear-gradient(to bottom, #E2E8F0, transparent)" }}
      />
      {/* Dot */}
      <div
        className="absolute left-0 top-3.5 w-7 h-7 rounded-full flex items-center justify-center border-2"
        style={{ background: rm.bg, borderColor: rm.border }}
      >
        {rm.icon}
      </div>

      <div className="bg-white rounded-xl border mb-4 overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div
          className="flex items-start gap-3 px-4 py-4 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs" style={{ color: "#94A3B8" }}>{event.timestamp}</span>
              {event.appId && (
                <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{event.appId}</span>
              )}
            </div>
            <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{event.service}</p>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{event.department} · {event.purpose.slice(0, 60)}{event.purpose.length > 60 ? "…" : ""}</p>

            <div className="flex items-center gap-2 mt-2.5">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: rm.color, background: rm.bg }}>{rm.label}</span>
              <span className="text-xs" style={{ color: "#CBD5E1" }}>{event.fields.length} fields</span>
            </div>
          </div>

          <svg
            width="16" height="16" fill="none" stroke="#CBD5E1" strokeWidth="2" viewBox="0 0 24 24"
            className="flex-shrink-0 mt-1"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {/* Expanded detail */}
        {open && (
          <div className="px-4 pb-5 border-t space-y-4" style={{ borderColor: "#F1F5F9" }}>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                ["Requested By", event.requestedBy],
                ["Consent Reference", event.consentId ?? "—"],
                ["Retention Policy", event.retentionPolicy],
                ["Current Status", event.retentionStatus],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: "#94A3B8" }}>{k}</div>
                  <div className="font-medium mt-0.5" style={{ color: "#334155" }}>{v}</div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#64748B" }}>Full stated purpose</p>
              <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{event.purpose}</p>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#64748B" }}>Data fields accessed</p>
              <div className="flex flex-wrap gap-1.5">
                {event.fields.map((f) => (
                  <span key={f} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{f}</span>
                ))}
              </div>
            </div>

            {event.note && (
              <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <svg width="14" height="14" className="flex-shrink-0 mt-0.5" fill="none" stroke="#D97706" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>{event.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function DataGovernance() {
  const [filter, setFilter] = useState<"all" | AccessResult>("all");

  const filtered = filter === "all" ? EVENTS : EVENTS.filter((e) => e.result === filter);

  const counts = {
    verified: EVENTS.filter((e) => e.result === "verified").length,
    partial: EVENTS.filter((e) => e.result === "partial").length,
    failed: EVENTS.filter((e) => e.result === "failed").length,
    pending: EVENTS.filter((e) => e.result === "pending").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Data Access Details</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>A transparent record of every time your data was requested, by whom, why, and what happened</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(counts) as [AccessResult, number][]).map(([k, count]) => {
          const m = RESULT_META[k];
          return (
            <button
              key={k}
              onClick={() => setFilter(filter === k ? "all" : k)}
              className="rounded-xl border p-3 text-left transition-all"
              style={{ background: "white", borderColor: filter === k ? m.color : m.border }}
            >
              <div className="text-xl font-bold" style={{ color: "#0F172A" }}>{count}</div>
              <div className="text-xs mt-0.5 font-medium" style={{ color: m.color }}>{m.label}</div>
            </button>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
        <svg width="15" height="15" className="flex-shrink-0 mt-0.5" fill="none" stroke="#1D4ED8" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: "#1E40AF" }}>
          eSamanvaya only fetches and transmits data that you have explicitly consented to, for the stated purpose only. Data is not stored beyond the consent period unless required by the receiving department's policy.
        </p>
      </div>

      {/* Timeline */}
      <div>
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: "#94A3B8" }}>No records match the selected filter.</div>
        )}
      </div>

      <p className="text-xs text-center" style={{ color: "#CBD5E1" }}>
        Data access records retained for 7 years · DGP-2024-MH-01 · This log is for your reference only
      </p>
    </div>
  );
}
