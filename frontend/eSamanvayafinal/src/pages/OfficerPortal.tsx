import { useState, useEffect } from "react";
import ControlRoom from "../components/officer/ControlRoom";
import ApplicationMonitoring from "../components/officer/ApplicationMonitoring";
import ApiHealth from "../components/officer/ApiHealth";
import AuditLogs from "../components/officer/AuditLogs";
import DataQuality from "../components/officer/DataQuality";
import DataMapping from "../components/officer/DataMapping";
import { useCitizenApplications } from "../components/officer/useCitizenApplications";

/* ─── Types ───────────────────────────────────────────── */
type OfficerSection = "control-room" | "app-monitoring" | "api-health" | "data-quality" | "data-mapping" | "audit-logs";

interface NavItem {
  id: OfficerSection;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface OfficerPortalProps {
  onNavigate: (page: string) => void;
}

/* ─── Icons ───────────────────────────────────────────── */
const IcGrid = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IcList = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);
const IcActivity = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);
const IcShield = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcLogout = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);
const IcMenu = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);
const IcCheck = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IcMap = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M7.5 3.75l-3 1.5v15l3-1.5 6 3 6-3v-15l-6 3-6-3zM9 3.75v15M15 6.75v15" />
  </svg>
);
const IcX = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IcChevronRight = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const IcBell = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const IcGlobe = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);

/* ─── Nav items ───────────────────────────────────────── */
function buildNavItems(appCount: number): NavItem[] {
  return [
    { id: "control-room", label: "Control Room", icon: <IcGrid /> },
    { id: "app-monitoring", label: "Application Monitoring", icon: <IcList />, badge: appCount > 0 ? appCount : undefined },
    { id: "api-health", label: "API & Workflow Health", icon: <IcActivity /> },
    { id: "data-quality", label: "Data Quality", icon: <IcCheck /> },
    { id: "data-mapping", label: "Data Mapping", icon: <IcMap /> },
    { id: "audit-logs", label: "Audit Logs", icon: <IcShield /> },
  ];
}

const SECTION_LABELS: Record<OfficerSection, string> = {
  "control-room": "Control Room",
  "app-monitoring": "Application Monitoring",
  "api-health": "API & Workflow Health",
  "data-quality": "Data Quality",
  "data-mapping": "Data Mapping",
  "audit-logs": "Audit Logs",
};

/* ─── Sidebar content ─────────────────────────────────── */
function SidebarContent({ collapsed, active, onSelect, onLogout, navItems }: {
  collapsed: boolean;
  active: OfficerSection;
  onSelect: (id: OfficerSection) => void;
  onLogout: () => void;
  navItems: NavItem[];
}) {
  function NavBtn({ item }: { item: NavItem }) {
    const isActive = item.id === active;
    return (
      <div className="relative group/nav">
        <button
          onClick={() => onSelect(item.id)}
          className="w-full flex items-center rounded-lg transition-colors text-left"
          style={{
            gap: collapsed ? 0 : "10px",
            padding: collapsed ? "9px" : "9px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            background: isActive ? "#EFF6FF" : "transparent",
            color: isActive ? "#1D4ED8" : "#475569",
          }}
          onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#F8FAFC"; }}
          onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <span className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center">{item.icon}</span>
          {!collapsed && <span className="flex-1 text-sm font-medium truncate">{item.label}</span>}
          {!collapsed && item.badge && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-white flex items-center justify-center font-bold" style={{ background: "#DC2626", fontSize: "10px" }}>
              {item.badge}
            </span>
          )}
        </button>
        {collapsed && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover/nav:opacity-100 transition-opacity z-50 shadow-lg" style={{ background: "#0F172A", color: "white" }}>
            {item.label}{item.badge ? ` (${item.badge})` : ""}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-14 flex-shrink-0 border-b px-3" style={{ borderColor: "#F1F5F9" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#1D4ED8" }}>
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.636-6.364-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05 5.636 5.636" />
          </svg>
        </div>
        {!collapsed && (
          <div className="ml-2.5 min-w-0">
            <div className="font-bold text-sm leading-tight" style={{ color: "#0F172A" }}>eSamanvaya</div>
            <div className="text-xs truncate font-semibold" style={{ color: "#1D4ED8" }}>Officer Portal</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => <NavBtn key={item.id} item={item} />)}
      </nav>

      {/* Bottom */}
      <div className="flex-shrink-0 px-2 pb-3 border-t" style={{ borderColor: "#F1F5F9" }}>
        <div className="mt-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center rounded-lg transition-colors"
            style={{ gap: collapsed ? 0 : "10px", padding: collapsed ? "9px" : "9px 12px", justifyContent: collapsed ? "center" : "flex-start", color: "#DC2626" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            <span className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center"><IcLogout /></span>
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
        {!collapsed && (
          <div className="mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-lg" style={{ background: "#F8FAFC" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "#7C3AED" }}>A</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: "#0F172A" }}>Anjali Mehta</div>
              <div className="text-xs truncate" style={{ color: "#94A3B8" }}>Officer · OFF-441-PUNE</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function OfficerPortal({ onNavigate }: OfficerPortalProps) {
  const { apps } = useCitizenApplications();
  const navItems = buildNavItems(apps.length);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const [active, setActive] = useState<OfficerSection>("control-room");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    function close() { setNotifOpen(false); setProfileOpen(false); }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  function renderSection() {
    switch (active) {
      case "control-room": return <ControlRoom />;
      case "app-monitoring": return <ApplicationMonitoring />;
      case "api-health": return <ApiHealth />;
      case "data-quality": return <DataQuality />;
      case "data-mapping": return <DataMapping />;
      case "audit-logs": return <AuditLogs />;
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#F5F8FC", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <header className="flex-shrink-0 h-14 bg-white border-b flex items-center px-3 gap-2 z-30" style={{ borderColor: "#E2E8F0" }}>
        <button
          onClick={() => { if (window.innerWidth < 768) setMobileDrawer(!mobileDrawer); else setSidebarOpen(!sidebarOpen); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100 flex-shrink-0"
          style={{ color: "#475569" }}
        >
          <IcMenu />
        </button>

        <div className="hidden md:flex items-center gap-1.5 ml-1 text-sm" style={{ color: "#94A3B8" }}>
          <span>eSamanvaya</span>
          <IcChevronRight />
          <span style={{ color: "#7C3AED", fontWeight: 600 }}>Officer Portal</span>
          <IcChevronRight />
          <span style={{ color: "#0F172A", fontWeight: 500 }}>{SECTION_LABELS[active]}</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          {/* Back to citizen portal */}
          <button
            onClick={() => onNavigate("dashboard")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:bg-slate-50 mr-1"
            style={{ borderColor: "#E2E8F0", color: "#64748B" }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Citizen Portal
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
              style={{ color: "#475569" }}
            >
              <IcBell />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#DC2626" }} />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-xl border z-50 overflow-hidden" style={{ borderColor: "#E2E8F0" }} onClick={(e) => e.stopPropagation()}>
                <div className="px-4 py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                  <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>System Alerts</span>
                </div>
                {[
                  apps.length === 0
                    ? { msg: "No citizen scholarship applications in the queue", type: "ok" as const }
                    : { msg: `${apps.length} application(s) synced from citizen portal`, type: "ok" as const },
                  { msg: "Officer portal shows live data from local application store", type: "ok" as const },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-0" style={{ borderColor: "#F8FAFC" }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: n.type === "warn" ? "#D97706" : n.type === "err" ? "#DC2626" : "#0D9488" }} />
                    <span className="text-xs" style={{ color: "#334155" }}>{n.msg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Language */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: "#E2E8F0", color: "#475569" }}>
            <IcGlobe /> EN
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border transition-colors hover:bg-slate-50"
              style={{ borderColor: "#E2E8F0", background: "white" }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#7C3AED" }}>A</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none" style={{ color: "#0F172A" }}>Anjali Mehta</div>
                <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Scrutiny Officer</div>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border py-1 z-50 overflow-hidden" style={{ borderColor: "#E2E8F0" }} onClick={(e) => e.stopPropagation()}>
                <div className="px-4 py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                  <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>Anjali Mehta</div>
                  <div className="text-xs" style={{ color: "#64748B" }}>OFF-441-PUNE</div>
                  <div className="text-xs mt-1" style={{ color: "#7C3AED" }}>Scrutiny Officer · Social Justice</div>
                </div>
                <div className="border-t mt-1" style={{ borderColor: "#F1F5F9" }}>
                  <button
                    onClick={() => onNavigate("landing")}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-red-50 transition-colors"
                    style={{ color: "#DC2626" }}
                  >
                    <IcLogout /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex flex-col flex-shrink-0 bg-white border-r transition-all duration-200 overflow-hidden"
          style={{ width: sidebarOpen ? "220px" : "56px", borderColor: "#E2E8F0" }}
        >
          <SidebarContent collapsed={!sidebarOpen} active={active} onSelect={setActive} onLogout={() => onNavigate("landing")} navItems={navItems} />
        </aside>

        {/* Mobile drawer */}
        {mobileDrawer && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <button className="absolute inset-0 bg-black/30" onClick={() => setMobileDrawer(false)} />
            <div className="relative flex flex-col bg-white h-full shadow-xl" style={{ width: "240px" }}>
              <button
                onClick={() => setMobileDrawer(false)}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100"
                style={{ color: "#64748B" }}
              >
                <IcX size={16} />
              </button>
              <SidebarContent collapsed={false} active={active} onSelect={(id) => { setActive(id); setMobileDrawer(false); }} onLogout={() => onNavigate("landing")} navItems={navItems} />
            </div>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
