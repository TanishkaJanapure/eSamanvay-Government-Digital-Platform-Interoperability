import { useState } from "react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const NAV_LINKS = ["Home", "Services", "How It Works", "Security", "About"];
const LANGUAGES = ["English", "मराठी", "हिन्दी", "தமிழ்", "বাংলা"];

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.953 11.953 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Consent-Based Data Sharing",
    desc: "Citizens retain full control over their data. Every data exchange requires explicit, revocable consent logged on an auditable trail.",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    title: "Secure API Integration",
    desc: "Standardised, authenticated APIs connect existing government systems without requiring expensive infrastructure replacements.",
    color: "text-teal-700",
    bg: "bg-teal-50",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: "Unified Workflow",
    desc: "Cross-departmental services are orchestrated into single, coherent citizen journeys — no more visiting multiple portals.",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    title: "Transparent Tracking",
    desc: "Real-time status updates and a complete audit trail give citizens and officials full visibility into every application.",
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
];

const STEPS = [
  { num: "01", label: "Select Service", desc: "Browse the integrated service directory and choose the service you need." },
  { num: "02", label: "Give Consent", desc: "Review exactly what data will be accessed and provide explicit digital consent." },
  { num: "03", label: "Verify Information", desc: "Data is fetched from authoritative sources and presented for your confirmation." },
  { num: "04", label: "Submit & Track", desc: "Submit your application and track its progress in real time from your dashboard." },
];

const STATS = [
  { value: "48+", label: "Integrated Departments" },
  { value: "2.4M+", label: "Citizens Served" },
  { value: "180+", label: "Digital Services" },
  { value: "99.7%", label: "Platform Uptime" },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [activeNav, setActiveNav] = useState("Home");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F8FC", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#1E3A8A", color: "#BFDBFE" }} className="text-xs py-1.5 px-4 flex justify-between items-center">
        <span>Government of India — Digital India Initiative</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition-colors">Screen Reader Access</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">Skip to Main Content</a>
        </div>
      </div>

      {/* Main nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#1D4ED8" }}>
                <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.636-6.364-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05 5.636 5.636" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-base" style={{ color: "#0F172A", letterSpacing: "-0.01em" }}>eSamanvaya</div>
                <div className="text-xs" style={{ color: "#64748B" }}>Digital Interoperability</div>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  onClick={() => setActiveNav(link)}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{
                    color: activeNav === link ? "#1D4ED8" : "#334155",
                    background: activeNav === link ? "#EFF6FF" : "transparent",
                  }}
                >
                  {link}
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Language selector */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border transition-colors"
                  style={{ borderColor: "#E2E8F0", color: "#334155", background: "white" }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  {selectedLang}
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setSelectedLang(l); setLangOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                        style={{ color: l === selectedLang ? "#1D4ED8" : "#334155" }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigate("officer-login")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border font-medium transition-colors"
                style={{ borderColor: "#7C3AED", color: "#7C3AED", background: "white" }}
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M12 2.25l8.25 3v5.625C20.25 16.088 16.725 20.7 12 21.75 7.275 20.7 3.75 16.088 3.75 10.875V5.25L12 2.25z" />
                </svg>
                Officer Portal
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold text-white transition-all"
                style={{ background: "#1D4ED8" }}
              >
                Citizen Login
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md"
                style={{ color: "#334155" }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {mobileMenuOpen
                    ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button key={link} className="text-left px-3 py-2.5 rounded-md text-sm font-medium" style={{ color: "#334155" }}>
                {link}
              </button>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2 flex gap-2">
              <button onClick={() => onNavigate("officer-login")} className="flex-1 py-2 text-sm border rounded-md font-medium" style={{ borderColor: "#7C3AED", color: "#7C3AED", background: "white" }}>
                Officer Portal
              </button>
              <button onClick={() => onNavigate("login")} className="flex-1 py-2 text-sm rounded-md font-semibold text-white" style={{ background: "#1D4ED8" }}>
                Citizen Login
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(145deg, #EFF6FF 0%, #F5F8FC 50%, #F0FDFA 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #DBEAFE44 0%, transparent 50%), radial-gradient(circle at 80% 20%, #CCFBF133 0%, transparent 40%)" }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Government of India — Digital India
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6" style={{ color: "#0F172A", letterSpacing: "-0.03em" }}>
                  Connect Government Services.{" "}
                  <span style={{ color: "#1D4ED8" }}>Simplify Citizen Access.</span>
                </h1>
                <p className="text-lg lg:text-xl leading-relaxed mb-8" style={{ color: "#475569" }}>
                  eSamanvaya connects existing government digital services through secure, consent-based interoperability — eliminating redundant paperwork and enabling seamless data exchange across departments.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate("login")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all"
                    style={{ background: "#1D4ED8" }}
                  >
                    Access Citizen Services
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border transition-all" style={{ borderColor: "#CBD5E1", color: "#1E293B", background: "white" }}>
                    View API Documentation
                  </button>
                </div>
                <div className="mt-8 flex flex-wrap gap-6">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <div className="text-2xl font-bold" style={{ color: "#1D4ED8" }}>{s.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Hero illustration */}
              <div className="relative hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ background: "white", border: "1px solid #E2E8F0" }}>
                  {/* Mini dashboard mockup */}
                  <div className="h-8 flex items-center gap-1.5 px-4 border-b" style={{ borderColor: "#F1F5F9", background: "#F8FAFC" }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                    <div className="ml-3 text-xs font-medium" style={{ color: "#94A3B8" }}>eSamanvaya Citizen Portal</div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium mb-1" style={{ color: "#64748B" }}>Welcome back</div>
                        <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>Priya Sharma</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "#F0FDFA", color: "#0D9488" }}>Verified</div>
                    </div>
                    {/* Service cards */}
                    {[
                      { name: "Income Certificate", status: "Approved", statusColor: "#0D9488", statusBg: "#F0FDFA", dept: "Revenue Dept." },
                      { name: "Ration Card Update", status: "In Review", statusColor: "#D97706", statusBg: "#FFFBEB", dept: "Civil Supplies" },
                      { name: "Birth Certificate", status: "Submitted", statusColor: "#2563EB", statusBg: "#EFF6FF", dept: "Municipal Corp." },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                        <div>
                          <div className="text-sm font-medium" style={{ color: "#0F172A" }}>{item.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{item.dept}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: item.statusBg, color: item.statusColor }}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                      <div className="h-full rounded-full" style={{ width: "68%", background: "#1D4ED8" }} />
                    </div>
                    <div className="text-xs" style={{ color: "#94A3B8" }}>3 of 5 services linked · Last synced 2 min ago</div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-6 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg" style={{ background: "white", border: "1px solid #E2E8F0" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#F0FDFA" }}>
                    <svg width="16" height="16" fill="none" stroke="#0D9488" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "#0F172A" }}>Consent Verified</div>
                    <div className="text-xs" style={{ color: "#64748B" }}>DigiLocker linked</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20" style={{ background: "#F5F8FC" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: "#0D9488" }}>Platform Capabilities</div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Built for interoperability at scale</h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: "#475569" }}>
                Four foundational capabilities that enable seamless, trustworthy data exchange across India's government ecosystem.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-6 border transition-shadow hover:shadow-md" style={{ borderColor: "#E2E8F0" }}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.bg} ${f.color}`}>
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-base mb-2" style={{ color: "#0F172A" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: "#1D4ED8" }}>How It Works</div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Four steps to a seamless experience</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px" style={{ background: "linear-gradient(to right, #DBEAFE, #BFDBFE, #99F6E4, #BFDBFE)" }} />
              {STEPS.map((s, i) => (
                <div key={s.num} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-5 shadow-md"
                    style={{ background: i % 2 === 0 ? "#1D4ED8" : "#0D9488" }}>
                    {s.num}
                  </div>
                  <h3 className="font-semibold text-base mb-2" style={{ color: "#0F172A" }}>{s.label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button onClick={() => onNavigate("login")} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: "#1D4ED8" }}>
                Get Started
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Security / Interoperability */}
        <section className="py-20" style={{ background: "#F5F8FC" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: "#0D9488" }}>Security & Standards</div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-5" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Aligned with national digital standards</h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: "#475569" }}>
                  eSamanvaya is built on the National Data Governance Framework and India Enterprise Architecture guidelines, with full compliance to MeitY security standards.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "DigiLocker Integration", desc: "Document verification through MeitY's DigiLocker infrastructure" },
                    { label: "Aadhaar-based eKYC", desc: "Secure identity verification using UIDAI's eKYC APIs" },
                    { label: "CERT-In Compliant", desc: "Security posture aligned to CERT-In guidelines and audit requirements" },
                    { label: "Open API Standards", desc: "RESTful APIs following India Urban Data Exchange (IUDX) specifications" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#F0FDFA" }}>
                        <svg width="12" height="12" fill="none" stroke="#0D9488" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "#0F172A" }}>{item.label}</div>
                        <div className="text-sm" style={{ color: "#64748B" }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Data Encryption", sub: "AES-256 at rest and in transit", icon: "🔐", iconColor: "#1D4ED8", iconBg: "#EFF6FF" },
                  { title: "Audit Logging", sub: "Every data access is logged and timestamped", icon: "📋", iconColor: "#0D9488", iconBg: "#F0FDFA" },
                  { title: "Role-Based Access", sub: "Granular permissions per department and role", icon: "👥", iconColor: "#7C3AED", iconBg: "#F5F3FF" },
                  { title: "ISO 27001 Aligned", sub: "Information security management aligned to international standards", icon: "✓", iconColor: "#D97706", iconBg: "#FFFBEB" },
                ].map((card) => (
                  <div key={card.title} className="bg-white rounded-2xl p-5 border" style={{ borderColor: "#E2E8F0" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: card.iconBg }}>
                      <span style={{ color: card.iconColor, fontSize: "18px" }}>{card.icon}</span>
                    </div>
                    <div className="font-semibold text-sm mb-1" style={{ color: "#0F172A" }}>{card.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{card.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Ready to simplify citizen services?</h2>
            <p className="text-base mb-8" style={{ color: "#475569" }}>
              Access 180+ government services through a single, secure platform with your existing Aadhaar or DigiLocker credentials.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => onNavigate("login")} className="px-7 py-3 rounded-lg text-sm font-semibold text-white" style={{ background: "#1D4ED8" }}>
                Login as Citizen
              </button>
              <button className="px-7 py-3 rounded-lg text-sm font-semibold border" style={{ borderColor: "#CBD5E1", color: "#334155" }}>
                Register as New User
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "#0F172A" }} className="text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1D4ED8" }}>
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                    <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2" />
                  </svg>
                </div>
                <span className="font-bold text-white">eSamanvaya</span>
              </div>
              <p className="text-sm leading-relaxed">Government Digital Interoperability Platform — Ministry of Electronics & Information Technology, Government of India.</p>
            </div>
            {[
              { heading: "Services", links: ["Citizen Portal", "Government API", "Department Integration", "Analytics Dashboard"] },
              { heading: "Resources", links: ["Developer Docs", "API Reference", "Integration Guide", "Support Centre"] },
              { heading: "Policies", links: ["Privacy Policy", "Data Governance", "Terms of Use", "Accessibility"] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="font-semibold text-white text-sm mb-4">{col.heading}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-sm hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between gap-3 text-xs">
            <div>© 2024 Ministry of Electronics & Information Technology, Government of India. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
