import { useState } from "react";
import { IcShield, IcCheck, IcLock, IcDownload, IcInfo } from "./Icons";

/* ── My Documents ── */
const DOCUMENTS = [
  { name: "Income Certificate 2024", dept: "Revenue Department", size: "245 KB", date: "12 Nov 2024", color: "#0D9488", bg: "#F0FDFA" },
  { name: "Caste Certificate", dept: "District Collectorate", size: "189 KB", date: "3 Oct 2024", color: "#1D4ED8", bg: "#EFF6FF" },
  { name: "Birth Certificate", dept: "Municipal Corporation", size: "312 KB", date: "22 Jan 2024", color: "#7C3AED", bg: "#F5F3FF" },
  { name: "Domicile Certificate", dept: "Revenue Department", size: "201 KB", date: "15 Sep 2023", color: "#D97706", bg: "#FFFBEB" },
];

export function MyDocuments() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>My Documents</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          Certificates and documents issued through eSamanvaya are stored here. DigiLocker-linked documents are also listed.
        </p>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="divide-y" style={{ borderColor: "#F1F5F9" }}>
          {DOCUMENTS.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: doc.bg }}
              >
                <svg width="18" height="18" fill="none" stroke={doc.color} strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M14.25 2.25H6.75a1.5 1.5 0 00-1.5 1.5v16.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V8.25L14.25 2.25z" />
                  <path strokeLinecap="round" d="M14.25 2.25V8.25h6M9 13h6M9 16.5h4.5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm" style={{ color: "#0F172A" }}>{doc.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                  {doc.dept} &nbsp;·&nbsp; PDF &nbsp;·&nbsp; {doc.size} &nbsp;·&nbsp; {doc.date}
                </div>
              </div>
              <button
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium flex-shrink-0 transition-colors hover:bg-slate-50"
                style={{ borderColor: "#E2E8F0", color: "#334155" }}
              >
                <IcDownload size={13} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Consent & Data Access ── */
const CONSENTS = [
  { dept: "Revenue Department", data: "Income records, land ownership data", granted: "12 Nov 2024", expiry: "12 Nov 2025", active: true },
  { dept: "Civil Supplies Department", data: "Ration card and household data", granted: "5 Nov 2024", expiry: "5 Nov 2025", active: true },
  { dept: "Municipal Corporation", data: "Property and address records", granted: "22 Jan 2024", expiry: "22 Jan 2025", active: false },
];

export function ConsentDataAccess() {
  const [consents, setConsents] = useState(CONSENTS);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Consent & Data Access</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          You control which departments can access your data. All consents are time-bound and revocable at any time.
        </p>
      </div>
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm"
        style={{ background: "#EFF6FF", borderColor: "#BFDBFE", color: "#1E40AF" }}
      >
        <IcInfo size={15} className="flex-shrink-0 mt-0.5" />
        <span>
          Revoking consent stops all future data sharing by that department immediately. Historical data shared under previous consent is subject to the department's retention policy.
        </span>
      </div>
      <div className="space-y-3">
        {consents.map((c, i) => (
          <div
            key={c.dept}
            className="bg-white rounded-xl border p-5"
            style={{ borderColor: "#E2E8F0" }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: c.active ? "#F0FDFA" : "#F8FAFC" }}
                >
                  <IcShield size={17} className={c.active ? "text-teal-600" : "text-slate-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>{c.dept}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>Data shared: {c.data}</div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: "#94A3B8" }}>
                    <span>Granted: {c.granted}</span>
                    <span>·</span>
                    <span>Valid until: {c.expiry}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-medium" style={{ color: c.active ? "#0D9488" : "#94A3B8" }}>
                  {c.active ? "Active" : "Revoked"}
                </span>
                <button
                  role="switch"
                  aria-checked={c.active}
                  onClick={() =>
                    setConsents(consents.map((x, j) => j === i ? { ...x, active: !x.active } : x))
                  }
                  className="relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    background: c.active ? "#1D4ED8" : "#E2E8F0",
                    focusRingColor: "#1D4ED8",
                  } as React.CSSProperties}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                    style={{ left: c.active ? "calc(100% - 20px)" : "4px" }}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Linked services */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#F1F5F9" }}>
          <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Linked Digital Services</span>
        </div>
        <div className="divide-y" style={{ borderColor: "#F1F5F9" }}>
          {[
            { name: "DigiLocker", status: "Linked", statusColor: "#0D9488", statusBg: "#F0FDFA", desc: "4 documents accessible" },
            { name: "Aadhaar eKYC", status: "Verified", statusColor: "#0D9488", statusBg: "#F0FDFA", desc: "Last used 3 days ago" },
            { name: "UMANG", status: "Not Linked", statusColor: "#94A3B8", statusBg: "#F8FAFC", desc: "Connect to access more services" },
          ].map((svc) => (
            <div key={svc.name} className="flex items-center gap-3 px-5 py-3.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: svc.statusBg }}>
                <IcLock size={15} style={{ color: svc.statusColor } as React.CSSProperties} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: "#0F172A" }}>{svc.name}</div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>{svc.desc}</div>
              </div>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: svc.statusBg, color: svc.statusColor }}
              >
                {svc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Notifications ── */
const NOTIFS = [
  { type: "success", title: "Income Certificate Approved", time: "2 hours ago", desc: "Your application AP-2024-8821 has been approved and the certificate is ready for download in My Documents." },
  { type: "info", title: "Consent Request from Civil Supplies Dept.", time: "1 day ago", desc: "Civil Supplies Department is requesting access to your household data for ration card verification. Please review and respond." },
  { type: "warning", title: "Document Required — Scholarship Application", time: "3 days ago", desc: "Please upload your caste certificate and income certificate for AP-2024-7643 before 5 December 2024." },
  { type: "info", title: "New Login Detected", time: "5 days ago", desc: "Your account was accessed from a new device (Chrome, Windows). If this was not you, contact support immediately." },
  { type: "success", title: "Aadhaar eKYC Verified", time: "1 week ago", desc: "Your Aadhaar eKYC has been verified and linked to your eSamanvaya profile successfully." },
];

const NOTIF_STYLES: Record<string, { icon: string; bg: string; border: string; text: string }> = {
  success: { icon: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", text: "#0F766E" },
  info: { icon: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF" },
  warning: { icon: "#D97706", bg: "#FFFBEB", border: "#FDE68A", text: "#92400E" },
};

export function Notifications() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Notifications</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Updates on your applications, consents, and account activity</p>
        </div>
        <button className="text-xs font-medium" style={{ color: "#1D4ED8" }}>Mark all as read</button>
      </div>
      <div className="space-y-3">
        {NOTIFS.map((n, i) => {
          const s = NOTIF_STYLES[n.type];
          return (
            <div
              key={i}
              className="bg-white rounded-xl border p-4 flex items-start gap-4"
              style={{ borderColor: "#E2E8F0" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                {n.type === "success" ? (
                  <IcCheck size={16} stroke={s.icon} />
                ) : n.type === "warning" ? (
                  <svg width="16" height="16" fill="none" stroke={s.icon} strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                ) : (
                  <IcInfo size={16} stroke={s.icon} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>{n.title}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: "#CBD5E1" }}>{n.time}</span>
                </div>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "#64748B" }}>{n.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Help & Support ── */
export function HelpSupport() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Help & Support</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Find answers, raise a grievance, or contact the helpdesk</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "FAQs", desc: "Common questions about services, applications, and consent", color: "#1D4ED8", bg: "#EFF6FF" },
          { label: "Raise a Grievance", desc: "Report issues with an application or department response", color: "#D97706", bg: "#FFFBEB" },
          { label: "Contact Helpdesk", desc: "Toll-free: 1800-111-555 | Mon–Sat, 9 AM – 6 PM", color: "#0D9488", bg: "#F0FDFA" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: c.bg }}>
              <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
            </div>
            <div className="font-semibold text-sm mb-1" style={{ color: "#0F172A" }}>{c.label}</div>
            <div className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Settings ── */
export function Settings() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Account preferences, language, notifications, and security</p>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        {[
          { label: "Display Language", value: "English" },
          { label: "Notification Preferences", value: "SMS + Email" },
          { label: "Two-Factor Authentication", value: "Enabled" },
          { label: "Linked Mobile Number", value: "+91 98765 43210" },
          { label: "Linked Email", value: "priya.sharma@gmail.com" },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? "border-b" : ""}`}
            style={{ borderColor: "#F1F5F9" }}
          >
            <div className="text-sm font-medium" style={{ color: "#0F172A" }}>{row.label}</div>
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: "#64748B" }}>{row.value}</span>
              <button className="text-xs font-medium" style={{ color: "#1D4ED8" }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Profile ── */
export function Profile() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>My Profile</h1>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-6 border-b flex items-center gap-4" style={{ borderColor: "#F1F5F9" }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: "#1D4ED8" }}
          >
            P
          </div>
          <div>
            <div className="font-bold text-lg" style={{ color: "#0F172A" }}>Priya Sharma</div>
            <div className="text-sm" style={{ color: "#64748B" }}>Citizen ID: CSZ-4821-MH</div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-xs font-medium" style={{ color: "#0D9488" }}>Verified Citizen</span>
            </div>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: "#F1F5F9" }}>
          {[
            { label: "Full Name", value: "Priya Ramesh Sharma" },
            { label: "Date of Birth", value: "14 March 1994" },
            { label: "Gender", value: "Female" },
            { label: "Mobile Number", value: "+91 98765 43210" },
            { label: "Email Address", value: "priya.sharma@gmail.com" },
            { label: "Permanent Address", value: "B-12, Shivaji Nagar, Pune — 411005, Maharashtra" },
            { label: "Aadhaar Status", value: "Verified" },
            { label: "PAN Linked", value: "Yes" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-xs font-medium" style={{ color: "#64748B" }}>{row.label}</span>
              <span className="text-sm" style={{ color: "#0F172A" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
