import { useState } from "react";
import { IcShield, IcFilter, IcSearch, IcCheck, IcX, IcInfo, IcEye } from "./Icons";

type ConsentStatus = "active" | "revoked" | "expired";
type AccessType = "read" | "verify" | "submit";

interface AccessRecord {
  id: string;
  service: string;
  department: string;
  dataRequested: string[];
  purpose: string;
  timestamp: string;
  consentStatus: ConsentStatus;
  accessType: AccessType;
  applicationId?: string;
}

const ACCESS_RECORDS: AccessRecord[] = [
  {
    id: "DAL-2024-0891",
    service: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna",
    department: "Directorate of Technical Education / MahaDBT",
    dataRequested: ["Full Name", "Date of Birth", "Income Certificate", "Annual Family Income", "Enrolment Records"],
    purpose: "Scholarship eligibility verification and application processing",
    timestamp: "26 Nov 2024, 11:42 AM",
    consentStatus: "active",
    accessType: "submit",
    applicationId: "AP-2024-9241",
  },
  {
    id: "DAL-2024-0847",
    service: "Income Certificate",
    department: "Revenue Department",
    dataRequested: ["Aadhaar Number (masked)", "Address", "Family Members"],
    purpose: "Certificate issuance for benefit eligibility",
    timestamp: "1 Nov 2024, 09:12 AM",
    consentStatus: "expired",
    accessType: "submit",
    applicationId: "AP-2024-8821",
  },
  {
    id: "DAL-2024-0812",
    service: "Ration Card — Household Verification",
    department: "Civil Supplies Department",
    dataRequested: ["Aadhaar Number (masked)", "Address", "Family Composition"],
    purpose: "Annual ration card renewal verification",
    timestamp: "18 Oct 2024, 3:05 PM",
    consentStatus: "active",
    accessType: "verify",
    applicationId: "AP-2024-7643",
  },
  {
    id: "DAL-2024-0774",
    service: "Ayushman Bharat Eligibility Check",
    department: "National Health Authority",
    dataRequested: ["Name", "Date of Birth", "BPL Status"],
    purpose: "Pre-check for PM-JAY eligibility (read-only, no application submitted)",
    timestamp: "5 Oct 2024, 11:30 AM",
    consentStatus: "expired",
    accessType: "read",
  },
  {
    id: "DAL-2024-0701",
    service: "Birth Certificate",
    department: "Municipal Corporation, Pune",
    dataRequested: ["Parent Names", "Date of Birth", "Place of Birth", "Address"],
    purpose: "Certificate issuance for civil registration",
    timestamp: "22 Jan 2024, 2:20 PM",
    consentStatus: "expired",
    accessType: "submit",
    applicationId: "AP-2024-1102",
  },
  {
    id: "DAL-2024-0651",
    service: "PM-KISAN Eligibility Verification",
    department: "Agriculture Department",
    dataRequested: ["Land Records", "Bank Account (masked)", "Aadhaar Number (masked)"],
    purpose: "Eligibility check for PM-KISAN income support scheme",
    timestamp: "3 Dec 2023, 9:50 AM",
    consentStatus: "revoked",
    accessType: "verify",
  },
];

const ACCESS_TYPE_META: Record<AccessType, { label: string; color: string; bg: string }> = {
  read: { label: "Read Only", color: "#64748B", bg: "#F8FAFC" },
  verify: { label: "Verification", color: "#7C3AED", bg: "#F5F3FF" },
  submit: { label: "Application", color: "#1D4ED8", bg: "#EFF6FF" },
};

const CONSENT_META: Record<ConsentStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  active: {
    label: "Active",
    color: "#0D9488",
    bg: "#F0FDFA",
    border: "#99F6E4",
    icon: <IcCheck size={12} stroke="#0D9488" />,
  },
  revoked: {
    label: "Revoked",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    icon: <IcX size={12} stroke="#DC2626" />,
  },
  expired: {
    label: "Expired",
    color: "#94A3B8",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    icon: (
      <svg width="12" height="12" fill="none" stroke="#94A3B8" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9.75" />
        <path strokeLinecap="round" d="M12 7.5V12l2.25 1.5" />
      </svg>
    ),
  },
};

export default function DataAccessHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConsentStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<AccessType | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = ACCESS_RECORDS.filter((r) => {
    const matchSearch =
      !search ||
      r.service.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.consentStatus === statusFilter;
    const matchType = typeFilter === "all" || r.accessType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    total: ACCESS_RECORDS.length,
    active: ACCESS_RECORDS.filter((r) => r.consentStatus === "active").length,
    revoked: ACCESS_RECORDS.filter((r) => r.consentStatus === "revoked").length,
    expired: ACCESS_RECORDS.filter((r) => r.consentStatus === "expired").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
          Data Access History
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          A complete log of every data access request made on your behalf through eSamanvaya
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Accesses", count: stats.total, color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
          { label: "Active Consents", count: stats.active, color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
          { label: "Revoked", count: stats.revoked, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { label: "Expired", count: stats.expired, color: "#94A3B8", bg: "#F8FAFC", border: "#E2E8F0" },
        ].map((s) => (
          <div
            key={s.label}
            className="px-4 py-3.5 rounded-xl border"
            style={{ background: s.bg, borderColor: s.border }}
          >
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</div>
            <div className="text-xs mt-0.5" style={{ color: s.color, opacity: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info notice */}
      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs"
        style={{ background: "#EFF6FF", borderColor: "#BFDBFE", color: "#1E40AF" }}
      >
        <IcShield size={14} className="flex-shrink-0 mt-0.5" stroke="#1D4ED8" />
        <span>
          This log is maintained under the National Data Governance Framework. Every access is time-stamped and auditable. You may revoke active consents from <strong>Consent &amp; Data Access</strong> at any time.
        </span>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border bg-white"
          style={{ borderColor: "#E2E8F0" }}
        >
          <IcSearch size={15} className="text-slate-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service, department, or record ID…"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#0F172A" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ConsentStatus | "all")}
            className="px-3 py-2 rounded-xl border text-xs font-medium bg-white outline-none cursor-pointer"
            style={{ borderColor: "#E2E8F0", color: "#475569" }}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as AccessType | "all")}
            className="px-3 py-2 rounded-xl border text-xs font-medium bg-white outline-none cursor-pointer"
            style={{ borderColor: "#E2E8F0", color: "#475569" }}
          >
            <option value="all">All access types</option>
            <option value="read">Read Only</option>
            <option value="verify">Verification</option>
            <option value="submit">Application</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <p className="text-xs" style={{ color: "#94A3B8" }}>
        {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Record list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
              <IcShield size={22} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium" style={{ color: "#334155" }}>No records match your search</p>
          </div>
        ) : (
          filtered.map((rec) => {
            const cMeta = CONSENT_META[rec.consentStatus];
            const tMeta = ACCESS_TYPE_META[rec.accessType];
            const isOpen = expanded === rec.id;
            return (
              <div
                key={rec.id}
                className="bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-sm"
                style={{ borderColor: "#E2E8F0" }}
              >
                {/* Summary row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : rec.id)}
                  className="w-full flex items-start gap-4 px-5 py-4 text-left"
                >
                  {/* Left: shield icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cMeta.bg }}
                  >
                    <IcShield size={17} stroke={cMeta.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Service name + badges */}
                    <div className="flex items-center flex-wrap gap-2 mb-0.5">
                      <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>{rec.service}</span>
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: cMeta.bg, color: cMeta.color, border: `1px solid ${cMeta.border}` }}
                      >
                        {cMeta.icon} {cMeta.label}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: tMeta.bg, color: tMeta.color }}
                      >
                        {tMeta.label}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: "#64748B" }}>{rec.department}</div>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: "#94A3B8" }}>
                      <span>{rec.timestamp}</span>
                      {rec.applicationId && (
                        <>
                          <span>·</span>
                          <span>App: {rec.applicationId}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>Ref: {rec.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                    <IcEye size={14} className="text-slate-400" />
                    <svg
                      width="14" height="14" fill="none" stroke="#94A3B8" strokeWidth="2" viewBox="0 0 24 24"
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path strokeLinecap="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t" style={{ borderColor: "#F1F5F9" }}>
                    {/* Data fields accessed */}
                    <div className="px-5 pt-4 pb-3">
                      <p className="text-xs font-semibold mb-2.5" style={{ color: "#94A3B8" }}>DATA ACCESSED</p>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.dataRequested.map((d) => (
                          <span
                            key={d}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ background: "#F8FAFC", color: "#334155", border: "1px solid #F1F5F9" }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Purpose + metadata table */}
                    <div className="border-t divide-y" style={{ borderColor: "#F1F5F9" }}>
                      {[
                        { label: "Purpose", value: rec.purpose },
                        { label: "Access Type", value: tMeta.label },
                        { label: "Timestamp", value: rec.timestamp },
                        { label: "Consent Status", value: cMeta.label },
                        ...(rec.applicationId ? [{ label: "Application ID", value: rec.applicationId }] : []),
                        { label: "Record ID", value: rec.id },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-start justify-between gap-4 px-5 py-3"
                        >
                          <span className="text-xs font-medium flex-shrink-0" style={{ color: "#94A3B8" }}>{row.label}</span>
                          <span className="text-xs text-right" style={{ color: "#334155" }}>{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="px-5 py-4 border-t flex gap-2 flex-wrap" style={{ borderColor: "#F1F5F9" }}>
                      {rec.consentStatus === "active" && (
                        <button
                          className="px-4 py-2 rounded-lg text-xs font-semibold border transition-colors hover:bg-red-50"
                          style={{ borderColor: "#FECACA", color: "#DC2626" }}
                        >
                          Revoke Consent
                        </button>
                      )}
                      {rec.applicationId && (
                        <button
                          className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-slate-50"
                          style={{ borderColor: "#E2E8F0", color: "#475569" }}
                        >
                          View Application
                        </button>
                      )}
                      <button
                        className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-slate-50"
                        style={{ borderColor: "#E2E8F0", color: "#64748B" }}
                      >
                        Download Audit Log
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer note */}
      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs"
        style={{ background: "#F8FAFC", borderColor: "#E2E8F0", color: "#64748B" }}
      >
        <IcInfo size={14} className="flex-shrink-0 mt-0.5" />
        <span>
          Audit logs are retained for 7 years as per the MeitY Data Retention Policy. For discrepancies or complaints, raise a grievance through <strong>Help &amp; Support</strong> or contact the relevant department's grievance officer.
        </span>
      </div>
    </div>
  );
}
