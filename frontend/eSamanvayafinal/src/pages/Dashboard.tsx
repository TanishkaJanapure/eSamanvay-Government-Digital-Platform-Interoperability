import { useState, useEffect } from "react";
import {
  IcHome, IcSearch, IcFile, IcFolder, IcShield, IcBell,
  IcHelp, IcSettings, IcUser, IcLogout, IcGlobe,
  IcMenu, IcX, IcChevronRight,
} from "../components/Icons";
import DashboardHome from "../components/DashboardHome";
import FindServices from "../components/FindServices";
import EligibilityFlow from "../components/EligibilityFlow";
import ApplicationReview from "../components/ApplicationReview";
import SubmissionFlow from "../components/SubmissionFlow";
import ApplicationTracker from "../components/ApplicationTracker";
import NotificationCenter from "../components/NotificationCenter";
import DataAccessHistory from "../components/DataAccessHistory";
import ConsentManagement from "../components/ConsentManagement";
import DataGovernance from "../components/DataGovernance";
import CitizenProfile from "../components/CitizenProfile";
import HelpCenter from "../components/HelpCenter";
import { MyDocuments } from "../components/SectionPlaceholders";
import type { UserProfile } from "../services/authService";
import { getCitizenId } from "../services/authService";
import type { VerifyResponse } from "../services/esamanvayApi";
import {
  createDraftApplication,
  getApplication,
  getUserApplications,
  upsertApplication,
  type ScholarshipApplication,
} from "../services/applicationStore";

interface DashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  user: UserProfile;
  language: string;
}

type SectionId =
  | "dashboard"
  | "find-services"
  | "apply-flow"
  | "app-review"
  | "submission"
  | "my-applications"
  | "my-documents"
  | "consent"
  | "data-governance"
  | "data-access-history"
  | "notifications"
  | "help"
  | "settings"
  | "profile";

interface NavGroup {
  items: NavItem[];
  dividerAfter?: boolean;
}

interface NavItem {
  id: SectionId | "logout";
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

function buildNavGroups(appCount: number, consentCount: number): NavGroup[] {
  return [
    {
      items: [
        { id: "dashboard", label: "Dashboard", icon: <IcHome /> },
        { id: "find-services", label: "Find Services", icon: <IcSearch /> },
      ],
      dividerAfter: true,
    },
    {
      items: [
        ...(appCount > 0 ? [{ id: "my-applications" as SectionId, label: "My Applications", icon: <IcFile />, badge: appCount }] : [{ id: "my-applications" as SectionId, label: "My Applications", icon: <IcFile /> }]),
        { id: "my-documents", label: "My Documents", icon: <IcFolder /> },
        ...(consentCount > 0 ? [{ id: "consent" as SectionId, label: "Consent & Data Access", icon: <IcShield />, badge: consentCount }] : [{ id: "consent" as SectionId, label: "Consent & Data Access", icon: <IcShield /> }]),
        { id: "notifications", label: "Notifications", icon: <IcBell /> },
      ],
    },
  ];
}

const LANGUAGES = ["English", "मराठी", "हिन्दी", "தமிழ்", "বাংলা"];

function SidebarContent({
  collapsed,
  active,
  onSelect,
  onLogout,
  displayName,
  citizenId,
  initials,
  navGroups,
}: {
  collapsed: boolean;
  active: string;
  onSelect: (id: SectionId) => void;
  onLogout: () => void;
  displayName: string;
  citizenId: string;
  initials: string;
  navGroups: NavGroup[];
}) {
  function NavBtn({ item }: { item: NavItem }) {
    const isActive = item.id === active;
    const isLogout = item.id === "logout";

    return (
      <div className="relative group/nav">
        <button
          onClick={() => {
            if (isLogout) onLogout();
            else onSelect(item.id as SectionId);
          }}
          className="w-full flex items-center rounded-lg transition-colors text-left"
          style={{
            gap: collapsed ? 0 : "10px",
            padding: collapsed ? "9px" : "9px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            background: isActive ? "#EFF6FF" : "transparent",
            color: isActive ? "#1D4ED8" : isLogout ? "#DC2626" : "#475569",
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.background = isLogout ? "#FEF2F2" : "#F8FAFC";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }
          }}
        >
          <span className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center">
            {item.icon}
          </span>
          {!collapsed && (
            <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
          )}
          {!collapsed && item.badge && (
            <span
              className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-white flex items-center justify-center font-bold"
              style={{ background: "#1D4ED8", fontSize: "10px" }}
            >
              {item.badge}
            </span>
          )}
        </button>
        {/* Tooltip when collapsed */}
        {collapsed && (
          <div
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover/nav:opacity-100 transition-opacity z-50 shadow-lg"
            style={{ background: "#0F172A", color: "white" }}
          >
            {item.label}
            {item.badge ? ` (${item.badge})` : ""}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center h-14 flex-shrink-0 border-b px-3"
        style={{ borderColor: "#F1F5F9" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#1D4ED8" }}
        >
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.636-6.364-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05 5.636 5.636" />
          </svg>
        </div>
        {!collapsed && (
          <div className="ml-2.5 min-w-0">
            <div className="font-bold text-sm leading-tight" style={{ color: "#0F172A" }}>eSamanvaya</div>
            <div className="text-xs truncate" style={{ color: "#94A3B8" }}>Digital Platform</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.items.map((item) => (
              <NavBtn key={item.id} item={item} />
            ))}
            {group.dividerAfter && (
              <div className="my-2" style={{ borderTop: "1px solid #F1F5F9" }} />
            )}
          </div>
        ))}
      </nav>

      {/* Bottom: profile mini card */}
      <div className="flex-shrink-0 px-2 pb-3 border-t" style={{ borderColor: "#F1F5F9" }}>
        {!collapsed && (
          <div
            className="mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
            style={{ background: "#F8FAFC" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "#1D4ED8" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: "#0F172A" }}>{displayName}</div>
              <div className="text-xs truncate" style={{ color: "#94A3B8" }}>{citizenId}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate, onLogout, user, language }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const [active, setActive] = useState<SectionId>("dashboard");
  const [trackedAppId, setTrackedAppId] = useState<string | undefined>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState(language.slice(0, 2).toUpperCase() || "EN");
  const [applications, setApplications] = useState<ScholarshipApplication[]>(() => getUserApplications(user.id));
  const [activeApplication, setActiveApplication] = useState<ScholarshipApplication>(() => createDraftApplication(user.id));
  const [verificationResult, setVerificationResult] = useState<VerifyResponse | null>(
    activeApplication.verificationResult ?? null,
  );

  const displayName = user.name;
  const citizenId = getCitizenId(user.id);
  const navGroups = buildNavGroups(applications.length, applications.filter((a) => a.consent).length);

  function refreshApplications() {
    const apps = getUserApplications(user.id);
    setApplications(apps);
    return apps;
  }

  function handleApplicationChange(app: ScholarshipApplication) {
    const existing = getApplication(app.userId, app.id);
    const saved = upsertApplication(existing ? { ...existing, ...app } : app);
    setActiveApplication(saved);
    if (saved.verificationResult) setVerificationResult(saved.verificationResult);
    refreshApplications();
    return saved;
  }
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  // Close dropdowns on outside click
  useEffect(() => {
    function close() {
      setNotifOpen(false);
      setProfileOpen(false);
      setLangOpen(false);
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    if (active === "my-applications") {
      refreshApplications();
    }
  }, [active]);

  function goTo(section: string) {
    setActive(section as SectionId);
    setMobileDrawer(false);
  }

  function startApplicationFlow() {
    const draft = createDraftApplication(user.id);
    setActiveApplication(draft);
    setVerificationResult(draft.verificationResult ?? null);
    setActive("apply-flow");
  }

  function renderSection() {
    switch (active) {
      case "dashboard":
        return <DashboardHome onGoTo={goTo} user={user} applications={applications} />;
      case "find-services":
        return <FindServices onGoTo={(s) => (s === "apply-flow" ? startApplicationFlow() : goTo(s))} />;
      case "apply-flow":
        return (
          <EligibilityFlow
            user={user}
            application={activeApplication}
            onApplicationChange={handleApplicationChange}
            onExit={() => setActive("dashboard")}
            onComplete={() => setActive("app-review")}
            verificationResult={verificationResult}
            onVerificationComplete={(result) => {
              setVerificationResult(result);
            }}
          />
        );
      case "app-review":
        return (
          <ApplicationReview
            user={user}
            onBack={() => setActive("apply-flow")}
            onSubmit={() => setActive("submission")}
            verificationResult={verificationResult}
          />
        );
      case "submission":
        return (
          <SubmissionFlow
            application={activeApplication}
            verificationResult={verificationResult}
            onDone={(appId) => {
              handleApplicationChange({
                ...activeApplication,
                status: "SUBMITTED",
                submittedAt: new Date().toISOString(),
              });
              setTrackedAppId(appId);
              setActive("my-applications");
            }}
          />
        );
      case "my-applications":
        return (
          <ApplicationTracker
            applications={applications}
            appId={trackedAppId}
            onGoTo={(s) => (s === "apply-flow" ? startApplicationFlow() : goTo(s))}
          />
        );
      case "my-documents":
        return <MyDocuments />;
      case "consent":
        return <ConsentManagement applications={applications} />;
      case "data-governance":
        return <DataGovernance />;
      case "data-access-history":
        return <DataAccessHistory applications={applications} />;
      case "notifications":
        return <NotificationCenter onGoTo={goTo} applications={applications} />;
      case "help":
        return <HelpCenter />;
      case "settings":
        return <CitizenProfile user={user} />;
      case "profile":
        return <CitizenProfile user={user} />;
      default:
        return <DashboardHome onGoTo={goTo} user={user} applications={applications} />;
    }
  }

  const previewNotifs = applications.slice(0, 3).map((app) => ({
    title: `${app.status.replace(/_/g, " ")} — ${app.id}`,
    time: new Date(app.updatedAt).toLocaleDateString("en-IN"),
    type: app.status === "SUBMITTED" ? ("success" as const) : ("info" as const),
  }));

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#F5F8FC", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Logout confirmation modal ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20">
          <div className="bg-white rounded-2xl border shadow-2xl max-w-sm w-full overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
            <div className="px-6 py-5 border-b" style={{ borderColor: "#F1F5F9" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "#FEF2F2" }}>
                <IcLogout size={18} />
              </div>
              <h2 className="text-base font-semibold" style={{ color: "#0F172A" }}>Sign out of eSamanvaya?</h2>
              <p className="text-sm mt-1.5" style={{ color: "#64748B" }}>
                Your active session will be ended. Any unsaved changes may be lost. You can sign back in at any time.
              </p>
            </div>
            <div className="flex gap-3 px-6 py-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:bg-slate-50"
                style={{ borderColor: "#E2E8F0", color: "#64748B" }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutModal(false); onLogout(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: "#DC2626" }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Topbar ── */}
      <header
        className="flex-shrink-0 h-14 bg-white border-b flex items-center px-3 gap-2 z-30"
        style={{ borderColor: "#E2E8F0" }}
      >
        {/* Hamburger */}
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              setMobileDrawer(!mobileDrawer);
            } else {
              setSidebarOpen(!sidebarOpen);
            }
          }}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100 flex-shrink-0"
          style={{ color: "#475569" }}
          aria-label="Toggle sidebar"
        >
          <IcMenu />
        </button>

        {/* Breadcrumb / page title (desktop) */}
        <div className="hidden md:flex items-center gap-1.5 ml-1 text-sm" style={{ color: "#94A3B8" }}>
          <span>eSamanvaya</span>
          <IcChevronRight size={13} />
          <span style={{ color: "#0F172A", fontWeight: 500 }}>
            {navGroups.flatMap((g) => g.items).find((i) => i.id === active)?.label ?? "Dashboard"}
          </span>
        </div>

        <div className="flex-1" />

        {/* Right cluster */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); setProfileOpen(false); setLangOpen(false); }}
              className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
              style={{ color: "#475569" }}
              aria-label="Notifications"
            >
              <IcBell />
              {previewNotifs.length > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: "#DC2626" }}
                />
              )}
            </button>
            {notifOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-xl border z-50 overflow-hidden"
                style={{ borderColor: "#E2E8F0" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                  <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Notifications</span>
                  <button
                    onClick={() => { setActive("notifications"); setNotifOpen(false); }}
                    className="text-xs font-medium"
                    style={{ color: "#1D4ED8" }}
                  >
                    See all
                  </button>
                </div>
                <div>
                  {previewNotifs.length === 0 && (
                    <div className="px-4 py-6 text-center text-xs" style={{ color: "#94A3B8" }}>No notifications yet</div>
                  )}
                  {previewNotifs.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 border-b last:border-0 hover:bg-slate-50 transition-colors"
                      style={{ borderColor: "#F8FAFC" }}
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background:
                            n.type === "success" ? "#0D9488" :
                            n.type === "warning" ? "#D97706" : "#1D4ED8",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate" style={{ color: "#0F172A" }}>{n.title}</div>
                        <div className="text-xs" style={{ color: "#94A3B8" }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); setNotifOpen(false); setProfileOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:bg-slate-50"
              style={{ borderColor: "#E2E8F0", color: "#475569", background: "white" }}
            >
              <IcGlobe size={13} />
              {lang}
            </button>
            {langOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border py-1 z-50"
                style={{ borderColor: "#E2E8F0" }}
                onClick={(e) => e.stopPropagation()}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l.slice(0, 2).toUpperCase()); setLangOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                    style={{ color: "#334155" }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); setNotifOpen(false); setLangOpen(false); }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border transition-colors hover:bg-slate-50"
              style={{ borderColor: "#E2E8F0", background: "white" }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "#1D4ED8" }}
              >
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold leading-none" style={{ color: "#0F172A" }}>{displayName.split(" ").slice(0, 2).join(" ")}</div>
                <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Citizen</div>
              </div>
            </button>
            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border py-1 z-50 overflow-hidden"
                style={{ borderColor: "#E2E8F0" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                  <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>{displayName}</div>
                  <div className="text-xs" style={{ color: "#64748B" }}>{citizenId}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span className="text-xs font-medium" style={{ color: "#0D9488" }}>Verified</span>
                  </div>
                </div>
                {([
                  { id: "profile", label: "My Profile", icon: <IcUser size={14} /> },
                  { id: "settings", label: "Settings", icon: <IcSettings size={14} /> },
                  { id: "help", label: "Help & Support", icon: <IcHelp size={14} /> },
                ] as { id: SectionId; label: string; icon: React.ReactNode }[]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActive(item.id); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                    style={{ color: "#334155" }}
                  >
                    <span style={{ color: "#94A3B8" }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                <div className="border-t mt-1" style={{ borderColor: "#F1F5F9" }}>
                  <button
                    onClick={() => { setProfileOpen(false); setShowLogoutModal(true); }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-red-50 transition-colors"
                    style={{ color: "#DC2626" }}
                  >
                    <IcLogout size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Desktop Sidebar ── */}
        <aside
          className="hidden md:flex flex-col flex-shrink-0 bg-white border-r transition-all duration-200 overflow-hidden"
          style={{
            width: sidebarOpen ? "220px" : "56px",
            borderColor: "#E2E8F0",
          }}
        >
          <SidebarContent
            collapsed={!sidebarOpen}
            active={active}
            onSelect={(id) => setActive(id)}
            onLogout={() => setShowLogoutModal(true)}
            displayName={displayName}
            citizenId={citizenId}
            initials={initials}
            navGroups={navGroups}
          />
        </aside>

        {/* ── Mobile Drawer Overlay ── */}
        {mobileDrawer && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Scrim */}
            <button
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileDrawer(false)}
              aria-label="Close sidebar"
            />
            {/* Drawer */}
            <div
              className="relative flex flex-col bg-white h-full shadow-xl"
              style={{ width: "240px" }}
            >
              <button
                onClick={() => setMobileDrawer(false)}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100"
                style={{ color: "#64748B" }}
              >
                <IcX size={16} />
              </button>
              <SidebarContent
                collapsed={false}
                active={active}
                onSelect={(id) => { setActive(id); setMobileDrawer(false); }}
                onLogout={() => setShowLogoutModal(true)}
                displayName={displayName}
                citizenId={citizenId}
                initials={initials}
                navGroups={navGroups}
              />
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
