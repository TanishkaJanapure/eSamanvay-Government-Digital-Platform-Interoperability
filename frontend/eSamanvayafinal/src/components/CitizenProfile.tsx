import { useState } from "react";
import type { RegisteredCitizenData } from "../pages/RegisterPage";

/* ─── Types ───────────────────────────────────────────── */
type Tab = "profile" | "language" | "notifications" | "security" | "sessions";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

/* ─── Static data ─────────────────────────────────────── */
const INITIAL_PROFILE = {
  name: "Priya Ramesh Sharma",
  mobile: "+91 98765 43210",
  email: "priya.sharma@gmail.com",
  dob: "14 March 1994",
  gender: "Female",
  aadhaar: "XXXX XXXX 4821",
  category: "EBC / EWS",
  address: "B-12, Shivaji Nagar, Pune — 411005, Maharashtra",
  citizenId: "CSZ-4821-MH",
  accountCreated: "12 March 2024",
  aadhaarVerified: true,
};

const SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro", browser: "Chrome 130", location: "Pune, Maharashtra", lastActive: "Now", current: true },
  { id: "s2", device: "iPhone 14", browser: "Safari 17", location: "Pune, Maharashtra", lastActive: "2 hours ago", current: false },
  { id: "s3", device: "Windows 11 PC", browser: "Edge 129", location: "Mumbai, Maharashtra", lastActive: "3 days ago", current: false },
];

const LANGUAGES = [
  { code: "en", name: "English", script: "English" },
  { code: "mr", name: "Marathi", script: "मराठी" },
  { code: "hi", name: "Hindi", script: "हिन्दी" },
];

/* ─── Toggle switch ───────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative flex-shrink-0 rounded-full transition-colors duration-200"
      style={{ width: "40px", height: "22px", background: on ? "#1D4ED8" : "#CBD5E1" }}
    >
      <span
        className="absolute top-0.5 rounded-full bg-white transition-transform duration-200 shadow-sm"
        style={{ width: "18px", height: "18px", transform: on ? "translateX(20px)" : "translateX(2px)" }}
      />
    </button>
  );
}

/* ─── Tab: Profile ────────────────────────────────────── */
function ProfileTab({ citizenData }: { citizenData?: RegisteredCitizenData | null }) {
  const merged = citizenData
    ? {
        ...INITIAL_PROFILE,
        name: citizenData.name,
        email: citizenData.email,
        mobile: citizenData.mobile,
        dob: citizenData.dob,
        gender: citizenData.gender,
        aadhaar: `XXXX XXXX ${citizenData.aadhaarLast4}`,
        accountCreated: citizenData.accountCreated,
        aadhaarVerified: true,
      }
    : INITIAL_PROFILE;

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(merged);
  const [draft, setDraft] = useState(merged);
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function cancelEdit() {
    setDraft(profile);
    setEditing(false);
  }

  const ReadRow = ({ label, value, masked }: { label: string; value: string; masked?: boolean }) => (
    <div className="flex items-start justify-between py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
      <span className="text-xs font-medium w-32 flex-shrink-0" style={{ color: "#94A3B8" }}>{label}</span>
      <span className="text-sm flex-1 text-right font-medium" style={{ color: masked ? "#CBD5E1" : "#0F172A" }}>
        {masked ? "••••••••••••" : value}
      </span>
    </div>
  );

  return (
    <div className="space-y-5">
      {saved && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{ background: "#F0FDFA", border: "1px solid #99F6E4" }}>
          <svg width="15" height="15" fill="none" stroke="#0D9488" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="text-xs font-semibold" style={{ color: "#0D9488" }}>Profile updated successfully.</span>
        </div>
      )}

      {/* Avatar card */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 select-none"
            style={{ background: "#1D4ED8" }}
          >
            {profile.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("")}
          </div>
          <div>
            <h2 className="text-base font-semibold" style={{ color: "#0F172A" }}>{profile.name}</h2>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Citizen ID: <span className="font-mono font-bold">{profile.citizenId}</span></p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#0D9488" }} />
              <span className="text-xs font-medium" style={{ color: "#0D9488" }}>Verified · Aadhaar eKYC</span>
            </div>
          </div>
          <button
            onClick={() => { setEditing(!editing); setDraft(profile); }}
            className="ml-auto px-4 py-2 rounded-xl border text-xs font-semibold transition-colors hover:bg-slate-50"
            style={{ borderColor: editing ? "#1D4ED8" : "#E2E8F0", color: editing ? "#1D4ED8" : "#64748B" }}
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>Personal Information</h3>
        <p className="text-xs mb-4" style={{ color: "#CBD5E1" }}>Sensitive fields (Aadhaar, mobile) are masked. Contact a service centre to update them.</p>

        {editing ? (
          <div className="space-y-4">
            {[
              { label: "Full Name", key: "name" as const, editable: true },
              { label: "Email Address", key: "email" as const, editable: true },
              { label: "Date of Birth", key: "dob" as const, editable: false },
              { label: "Gender", key: "gender" as const, editable: false },
              { label: "Address", key: "address" as const, editable: true },
            ].map(({ label, key, editable }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#334155" }}>{label}</label>
                {editable ? (
                  key === "address" ? (
                    <textarea
                      rows={2}
                      value={draft[key]}
                      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none"
                      style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
                      onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#93C5FD"; }}
                      onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#E2E8F0"; }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={draft[key]}
                      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#93C5FD"; }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
                    />
                  )
                ) : (
                  <div className="px-3.5 py-2.5 rounded-xl text-sm" style={{ background: "#F8FAFC", color: "#94A3B8" }}>
                    {draft[key]} <span className="text-xs ml-2">(cannot be changed here)</span>
                  </div>
                )}
              </div>
            ))}

            {/* Masked fields */}
            <div className="grid grid-cols-2 gap-4">
              {[["Aadhaar Number", profile.aadhaar], ["Mobile Number", profile.mobile]].map(([label, val]) => (
                <div key={label}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#334155" }}>{label}</label>
                  <div className="px-3.5 py-2.5 rounded-xl text-sm font-mono" style={{ background: "#F8FAFC", color: "#94A3B8" }}>{val}</div>
                  <p className="text-xs mt-1" style={{ color: "#CBD5E1" }}>Visit service centre to update</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={cancelEdit} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold hover:bg-slate-50" style={{ borderColor: "#E2E8F0", color: "#64748B" }}>Cancel</button>
              <button onClick={saveProfile} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "#1D4ED8" }}>Save Changes</button>
            </div>
          </div>
        ) : (
          <div>
            <ReadRow label="Full Name" value={profile.name} />
            <ReadRow label="Mobile" value={profile.mobile} masked />
            <ReadRow label="Email" value={profile.email} />
            <ReadRow label="Date of Birth" value={profile.dob} />
            <ReadRow label="Gender" value={profile.gender} />
            <ReadRow label="Aadhaar" value={profile.aadhaar} masked />
            <div className="flex items-start justify-between py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
              <span className="text-xs font-medium w-32 flex-shrink-0" style={{ color: "#94A3B8" }}>Aadhaar Status</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#0D9488" }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Verified
              </span>
            </div>
            <ReadRow label="Category" value={profile.category} />
            <ReadRow label="Address" value={profile.address} />
            <ReadRow label="Account Created" value={profile.accountCreated} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Tab: Language ───────────────────────────────────── */
function LanguageTab() {
  const [selected, setSelected] = useState("en");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "#0F172A" }}>Interface Language</h3>
        <p className="text-xs mb-5" style={{ color: "#64748B" }}>eSamanvaya will display forms and labels in your preferred language where translations are available.</p>
        <div className="space-y-3">
          {LANGUAGES.map((lang) => (
            <label
              key={lang.code}
              className="flex items-center gap-4 px-4 py-4 rounded-xl border cursor-pointer transition-all"
              style={{ borderColor: selected === lang.code ? "#1D4ED8" : "#E2E8F0", background: selected === lang.code ? "#EFF6FF" : "white" }}
            >
              <input
                type="radio"
                name="language"
                value={lang.code}
                checked={selected === lang.code}
                onChange={() => { setSelected(lang.code); setSaved(false); }}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: selected === lang.code ? "#1D4ED8" : "#CBD5E1" }}
              >
                {selected === lang.code && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1D4ED8" }} />}
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>{lang.script}</span>
                <span className="text-xs ml-2" style={{ color: "#94A3B8" }}>{lang.name}</span>
              </div>
              {selected === lang.code && (
                <svg width="16" height="16" fill="none" stroke="#1D4ED8" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </label>
          ))}
        </div>
        {saved && (
          <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "#0D9488" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Language preference saved.
          </div>
        )}
        <button
          onClick={() => setSaved(true)}
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#1D4ED8" }}
        >
          Save Language Preference
        </button>
      </div>
    </div>
  );
}

/* ─── Tab: Notifications ──────────────────────────────── */
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    app_status: true,
    consent_requests: true,
    document_alerts: true,
    scheme_updates: false,
    security_alerts: true,
    sms: true,
    email: true,
    push: false,
  });

  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const groups = [
    {
      label: "Alert Types",
      items: [
        { key: "app_status" as const, label: "Application Status Updates", desc: "When your application moves to a new stage" },
        { key: "consent_requests" as const, label: "Consent Requests", desc: "When a service requests access to your data" },
        { key: "document_alerts" as const, label: "Document & Verification Alerts", desc: "Missing documents, verification results" },
        { key: "scheme_updates" as const, label: "New Schemes & Services", desc: "When new government services become available" },
        { key: "security_alerts" as const, label: "Security Alerts", desc: "Logins from new devices or suspicious activity" },
      ],
    },
    {
      label: "Delivery Channels",
      items: [
        { key: "sms" as const, label: "SMS (registered mobile)", desc: "Text messages to +91 98765 43210" },
        { key: "email" as const, label: "Email", desc: "Messages to priya.sharma@gmail.com" },
        { key: "push" as const, label: "Browser Notifications", desc: "Desktop push notifications (requires permission)" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.label} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9", background: "#FAFCFF" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#94A3B8" }}>{group.label}</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
            {group.items.map((item) => (
              <div key={item.key} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "#0F172A" }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{item.desc}</p>
                </div>
                <Toggle on={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Tab: Security ───────────────────────────────────── */
function SecurityTab() {
  const [twoFA, setTwoFA] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);
  const [analyticsOptOut, setAnalyticsOptOut] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwSaved, setPwSaved] = useState(false);

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!passwords.current || !passwords.next) return;
    setPwSaved(true);
    setShowChangePassword(false);
    setPasswords({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 3000);
  }

  return (
    <div className="space-y-5">
      {pwSaved && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{ background: "#F0FDFA", border: "1px solid #99F6E4" }}>
          <svg width="14" height="14" fill="none" stroke="#0D9488" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          <span className="text-xs font-semibold" style={{ color: "#0D9488" }}>Password updated successfully.</span>
        </div>
      )}

      {/* Security settings */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9", background: "#FAFCFF" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#94A3B8" }}>Account Security</h3>
        </div>
        {[
          { label: "Two-Factor Authentication (OTP)", desc: "Require OTP on every login. Strongly recommended.", on: twoFA, toggle: () => setTwoFA(!twoFA) },
          { label: "Allow eSamanvaya Data Sharing", desc: "Permit eSamanvaya to fetch and forward data to government services on your behalf, per consent.", on: dataSharing, toggle: () => setDataSharing(!dataSharing) },
          { label: "Opt out of anonymised usage analytics", desc: "Platform usage patterns used to improve services. Opt out to exclude your session data.", on: analyticsOptOut, toggle: () => setAnalyticsOptOut(!analyticsOptOut) },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-4 px-5 py-4 border-b last:border-0" style={{ borderColor: "#F8FAFC" }}>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "#0F172A" }}>{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{item.desc}</p>
            </div>
            <Toggle on={item.on} onChange={item.toggle} />
          </div>
        ))}
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F1F5F9" }}>
          <div>
            <p className="text-sm font-medium" style={{ color: "#0F172A" }}>Change Password</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Last changed: 3 months ago</p>
          </div>
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="text-xs font-semibold"
            style={{ color: "#1D4ED8" }}
          >
            {showChangePassword ? "Cancel" : "Change"}
          </button>
        </div>
        {showChangePassword && (
          <form onSubmit={submitPassword} className="px-5 py-5 space-y-4">
            {[
              { label: "Current Password", key: "current" as const },
              { label: "New Password", key: "next" as const },
              { label: "Confirm New Password", key: "confirm" as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#334155" }}>{label}</label>
                <input
                  type="password"
                  value={passwords[key]}
                  onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#93C5FD"; }}
                  onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
                />
              </div>
            ))}
            <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "#1D4ED8" }}>
              Update Password
            </button>
            <p className="text-xs text-center" style={{ color: "#CBD5E1" }}>Prototype — password is not actually changed</p>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Tab: Sessions ───────────────────────────────────── */
function SessionsTab() {
  const [sessions, setSessions] = useState(SESSIONS);
  const [revoking, setRevoking] = useState<string | null>(null);

  function revokeSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setRevoking(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
        <svg width="15" height="15" className="flex-shrink-0 mt-0.5" fill="none" stroke="#1D4ED8" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: "#1E40AF" }}>
          Review your active login sessions. If you see an unfamiliar device or location, revoke that session immediately and change your password.
        </p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9", background: "#FAFCFF" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#94A3B8" }}>Active Sessions ({sessions.length})</h3>
        </div>
        <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: session.current ? "#EFF6FF" : "#F8FAFC" }}>
                <svg width="16" height="16" fill="none" stroke={session.current ? "#1D4ED8" : "#94A3B8"} strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{session.device}</span>
                  {session.current && (
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: "#F0FDFA", color: "#0D9488" }}>Current</span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                  {session.browser} · {session.location} · {session.lastActive}
                </p>
              </div>
              {!session.current && (
                revoking === session.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => setRevoking(null)} className="text-xs px-2.5 py-1.5 rounded-lg border" style={{ borderColor: "#E2E8F0", color: "#64748B" }}>Cancel</button>
                    <button onClick={() => revokeSession(session.id)} className="text-xs px-2.5 py-1.5 rounded-lg text-white" style={{ background: "#DC2626" }}>Confirm</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setRevoking(session.id)}
                    className="text-xs font-semibold flex-shrink-0"
                    style={{ color: "#DC2626" }}
                  >
                    Revoke
                  </button>
                )
              )}
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="py-8 text-center text-sm" style={{ color: "#94A3B8" }}>All other sessions revoked.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function CitizenProfile({ citizenData }: { citizenData?: RegisteredCitizenData | null }) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const TABS: { id: Tab; label: string }[] = [
    { id: "profile", label: "Personal Details" },
    { id: "language", label: "Language" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Privacy & Security" },
    { id: "sessions", label: "Sessions" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Profile & Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Manage your citizen account, language, notifications, and security settings</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-white border overflow-x-auto" style={{ borderColor: "#E2E8F0" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: activeTab === tab.id ? "#0F172A" : "transparent",
              color: activeTab === tab.id ? "white" : "#64748B",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && <ProfileTab citizenData={citizenData} />}
      {activeTab === "language" && <LanguageTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "sessions" && <SessionsTab />}
    </div>
  );
}
