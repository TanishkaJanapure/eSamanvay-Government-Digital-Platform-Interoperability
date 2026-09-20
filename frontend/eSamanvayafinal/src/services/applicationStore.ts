import { EBC_SCHEME } from "../data/scheme";
import type { VerifyResponse } from "./esamanvayApi";

export type ApplicationStatus =
  | "DRAFT"
  | "CONSENTED"
  | "VERIFICATION_IN_PROGRESS"
  | "VERIFIED"
  | "NOT_VERIFIED"
  | "SUBMITTED";

export interface VerificationIdentifiers {
  digilockerId: string;
  certificateNumber: string;
  seatNumber: string;
}

export interface ConsentRecord {
  grantedAt: string;
  scopes: string[];
}

export interface ScholarshipApplication {
  id: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  department: string;
  status: ApplicationStatus;
  answers: Record<string, string>;
  personalInfo?: {
    name: string;
    dob: string;
    mobile: string;
    email: string;
    course: string;
    college: string;
    yearSemester: string;
  };
  identifiers?: VerificationIdentifiers;
  consent?: ConsentRecord;
  verificationResult?: VerifyResponse;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

const APPS_KEY = "esamanvay_applications";

function loadAll(): ScholarshipApplication[] {
  try {
    const raw = localStorage.getItem(APPS_KEY);
    if (raw) return JSON.parse(raw) as ScholarshipApplication[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveAll(apps: ScholarshipApplication[]): void {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

export function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `ESM${year}${seq}`;
}

export function getUserApplications(userId: string): ScholarshipApplication[] {
  return loadAll()
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getApplication(userId: string, appId: string): ScholarshipApplication | null {
  return loadAll().find((a) => a.userId === userId && a.id === appId) ?? null;
}

export function getDraftApplication(userId: string): ScholarshipApplication | null {
  return getUserApplications(userId).find((a) => a.status === "DRAFT") ?? null;
}

export function createDraftApplication(userId: string): ScholarshipApplication {
  const existing = getDraftApplication(userId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const app: ScholarshipApplication = {
    id: generateApplicationId(),
    userId,
    schemeId: EBC_SCHEME.id,
    schemeName: EBC_SCHEME.name,
    department: EBC_SCHEME.department,
    status: "DRAFT",
    answers: {},
    createdAt: now,
    updatedAt: now,
  };
  saveAll([...loadAll(), app]);
  return app;
}

export function upsertApplication(app: ScholarshipApplication): ScholarshipApplication {
  const apps = loadAll();
  const idx = apps.findIndex((a) => a.id === app.id && a.userId === app.userId);
  const updated = { ...app, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    apps[idx] = updated;
  } else {
    apps.push(updated);
  }
  saveAll(apps);
  return updated;
}

export function updateApplicationStatus(
  userId: string,
  appId: string,
  status: ApplicationStatus,
  extra?: Partial<ScholarshipApplication>,
): ScholarshipApplication | null {
  const app = getApplication(userId, appId);
  if (!app) return null;
  return upsertApplication({ ...app, ...extra, status });
}

/** Map eSamanvaya verify API overallStatus to stored application status. */
export function verificationStatusFromResult(result: VerifyResponse): "VERIFIED" | "NOT_VERIFIED" {
  return result.overallStatus === "VERIFIED" ? "VERIFIED" : "NOT_VERIFIED";
}

export function getStatusDisplay(status: ApplicationStatus): {
  label: string;
  color: string;
  bg: string;
  progress: number;
  activeStageIndex: number;
} {
  switch (status) {
    case "DRAFT":
      return { label: "Draft", color: "#64748B", bg: "#F8FAFC", progress: 10, activeStageIndex: 0 };
    case "CONSENTED":
      return { label: "Consented", color: "#1D4ED8", bg: "#EFF6FF", progress: 25, activeStageIndex: 1 };
    case "VERIFICATION_IN_PROGRESS":
      return { label: "Verification In Progress", color: "#D97706", bg: "#FFFBEB", progress: 40, activeStageIndex: 2 };
    case "VERIFIED":
      return { label: "Verified", color: "#0D9488", bg: "#F0FDFA", progress: 60, activeStageIndex: 3 };
    case "NOT_VERIFIED":
      return { label: "Not Verified", color: "#DC2626", bg: "#FEF2F2", progress: 50, activeStageIndex: 3 };
    case "SUBMITTED":
      return { label: "Submitted", color: "#1D4ED8", bg: "#EFF6FF", progress: 75, activeStageIndex: 4 };
    default:
      return { label: status, color: "#64748B", bg: "#F8FAFC", progress: 0, activeStageIndex: 0 };
  }
}

export function getApplicationSummaryCounts(userId: string): Record<string, number> {
  const apps = getUserApplications(userId);
  return {
    Draft: apps.filter((a) => a.status === "DRAFT").length,
    Submitted: apps.filter((a) => a.status === "SUBMITTED").length,
    "Under Verification": apps.filter(
      (a) =>
        a.status === "VERIFICATION_IN_PROGRESS" ||
        a.status === "CONSENTED" ||
        a.status === "VERIFIED" ||
        a.status === "NOT_VERIFIED",
    ).length,
    Completed: 0,
  };
}
