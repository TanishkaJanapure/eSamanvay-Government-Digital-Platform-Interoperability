import {
  IcSearch, IcFile, IcFolder, IcShield, IcCheck,
  IcClock, IcActivity, IcArrowRight, IcLock,
} from "./Icons";
import { EBC_SCHEME } from "../data/scheme";
import type { UserProfile } from "../services/authService";
import { getCitizenId } from "../services/authService";
import {
  getApplicationSummaryCounts,
  getStatusDisplay,
  type ScholarshipApplication,
} from "../services/applicationStore";
import { isFullyVerified } from "../services/esamanvayApi";

interface DashboardHomeProps {
  onGoTo: (section: string) => void;
  user: UserProfile;
  applications: ScholarshipApplication[];
}

export default function DashboardHome({ onGoTo, user, applications }: DashboardHomeProps) {
  const firstName = user.name.split(" ")[0];
  const citizenId = getCitizenId(user.id);
  const counts = getApplicationSummaryCounts(user.id);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const summaryCards = [
    { label: "Draft", count: counts.Draft, sub: "Incomplete applications", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0", dot: "#94A3B8" },
    { label: "Submitted", count: counts.Submitted, sub: "Awaiting department action", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE", dot: "#3B82F6" },
    { label: "Under Verification", count: counts["Under Verification"], sub: "Verification in progress", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B" },
    { label: "Completed", count: counts.Completed, sub: "Approved this year", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", dot: "#14B8A6" },
  ];

  const latestApp = applications[0];
  const verificationLabel = latestApp?.verificationResult
    ? latestApp.verificationResult.overallStatus
    : latestApp
      ? getStatusDisplay(latestApp.status).label
      : "No active verification";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
          Welcome, {firstName}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          {today} &nbsp;·&nbsp; {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "Apply for EBC Scholarship", sub: EBC_SCHEME.shortName, icon: <IcSearch size={20} />, iconBg: "#EFF6FF", iconColor: "#1D4ED8", action: () => onGoTo("apply-flow") },
          { label: "My Applications", sub: applications.length === 0 ? "No applications yet" : `${applications.length} application${applications.length !== 1 ? "s" : ""}`, icon: <IcFolder size={20} />, iconBg: "#F5F3FF", iconColor: "#7C3AED", action: () => onGoTo("my-applications") },
        ].map((qa) => (
          <button
            key={qa.label}
            onClick={qa.action}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border text-left transition-all hover:shadow-sm hover:border-slate-300 group"
            style={{ borderColor: "#E2E8F0" }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105" style={{ background: qa.iconBg, color: qa.iconColor }}>
              {qa.icon}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>{qa.label}</div>
              <div className="text-xs mt-0.5 truncate" style={{ color: "#94A3B8" }}>{qa.sub}</div>
            </div>
            <IcArrowRight size={14} className="ml-auto flex-shrink-0 opacity-30 group-hover:opacity-60 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Current verification status */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>Current Verification</span>
          {latestApp && (
            <span className="text-xs font-mono" style={{ color: "#1D4ED8" }}>{latestApp.id}</span>
          )}
        </div>
        {latestApp?.verificationResult ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {[
              { label: "DigiLocker", ok: latestApp.verificationResult.digiLockerVerified },
              { label: "Income", ok: latestApp.verificationResult.incomeVerified },
              { label: "Education", ok: latestApp.verificationResult.educationVerified },
              { label: "Overall", ok: isFullyVerified(latestApp.verificationResult) },
            ].map((v) => (
              <div key={v.label} className="text-center p-3 rounded-lg" style={{ background: v.ok ? "#F0FDFA" : "#FEF2F2" }}>
                <div className="text-xs font-medium" style={{ color: "#64748B" }}>{v.label}</div>
                <div className="text-sm font-bold mt-1" style={{ color: v.ok ? "#0D9488" : "#DC2626" }}>
                  {v.ok ? "VERIFIED" : "NOT VERIFIED"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "#64748B" }}>
            {applications.length === 0
              ? "No verification yet. Start an EBC scholarship application to begin."
              : `Status: ${verificationLabel}`}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: "#0F172A" }}>My Applications</h2>
          <button onClick={() => onGoTo("my-applications")} className="text-xs font-medium flex items-center gap-1" style={{ color: "#1D4ED8" }}>
            View all <IcArrowRight size={12} />
          </button>
        </div>
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: "#E2E8F0" }}>
            <IcFile size={28} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-sm" style={{ color: "#334155" }}>No applications yet</p>
            <p className="text-xs mt-1 mb-4" style={{ color: "#94A3B8" }}>
              Apply for the EBC scholarship scheme to get started.
            </p>
            <button
              onClick={() => onGoTo("apply-flow")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#1D4ED8" }}
            >
              Apply for EBC Scholarship
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {summaryCards.map((c) => (
              <button
                key={c.label}
                onClick={() => onGoTo("my-applications")}
                className="p-4 rounded-xl border text-left transition-all hover:shadow-sm"
                style={{ background: c.bg, borderColor: c.border }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.dot }} />
                  <span className="text-xs font-medium" style={{ color: c.color }}>{c.label}</span>
                </div>
                <div className="text-2xl font-bold mb-0.5" style={{ color: "#0F172A" }}>{c.count}</div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>{c.sub}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F1F5F9" }}>
            <div className="flex items-center gap-2">
              <IcActivity size={15} className="text-slate-400" />
              <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Recent Activity</span>
            </div>
          </div>
          {applications.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm" style={{ color: "#94A3B8" }}>
              No previous applications
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
              {applications.slice(0, 4).map((app) => {
                const display = getStatusDisplay(app.status);
                return (
                  <div key={app.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: display.bg, color: display.color }}>
                      {app.status === "SUBMITTED" ? <IcCheck size={15} /> : <IcClock size={15} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate" style={{ color: "#0F172A" }}>{EBC_SCHEME.shortName}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0" style={{ background: display.bg, color: display.color }}>
                          {display.label}
                        </span>
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                        {app.department} &nbsp;·&nbsp; {app.id}
                      </div>
                    </div>
                    <span className="text-xs flex-shrink-0 hidden sm:block" style={{ color: "#CBD5E1" }}>
                      {new Date(app.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "#F1F5F9" }}>
            <IcShield size={15} className="text-teal-600" />
            <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Profile & Consent</span>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: "Citizen ID", sub: citizenId, ok: true },
              { label: "Mobile", sub: user.mobile, ok: true },
              { label: "Active Consents", sub: `${applications.filter((a) => a.consent).length} application consent(s)`, ok: true },
              { label: "Available Scheme", sub: EBC_SCHEME.shortName, ok: true },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#F0FDFA" }}>
                  <IcLock size={13} className="text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: "#0F172A" }}>{row.label}</div>
                  <div className="text-xs mt-0.5 truncate" style={{ color: "#94A3B8" }}>{row.sub}</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#14B8A6" }} />
              </div>
            ))}
            <button
              onClick={() => onGoTo("consent")}
              className="w-full mt-2 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-slate-50"
              style={{ borderColor: "#E2E8F0", color: "#1D4ED8" }}
            >
              Manage Consent & Data Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
