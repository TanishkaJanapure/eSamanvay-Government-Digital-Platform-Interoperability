import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LanguagePage from "./pages/LanguagePage";
import Dashboard from "./pages/Dashboard";
import OfficerPortal from "./pages/OfficerPortal";
import OfficerLogin from "./pages/OfficerLogin";
import { AuthProvider, useAuth } from "./context/AuthContext";

type Page = "landing" | "login" | "register" | "language" | "dashboard" | "officer-login" | "officer";

function AppRoutes() {
  const { user, isAuthenticated, isLoading, logout, register } = useAuth();
  const [page, setPage] = useState<Page>("landing");
  const [language, setLanguage] = useState("en");
  const [pendingDashboard, setPendingDashboard] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && (page === "login" || page === "register")) {
      setPage(pendingDashboard ? "dashboard" : "language");
      setPendingDashboard(false);
    }
  }, [isAuthenticated, isLoading, page, pendingDashboard]);

  function handleNavigate(target: string, lang?: string) {
    if (lang) setLanguage(lang);
    if (target === "dashboard" && !isAuthenticated) {
      setPage("login");
      return;
    }
    setPage(target as Page);
  }

  function handleLogout() {
    logout();
    setPage("landing");
  }

  if (isLoading) {
    return (
      <div
        className="size-full flex items-center justify-center"
        style={{ background: "#F5F8FC", fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <div className="text-sm" style={{ color: "#64748B" }}>Loading eSamanvaya…</div>
      </div>
    );
  }

  return (
    <div className="size-full">
      {page === "landing" && <LandingPage onNavigate={handleNavigate} />}
      {page === "login" && (
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={() => setPendingDashboard(true)}
        />
      )}
      {page === "register" && (
        <RegisterPage
          onNavigate={handleNavigate}
          onRegister={async (data, password) => {
            const result = await register(data, password);
            if (result.ok) setPendingDashboard(true);
            return result;
          }}
        />
      )}
      {page === "language" && <LanguagePage onNavigate={handleNavigate} />}
      {page === "dashboard" && isAuthenticated && user && (
        <Dashboard
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          user={user}
          language={language}
        />
      )}
      {page === "dashboard" && !isAuthenticated && (
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={() => setPage("dashboard")}
        />
      )}
      {page === "officer-login" && <OfficerLogin onNavigate={handleNavigate} />}
      {page === "officer" && <OfficerPortal onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
