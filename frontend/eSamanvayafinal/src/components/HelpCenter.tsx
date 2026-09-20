import { useState } from "react";

/* ─── Types ───────────────────────────────────────────── */
type IssueCategory = "application" | "consent" | "documents" | "technical" | "account" | "other";

interface FAQ {
  q: string;
  a: string;
  category: string;
}

/* ─── FAQ data ────────────────────────────────────────── */
const FAQS: FAQ[] = [
  // Application help
  { category: "Applications", q: "How do I start a new application?", a: "Go to Find Services from your dashboard sidebar. Search or browse government services. Click Start Application on any integrated service. You will be guided through eligibility check, consent, data collection, and submission." },
  { category: "Applications", q: "How long does processing take?", a: "Processing time varies by department and service. Each service card shows an estimated turnaround. You can track your application's progress stage-by-stage in My Applications → Track." },
  { category: "Applications", q: "Can I edit an application after submitting?", a: "Once submitted, applications cannot be edited through eSamanvaya. Contact the concerned department directly or use the grievance channel below if a correction is needed." },
  { category: "Applications", q: "What does 'Under Scrutiny' mean?", a: "Your application has been received by the department and is being reviewed by a Scrutiny Officer. No action is required from you at this stage unless you receive a specific notification." },
  { category: "Applications", q: "I submitted an application but have not received a confirmation.", a: "Check My Applications for the submission status. If the status shows Draft, the application was not submitted. If it shows Submitted, look for the confirmation in Notifications. If neither, contact support." },

  // Consent & privacy
  { category: "Consent & Privacy", q: "What data does eSamanvaya access?", a: "eSamanvaya only fetches the minimum data needed for each service, with your explicit consent. You can see exactly what data was requested and from which source in Data Access Details." },
  { category: "Consent & Privacy", q: "How do I revoke a consent?", a: "Go to Consent Management in the sidebar. Find the active consent you wish to revoke and click Revoke. You will be shown a clear confirmation screen before anything is changed." },
  { category: "Consent & Privacy", q: "Does eSamanvaya store my Aadhaar number?", a: "No. eSamanvaya uses Aadhaar eKYC for identity verification but does not store your Aadhaar number. Only the last four digits are retained as a masked reference. Full UID is purged after verification." },
  { category: "Consent & Privacy", q: "For how long is my data retained?", a: "Document references are retained for the duration of your consent period (typically 30–180 days). Audit logs and consent records are maintained for 7 years per Government Data Governance Policy DGP-2024." },

  // API / Service issues
  { category: "API & Service Issues", q: "Why is DigiLocker data not loading?", a: "DigiLocker sync may fail due to a temporary service interruption on NIC infrastructure. Wait a few minutes and retry. If the issue persists, you can upload documents manually." },
  { category: "API & Service Issues", q: "My bank details from PFMS could not be fetched.", a: "PFMS Gateway has periodic high-latency periods. If automatic fetch fails, you will be prompted to enter your bank account number and IFSC code manually. Both paths are equally valid for your application." },
  { category: "API & Service Issues", q: "eSamanvaya says my caste certificate is not found.", a: "Ensure your DigiLocker account is linked to your Aadhaar and that the certificate has been issued in digital form. Certificates issued before 2019 may not be available digitally — contact the issuing authority." },

  // Account & general
  { category: "Account", q: "How do I change my mobile number?", a: "Mobile number is linked to your Aadhaar registration. To update it, visit the nearest Aadhaar Seva Kendra. Changes will reflect in eSamanvaya after the next Aadhaar sync." },
  { category: "Account", q: "I forgot my password.", a: "On the login screen, click Forgot Password and enter your registered mobile number. An OTP will be sent for identity verification, after which you can set a new password." },
  { category: "Account", q: "Is my data shared with any private company?", a: "No. eSamanvaya is a government interoperability platform. Your data is only shared between authorised government departments, with your explicit consent, for the stated purpose." },
];

const CATEGORIES = ["All", "Applications", "Consent & Privacy", "API & Service Issues", "Account"];

const ISSUE_CATEGORIES: { value: IssueCategory; label: string }[] = [
  { value: "application", label: "Application Problem" },
  { value: "consent", label: "Consent / Data Privacy" },
  { value: "documents", label: "Document / DigiLocker Issue" },
  { value: "technical", label: "Technical / API Error" },
  { value: "account", label: "Account / Login" },
  { value: "other", label: "Other" },
];

/* ─── Help topic cards ────────────────────────────────── */
const HELP_TOPICS = [
  { label: "Application Help", sub: "Start, track, edit applications", icon: "📋", section: "Applications" },
  { label: "Consent & Privacy", sub: "Your data rights and controls", icon: "🔒", section: "Consent & Privacy" },
  { label: "API & Service Issues", sub: "Data sources, retries, errors", icon: "⚡", section: "API & Service Issues" },
  { label: "Account & Login", sub: "Password, sessions, profile", icon: "👤", section: "Account" },
];

// Use SVG icons instead of emoji
const TOPIC_ICONS: Record<string, React.ReactNode> = {
  "Application Help": (
    <svg width="20" height="20" fill="none" stroke="#1D4ED8" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  ),
  "Consent & Privacy": (
    <svg width="20" height="20" fill="none" stroke="#0D9488" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  "API & Service Issues": (
    <svg width="20" height="20" fill="none" stroke="#D97706" strokeWidth="1.75" viewBox="0 0 24 24">
      <polyline strokeLinecap="round" strokeLinejoin="round" points="22,12 18,12 15,21 9,3 6,12 2,12" />
    </svg>
  ),
  "Account & Login": (
    <svg width="20" height="20" fill="none" stroke="#7C3AED" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
};

const TOPIC_BG: Record<string, string> = {
  "Application Help": "#EFF6FF",
  "Consent & Privacy": "#F0FDFA",
  "API & Service Issues": "#FFFBEB",
  "Account & Login": "#F5F3FF",
};

/* ─── Report issue form ───────────────────────────────── */
function ReportIssueForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ category: "application" as IssueCategory, appId: "", description: "", contact: "" });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId] = useState(`GRV-${Math.floor(100000 + Math.random() * 900000)}`);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-8 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#F0FDFA" }}>
          <svg width="24" height="24" fill="none" stroke="#0D9488" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>Issue Reported Successfully</p>
          <p className="text-xs mt-1" style={{ color: "#64748B" }}>Your grievance has been registered.</p>
          <p className="text-sm font-bold mt-2 font-mono" style={{ color: "#1D4ED8" }}>{ticketId}</p>
          <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Use this ticket ID to track your grievance status</p>
        </div>
        <p className="text-xs" style={{ color: "#CBD5E1" }}>Expected response within 5 working days · Prototype — no real grievance is filed</p>
        <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#1D4ED8" }}>Done</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#334155" }}>Issue Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as IssueCategory })}
          className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
          style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
        >
          {ISSUE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#334155" }}>Application ID <span style={{ color: "#94A3B8", fontWeight: 400 }}>(optional)</span></label>
        <input
          type="text"
          placeholder="e.g. ESM2026001234"
          value={form.appId}
          onChange={(e) => setForm({ ...form, appId: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none font-mono"
          style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#93C5FD"; }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#334155" }}>Description <span style={{ color: "#DC2626" }}>*</span></label>
        <textarea
          rows={4}
          placeholder="Describe the issue clearly. Include what you expected and what happened instead."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none"
          style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
          onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#93C5FD"; }}
          onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#E2E8F0"; }}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#334155" }}>Preferred contact <span style={{ color: "#94A3B8", fontWeight: 400 }}>(mobile or email)</span></label>
        <input
          type="text"
          placeholder="We will use your registered mobile by default"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
          style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#93C5FD"; }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
        />
      </div>
      <p className="text-xs" style={{ color: "#CBD5E1" }}>Prototype — this form does not submit to a real grievance system</p>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold hover:bg-slate-50" style={{ borderColor: "#E2E8F0", color: "#64748B" }}>Cancel</button>
        <button
          type="submit"
          disabled={!form.description.trim()}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: form.description.trim() ? "#1D4ED8" : "#CBD5E1", cursor: form.description.trim() ? "pointer" : "not-allowed" }}
        >
          Submit Report
        </button>
      </div>
    </form>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  const filtered = FAQS.filter((faq) => {
    const q = search.toLowerCase();
    const matchSearch = !q || faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
    const matchCat = category === "All" || faq.category === category;
    return matchSearch && matchCat;
  });

  // Group by category
  const grouped = CATEGORIES.filter((c) => c !== "All").reduce((acc, cat) => {
    const items = filtered.filter((f) => f.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Help & Support</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Find answers, report an issue, or contact support</p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg width="16" height="16" fill="none" stroke="#94A3B8" strokeWidth="1.75" viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help articles, FAQs, and topics…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none bg-white"
          style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#93C5FD"; }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
        />
      </div>

      {/* Topic cards — only show when not searching */}
      {!search && category === "All" && (
        <div className="grid grid-cols-2 gap-3">
          {HELP_TOPICS.map((topic) => (
            <button
              key={topic.label}
              onClick={() => setCategory(topic.section)}
              className="p-4 rounded-xl border text-left transition-all hover:shadow-sm bg-white"
              style={{ borderColor: "#E2E8F0" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: TOPIC_BG[topic.label] }}>
                {TOPIC_ICONS[topic.label]}
              </div>
              <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{topic.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{topic.sub}</p>
            </button>
          ))}
        </div>
      )}

      {/* Category filter pills */}
      {(search || category !== "All") && (
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                background: category === cat ? "#0F172A" : "white",
                color: category === cat ? "white" : "#64748B",
                borderColor: category === cat ? "#0F172A" : "#E2E8F0",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* FAQ accordion */}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide px-1" style={{ color: "#94A3B8" }}>{cat}</h2>
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
            {items.map((faq, i) => {
              const key = `${cat}-${i}`;
              const open = expandedFaq === key;
              return (
                <div key={i} className="border-b last:border-0" style={{ borderColor: "#F1F5F9" }}>
                  <button
                    onClick={() => setExpandedFaq(open ? null : key)}
                    className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <svg
                      width="16" height="16" fill="none" stroke="#CBD5E1" strokeWidth="2" viewBox="0 0 24 24"
                      className="flex-shrink-0 mt-0.5"
                      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    <span className="text-sm font-medium flex-1" style={{ color: "#0F172A" }}>{faq.q}</span>
                  </button>
                  {open && (
                    <div className="px-5 pb-4 pl-12">
                      <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" fill="none" stroke="#CBD5E1" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: "#334155" }}>No results found</p>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>Try a different search term or browse by topic above.</p>
        </div>
      )}

      {/* Contact / support */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "#0F172A" }}>Need more help?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "National Helpline", detail: "1800-233-0001", sub: "Mon–Sat, 9 AM – 6 PM", color: "#1D4ED8", bg: "#EFF6FF" },
            { label: "Email Support", detail: "support@esamanvaya.gov.in", sub: "Response within 3 working days", color: "#0D9488", bg: "#F0FDFA" },
            { label: "Grievance Portal", detail: "pgportal.gov.in", sub: "For formal grievance registration", color: "#7C3AED", bg: "#F5F3FF" },
          ].map((item) => (
            <div key={item.label} className="px-4 py-3.5 rounded-xl" style={{ background: item.bg }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#64748B" }}>{item.label}</p>
              <p className="text-sm font-bold" style={{ color: item.color }}>{item.detail}</p>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Report issue */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F1F5F9" }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>Report an Issue</h2>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Couldn't find your answer? Report the problem directly.</p>
          </div>
          <button
            onClick={() => setShowReport(!showReport)}
            className="px-4 py-2 rounded-xl border text-xs font-semibold transition-colors hover:bg-slate-50"
            style={{ borderColor: showReport ? "#1D4ED8" : "#E2E8F0", color: showReport ? "#1D4ED8" : "#64748B" }}
          >
            {showReport ? "Cancel" : "Report Issue"}
          </button>
        </div>
        {showReport && (
          <div className="px-5 py-5">
            <ReportIssueForm onClose={() => setShowReport(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
