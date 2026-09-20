import { useState } from "react";
import { IcCheck, IcClock, IcInfo, IcArrowRight, IcShield } from "./Icons";
import { EBC_SCHEME } from "../data/scheme";
import {
  getStatusDisplay,
  type ScholarshipApplication,
  type ApplicationStatus,
} from "../services/applicationStore";
import { isFullyVerified } from "../services/esamanvayApi";

interface ApplicationTrackerProps {
  applications: ScholarshipApplication[];
  appId?: string;
  onGoTo?: (section: string) => void;
}

type TimelineStatus = "done" | "active" | "upcoming";

interface TimelineStage {
  id: string;
  label: string;
  description: string;
  status: TimelineStatus;
  date?: string;
  dept?: string;
}

function buildTimeline(app: ScholarshipApplication): TimelineStage[] {
  const fmt = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : undefined;

  const statusOrder: ApplicationStatus[] = [
    "DRAFT",
    "CONSENTED",
    "VERIFICATION_IN_PROGRESS",
    "VERIFIED",
    "NOT_VERIFIED",
    "SUBMITTED",
  ];
  const idx = statusOrder.indexOf(app.status);

  function stageStatus(stageIndex: number): TimelineStatus {
    if (app.status === "NOT_VERIFIED" && stageIndex === 3) return "active";
    if (idx > stageIndex) return "done";
    if (idx === stageIndex) return "active";
    return "upcoming";
  }

  return [
    {
      id: "draft",
      label: "Application Started",
      description: "Eligibility questions and personal details recorded.",
      status: stageStatus(0),
      date: fmt(app.createdAt),
      dept: "eSamanvaya Platform",
    },
    {
      id: "consent",
      label: "Consent Provided",
      description: "Citizen consent recorded for DigiLocker, Revenue, and Education data access.",
      status: stageStatus(1),
      date: app.consent ? fmt(app.consent.grantedAt) : undefined,
      dept: "eSamanvaya Platform",
    },
    {
      id: "verification",
      label: "Verification In Progress",
      description: "eSamanvaya orchestrator verifying data across interoperability services.",
      status: stageStatus(2),
      date: app.status === "VERIFICATION_IN_PROGRESS" ? fmt(app.updatedAt) : undefined,
      dept: "eSamanvaya Orchestrator (:8091)",
    },
    {
      id: "verified",
      label: app.status === "NOT_VERIFIED" ? "Verification Failed" : "Verified",
      description:
        app.verificationResult
          ? `Overall: ${app.verificationResult.overallStatus} · DigiLocker: ${app.verificationResult.digiLockerVerified ? "VERIFIED" : "NOT VERIFIED"} · Income: ${app.verificationResult.incomeVerified ? "VERIFIED" : "NOT VERIFIED"} · Education: ${app.verificationResult.educationVerified ? "VERIFIED" : "NOT VERIFIED"}`
          : "Awaiting verification response from backend services.",
      status: stageStatus(3),
      date: app.verificationResult ? fmt(app.updatedAt) : undefined,
      dept: "DigiLocker · Revenue · Education",
    },
    {
      id: "submitted",
      label: "Submitted",
      description: "Application submitted to MahaDBT for department processing.",
      status: stageStatus(5),
      date: fmt(app.submittedAt),
      dept: EBC_SCHEME.department,
    },
  ];
}

type FilterStatus = "All" | ApplicationStatus;

function ApiStatusBadge() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "#F0FDFA", borderColor: "#99F6E4" }}>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ background: "#0D9488" }} />
        <span className="text-xs font-semibold" style={{ color: "#0D9488" }}>eSamanvaya Orchestrator</span>
      </div>
      <div className="h-3 w-px" style={{ background: "#99F6E4" }} />
      <span className="text-xs" style={{ color: "#0F766E" }}>localhost:8091</span>
      <div className="h-3 w-px" style={{ background: "#99F6E4" }} />
      <IcShield size={12} stroke="#0D9488" />
      <span className="text-xs" style={{ color: "#0D9488" }}>Development MVP</span>
    </div>
  );
}

function TrackerDetail({ app, onBack }: { app: ScholarshipApplication; onBack: () => void }) {
  const timeline = buildTimeline(app);
  const display = getStatusDisplay(app.status);
  const currentStage = timeline.find((s) => s.status === "active") ?? timeline[timeline.length - 1];
  const currentIdx = timeline.indexOf(currentStage);
  const nextStage = timeline[currentIdx + 1];

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-medium hover:underline" style={{ color: "#64748B" }}>
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        All Applications
      </button>

      <ApiStatusBadge />

      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base" style={{ color: "#0F172A" }}>{EBC_SCHEME.shortName}</div>
            <div className="text-sm mt-0.5" style={{ color: "#64748B" }}>{app.department}</div>
            <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: "#94A3B8" }}>
              <span>App ID: <span className="font-mono font-semibold" style={{ color: "#1D4ED8" }}>{app.id}</span></span>
              {app.submittedAt && (
                <>
                  <span>·</span>
                  <span>Submitted: {new Date(app.submittedAt).toLocaleDateString("en-IN")}</span>
                </>
              )}
              <span>·</span>
              <span>Updated: {new Date(app.updatedAt).toLocaleDateString("en-IN")}</span>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: display.bg, color: display.color }}>
            {display.label}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "#94A3B8" }}>
            <span>Overall Progress</span>
            <span style={{ color: display.color, fontWeight: 600 }}>{display.progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${display.progress}%`, background: display.color }} />
          </div>
        </div>
      </div>

      {app.verificationResult && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Student Name", value: app.verificationResult.studentName },
            { label: "Income", value: `₹${app.verificationResult.income.annualIncome.toLocaleString("en-IN")}` },
            { label: "District", value: app.verificationResult.income.district },
            { label: "Board", value: app.verificationResult.education.board },
            { label: "Percentage", value: `${app.verificationResult.education.percentage}%` },
            { label: "Result", value: app.verificationResult.education.resultStatus },
            { label: "Certificate No.", value: app.verificationResult.income.certificateNumber },
            { label: "Overall", value: app.verificationResult.overallStatus, highlight: true },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border px-4 py-3" style={{ borderColor: "#E2E8F0" }}>
              <div className="text-xs" style={{ color: "#94A3B8" }}>{item.label}</div>
              <div className="text-sm font-semibold mt-1" style={{ color: item.highlight && !isFullyVerified(app.verificationResult!) ? "#D97706" : "#0F172A" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: display.color }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>Current Status</span>
          </div>
          <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>{currentStage.label}</div>
          <div className="text-xs mt-1 leading-relaxed" style={{ color: "#64748B" }}>{currentStage.description}</div>
        </div>
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center gap-2 mb-2">
            <IcArrowRight size={12} stroke="#94A3B8" />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>Expected Next Step</span>
          </div>
          {nextStage ? (
            <>
              <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>{nextStage.label}</div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: "#64748B" }}>{nextStage.description}</div>
            </>
          ) : (
            <div className="text-sm" style={{ color: "#64748B" }}>Application process complete.</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9" }}>
          <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Application Timeline</span>
          <span className="text-xs" style={{ color: "#94A3B8" }}>
            {timeline.filter((s) => s.status === "done").length} of {timeline.length} stages complete
          </span>
        </div>
        <div className="p-5 space-y-0">
          {timeline.map((stage, i) => (
            <div key={stage.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                  style={{
                    background: stage.status === "done" ? "#0D9488" : stage.status === "active" ? "#1D4ED8" : "#F1F5F9",
                    border: stage.status === "active" ? "3px solid #BFDBFE" : "none",
                  }}
                >
                  {stage.status === "done"
                    ? <IcCheck size={15} stroke="white" />
                    : stage.status === "active"
                      ? <div className="w-3 h-3 rounded-full bg-white" />
                      : <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#CBD5E1" }} />}
                </div>
                {i < timeline.length - 1 && (
                  <div className="w-px flex-1 my-1" style={{ background: stage.status === "done" ? "#99F6E4" : "#F1F5F9", minHeight: "20px" }} />
                )}
              </div>
              <div className="pb-5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: stage.status === "upcoming" ? "#94A3B8" : "#0F172A" }}>
                    {stage.label}
                  </span>
                  {stage.date && <span className="text-xs flex-shrink-0" style={{ color: "#CBD5E1" }}>{stage.date}</span>}
                </div>
                <div className="text-xs mt-1 leading-relaxed" style={{ color: stage.status === "upcoming" ? "#CBD5E1" : "#64748B" }}>
                  {stage.description}
                </div>
                {stage.dept && stage.status !== "upcoming" && (
                  <div className="text-xs mt-1" style={{ color: "#94A3B8" }}>{stage.dept}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs" style={{ background: "#FFFBEB", borderColor: "#FDE68A", color: "#78350F" }}>
        <IcInfo size={14} className="flex-shrink-0 mt-0.5" />
        Timeline reflects your application status. Verification results come from the live eSamanvaya backend — not hardcoded.
      </div>
    </div>
  );
}

export default function ApplicationTracker({ applications, appId, onGoTo }: ApplicationTrackerProps) {
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(appId ?? null);

  const selected = selectedId ? applications.find((a) => a.id === selectedId) : null;

  const filtered = applications.filter((a) => {
    const matchF = filter === "All" || a.status === filter;
    const matchS =
      !search ||
      EBC_SCHEME.shortName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  if (selected) {
    return <TrackerDetail app={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>My Applications</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Track your EBC scholarship application</p>
        </div>
        <button
          onClick={() => onGoTo?.("apply-flow")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#1D4ED8" }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 4.5v15M4.5 12h15" />
          </svg>
          New Application
        </button>
      </div>

      <ApiStatusBadge />

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: "#E2E8F0" }}>
          <IcClock size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium text-sm" style={{ color: "#334155" }}>No applications yet</p>
          <p className="text-xs mt-1 mb-4" style={{ color: "#94A3B8" }}>
            Start your EBC scholarship application to track progress here.
          </p>
          <button
            onClick={() => onGoTo?.("apply-flow")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#1D4ED8" }}
          >
            Apply for EBC Scholarship
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border bg-white" style={{ borderColor: "#E2E8F0" }}>
              <svg width="15" height="15" fill="none" stroke="#94A3B8" strokeWidth="1.75" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by application ID…"
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: "#0F172A" }}
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["All", "DRAFT", "CONSENTED", "VERIFICATION_IN_PROGRESS", "VERIFIED", "NOT_VERIFIED", "SUBMITTED"] as FilterStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                  style={{
                    background: filter === s ? "#0F172A" : "white",
                    color: filter === s ? "white" : "#64748B",
                    borderColor: filter === s ? "#0F172A" : "#E2E8F0",
                  }}
                >
                  {s === "All" ? "All" : getStatusDisplay(s as ApplicationStatus).label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((app) => {
              const display = getStatusDisplay(app.status);
              return (
                <div key={app.id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-all" style={{ borderColor: "#E2E8F0" }}>
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>{EBC_SCHEME.shortName}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: display.bg, color: display.color }}>
                          {display.label}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: "#64748B" }}>{app.department}</div>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs" style={{ color: "#94A3B8" }}>
                        <span className="font-mono" style={{ color: "#1D4ED8" }}>{app.id}</span>
                        <span>·</span>
                        <span>Updated: {new Date(app.updatedAt).toLocaleDateString("en-IN")}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 max-w-48 h-1.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                          <div className="h-full rounded-full" style={{ width: `${display.progress}%`, background: display.color }} />
                        </div>
                        <span className="text-xs font-medium" style={{ color: display.color }}>{display.progress}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedId(app.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                      style={{ background: "#1D4ED8" }}
                    >
                      Track <IcArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
