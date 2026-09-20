import type { ApplicationStatus, ScholarshipApplication } from "../../services/applicationStore";
import { getStatusDisplay } from "../../services/applicationStore";

const APPS_KEY = "esamanvay_applications";

export function loadAllCitizenApplications(): ScholarshipApplication[] {
  try {
    const raw = localStorage.getItem(APPS_KEY);
    if (raw) return JSON.parse(raw) as ScholarshipApplication[];
  } catch {
    /* ignore */
  }
  return [];
}

/** Applications visible to officers (citizen flow started beyond an empty draft). */
export function getOfficerVisibleApplications(): ScholarshipApplication[] {
  return loadAllCitizenApplications()
    .filter((a) => a.status !== "DRAFT")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export type OfficerAppStatus =
  | "draft"
  | "submitted"
  | "verified"
  | "not-verified"
  | "scrutiny"
  | "dept-verify"
  | "approved"
  | "disbursed"
  | "blocked";

export interface OfficerMonitoredApp {
  id: string;
  citizen: string;
  citizenId: string;
  service: string;
  department: string;
  stage: string;
  status: OfficerAppStatus;
  submittedAt: string;
  lastUpdated: string;
  processingDays: number;
  flagged?: string;
  digilockerId: string;
  incomeCertificateNumber: string;
  seatNumber: string;
  verificationStatus: string;
  applicationStatus: string;
  rawStatus: ApplicationStatus;
  source: ScholarshipApplication;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(iso?: string): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function processingDays(iso?: string): number {
  if (!iso) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}

function studentName(app: ScholarshipApplication): string {
  return (
    app.personalInfo?.name ??
    app.verificationResult?.studentName ??
    app.verificationResult?.digiLocker?.name ??
    "—"
  );
}

function verificationStatusLabel(app: ScholarshipApplication): string {
  if (app.verificationResult?.overallStatus) return app.verificationResult.overallStatus;
  if (app.status === "VERIFICATION_IN_PROGRESS") return "In Progress";
  if (app.status === "CONSENTED") return "Pending";
  return "—";
}

function mapOfficerStatus(app: ScholarshipApplication): { status: OfficerAppStatus; stage: string; flagged?: string } {
  switch (app.status) {
    case "CONSENTED":
      return { status: "submitted", stage: "Consent Provided" };
    case "VERIFICATION_IN_PROGRESS":
      return { status: "dept-verify", stage: "eSamanvaya Verification" };
    case "VERIFIED":
      return { status: "verified", stage: "Verified" };
    case "NOT_VERIFIED":
      return {
        status: "blocked",
        stage: "Verification Failed",
        flagged: app.verificationResult
          ? `Overall: ${app.verificationResult.overallStatus} · DigiLocker: ${app.verificationResult.digiLockerVerified ? "VERIFIED" : "NOT VERIFIED"} · Income: ${app.verificationResult.incomeVerified ? "VERIFIED" : "NOT VERIFIED"} · Education: ${app.verificationResult.educationVerified ? "VERIFIED" : "NOT VERIFIED"}`
          : "Verification did not complete successfully",
      };
    case "SUBMITTED":
      return { status: "scrutiny", stage: "Submitted to MahaDBT" };
    default:
      return { status: "submitted", stage: getStatusDisplay(app.status).label };
  }
}

export function mapToMonitoredApp(app: ScholarshipApplication): OfficerMonitoredApp {
  const mapped = mapOfficerStatus(app);
  const ids = app.identifiers;
  const vr = app.verificationResult;

  return {
    id: app.id,
    citizen: studentName(app),
    citizenId: app.userId,
    service: app.schemeName,
    department: app.department,
    stage: mapped.stage,
    status: mapped.status,
    submittedAt: formatDate(app.submittedAt ?? app.consent?.grantedAt ?? app.createdAt),
    lastUpdated: formatRelative(app.updatedAt),
    processingDays: processingDays(app.submittedAt ?? app.createdAt),
    flagged: mapped.flagged,
    digilockerId: ids?.digilockerId ?? vr?.digiLocker?.digilockerid ?? "—",
    incomeCertificateNumber: ids?.certificateNumber ?? vr?.income?.certificateNumber ?? "—",
    seatNumber: ids?.seatNumber ?? vr?.education?.seatNumber ?? "—",
    verificationStatus: verificationStatusLabel(app),
    applicationStatus: getStatusDisplay(app.status).label,
    rawStatus: app.status,
    source: app,
  };
}

export interface OfficerTimelineEvent {
  stage: string;
  description: string;
  status: "done" | "active" | "pending" | "blocked";
  timestamp?: string;
  actor?: string;
}

export function buildOfficerTimeline(app: ScholarshipApplication): OfficerTimelineEvent[] {
  const fmt = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
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

  const stageDone = (stageIndex: number) => idx > stageIndex;
  const stageActive = (stageIndex: number) => idx === stageIndex;

  const vr = app.verificationResult;
  const verifiedDesc = vr
    ? `Overall: ${vr.overallStatus} · DigiLocker: ${vr.digiLockerVerified ? "VERIFIED" : "NOT VERIFIED"} · Income: ${vr.incomeVerified ? "VERIFIED" : "NOT VERIFIED"} · Education: ${vr.educationVerified ? "VERIFIED" : "NOT VERIFIED"}`
    : "Awaiting eSamanvaya verification response.";

  const events: OfficerTimelineEvent[] = [
    {
      stage: "Application Started",
      description: "Eligibility responses and applicant details recorded in eSamanvaya.",
      status: stageDone(0) || app.status !== "DRAFT" ? "done" : "pending",
      timestamp: fmt(app.createdAt),
      actor: "Citizen",
    },
    {
      stage: "Consent Provided",
      description: "Citizen consent recorded for DigiLocker, Revenue, and Education data access.",
      status: app.consent ? "done" : stageActive(1) ? "active" : idx > 1 ? "done" : "pending",
      timestamp: app.consent ? fmt(app.consent.grantedAt) : undefined,
      actor: "eSamanvaya Platform",
    },
    {
      stage: "Verification In Progress",
      description: "eSamanvaya orchestrator verifying interoperability services.",
      status:
        app.status === "VERIFICATION_IN_PROGRESS"
          ? "active"
          : idx > 2
            ? "done"
            : "pending",
      timestamp: app.status === "VERIFICATION_IN_PROGRESS" ? fmt(app.updatedAt) : undefined,
      actor: "eSamanvaya Orchestrator",
    },
    {
      stage: app.status === "NOT_VERIFIED" ? "Verification Failed" : "Verified",
      description: verifiedDesc,
      status:
        app.status === "NOT_VERIFIED"
          ? "blocked"
          : app.status === "VERIFIED" || vr?.overallStatus === "VERIFIED"
            ? "done"
            : app.status === "VERIFICATION_IN_PROGRESS"
              ? "active"
              : "pending",
      timestamp: vr ? fmt(app.updatedAt) : undefined,
      actor: "DigiLocker · Revenue · Education",
    },
    {
      stage: "Submitted to MahaDBT",
      description: "Application submitted to MahaDBT for department processing.",
      status: app.status === "SUBMITTED" ? "done" : app.status === "VERIFIED" ? "active" : "pending",
      timestamp: fmt(app.submittedAt),
      actor: app.department,
    },
  ];

  return events;
}

export function officerApplicationCounts() {
  const apps = getOfficerVisibleApplications();
  return {
    total: apps.length,
    inProgress: apps.filter((a) =>
      ["CONSENTED", "VERIFICATION_IN_PROGRESS", "VERIFIED", "NOT_VERIFIED"].includes(a.status),
    ).length,
    completed: apps.filter((a) => a.status === "SUBMITTED").length,
    blocked: apps.filter((a) => a.status === "NOT_VERIFIED").length,
  };
}

export interface OfficerDeptBar {
  dept: string;
  total: number;
  done: number;
}

export function buildDeptBars(): OfficerDeptBar[] {
  const apps = getOfficerVisibleApplications();
  const map = new Map<string, { total: number; done: number }>();
  for (const app of apps) {
    const dept = app.department.includes("/")
      ? app.department.split("/")[0].trim()
      : app.department;
    const cur = map.get(dept) ?? { total: 0, done: 0 };
    cur.total += 1;
    if (app.status === "SUBMITTED") cur.done += 1;
    map.set(dept, cur);
  }
  return [...map.entries()].map(([dept, counts]) => ({ dept, ...counts }));
}

export interface OfficerActivity {
  time: string;
  system: string;
  action: string;
  appId?: string;
  status: "ok" | "warn" | "err";
  sortKey: number;
}

export function buildRecentActivities(): OfficerActivity[] {
  const apps = getOfficerVisibleApplications();
  const items: OfficerActivity[] = [];

  for (const app of apps) {
    const name = studentName(app);
    if (app.consent?.grantedAt) {
      items.push({
        time: new Date(app.consent.grantedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        system: "Consent Service",
        action: `${name} granted consent for ${app.schemeName}`,
        appId: app.id,
        status: "ok",
        sortKey: new Date(app.consent.grantedAt).getTime(),
      });
    }
    if (app.verificationResult) {
      const vr = app.verificationResult;
      items.push({
        time: new Date(app.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        system: "eSamanvaya Orchestrator",
        action: `Verification ${vr.overallStatus} · DigiLocker: ${vr.digiLockerVerified ? "VERIFIED" : "NOT VERIFIED"} · Income: ${vr.incomeVerified ? "VERIFIED" : "NOT VERIFIED"} · Education: ${vr.educationVerified ? "VERIFIED" : "NOT VERIFIED"}`,
        appId: app.id,
        status: vr.overallStatus === "VERIFIED" ? "ok" : "warn",
        sortKey: new Date(app.updatedAt).getTime(),
      });
    }
    if (app.submittedAt) {
      items.push({
        time: new Date(app.submittedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        system: "Submission Engine",
        action: `Application ${app.id} submitted to MahaDBT (${app.department})`,
        appId: app.id,
        status: "ok",
        sortKey: new Date(app.submittedAt).getTime(),
      });
    }
  }

  return items.sort((a, b) => b.sortKey - a.sortKey).slice(0, 12);
}

export interface OfficerAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorType: "system" | "officer" | "citizen";
  service: string;
  action: "data-fetch" | "verify" | "submit" | "consent";
  appId: string;
  status: "success" | "failure" | "partial";
  requestSummary: string;
  responseSummary: string;
  details?: string;
}

export function buildAuditLogsFromApplications(): OfficerAuditLog[] {
  const apps = getOfficerVisibleApplications();
  const logs: OfficerAuditLog[] = [];
  let n = 0;

  for (const app of apps) {
    const name = studentName(app);
    const ts = (iso: string) =>
      new Date(iso).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).replace(",", "");

    if (app.consent?.grantedAt) {
      logs.push({
        id: `log-${++n}`,
        timestamp: ts(app.consent.grantedAt),
        actor: name,
        actorType: "citizen",
        service: "Internal Consent Store",
        action: "consent",
        appId: app.id,
        status: "success",
        requestSummary: `Consent for DigiLocker, Revenue, Education — application ${app.id}`,
        responseSummary: `Scopes: ${app.consent.scopes.join("; ")}`,
      });
    }

    const ids = app.identifiers;
    if (ids?.digilockerId) {
      logs.push({
        id: `log-${++n}`,
        timestamp: ts(app.updatedAt),
        actor: "DigiLocker Sync",
        actorType: "system",
        service: "DigiLocker (NIC)",
        action: "data-fetch",
        appId: app.id,
        status: "success",
        requestSummary: `GET /documents — digilockerId=${ids.digilockerId}`,
        responseSummary: app.verificationResult?.digiLockerVerified ? "Identity documents verified" : "Pending verification",
      });
    }

    if (app.verificationResult) {
      const vr = app.verificationResult;
      logs.push({
        id: `log-${++n}`,
        timestamp: ts(app.updatedAt),
        actor: "eSamanvaya Orchestrator",
        actorType: "system",
        service: "eSamanvaya Verification API",
        action: "verify",
        appId: app.id,
        status: vr.overallStatus === "VERIFIED" ? "success" : "partial",
        requestSummary: `POST /verify — digilockerId=${ids?.digilockerId ?? "—"}, certificate=${ids?.certificateNumber ?? "—"}, seat=${ids?.seatNumber ?? "—"}`,
        responseSummary: `Overall: ${vr.overallStatus}; student: ${vr.studentName}`,
        details: `DigiLocker: ${vr.digiLockerVerified ? "VERIFIED" : "NOT VERIFIED"} · Income: ${vr.incomeVerified ? "VERIFIED" : "NOT VERIFIED"} · Education: ${vr.educationVerified ? "VERIFIED" : "NOT VERIFIED"}`,
      });
    }

    if (app.submittedAt) {
      logs.push({
        id: `log-${++n}`,
        timestamp: ts(app.submittedAt),
        actor: "Submission Engine",
        actorType: "system",
        service: "MahaDBT Submission API",
        action: "submit",
        appId: app.id,
        status: "success",
        requestSummary: `POST /applications — scheme: ${app.schemeName}`,
        responseSummary: `Application ${app.id} received for processing`,
      });
    }
  }

  return logs.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

export interface OfficerQualityIssue {
  id: string;
  appId: string;
  citizen: string;
  field: string;
  source: string;
  issueType: "missing" | "conflict" | "validation" | "timeout";
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  detectedAt: string;
  status: "open" | "resolved" | "escalated";
  resolution?: string;
}

export function buildQualityIssuesFromApplications(): OfficerQualityIssue[] {
  const apps = getOfficerVisibleApplications();
  const issues: OfficerQualityIssue[] = [];
  let n = 0;

  for (const app of apps) {
    const vr = app.verificationResult;
    if (!vr) continue;
    const citizen = studentName(app);
    const detectedAt = formatDate(app.updatedAt);

    if (!vr.digiLockerVerified) {
      issues.push({
        id: `DQ-${++n}`,
        appId: app.id,
        citizen,
        field: "digilocker_verification",
        source: "DigiLocker (NIC)",
        issueType: "validation",
        severity: "high",
        description: `DigiLocker verification failed for ID ${app.identifiers?.digilockerId ?? vr.digiLocker.digilockerid}.`,
        detectedAt,
        status: "open",
      });
    }
    if (!vr.incomeVerified) {
      issues.push({
        id: `DQ-${++n}`,
        appId: app.id,
        citizen,
        field: "income_certificate",
        source: "Revenue Department",
        issueType: "validation",
        severity: "high",
        description: `Income certificate ${app.identifiers?.certificateNumber ?? vr.income.certificateNumber} could not be verified.`,
        detectedAt,
        status: "open",
      });
    }
    if (!vr.educationVerified) {
      issues.push({
        id: `DQ-${++n}`,
        appId: app.id,
        citizen,
        field: "education_record",
        source: "Education Board",
        issueType: "validation",
        severity: "medium",
        description: `Education record for seat ${app.identifiers?.seatNumber ?? vr.education.seatNumber} could not be verified.`,
        detectedAt,
        status: "open",
      });
    }
    if (app.status === "NOT_VERIFIED") {
      issues.push({
        id: `DQ-${++n}`,
        appId: app.id,
        citizen,
        field: "overall_verification",
        source: "eSamanvaya Orchestrator",
        issueType: "validation",
        severity: "critical",
        description: `Overall verification status: ${vr.overallStatus}. Application cannot proceed until resolved.`,
        detectedAt,
        status: "escalated",
      });
    }
  }

  return issues;
}
