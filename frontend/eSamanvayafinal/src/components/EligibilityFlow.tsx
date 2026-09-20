import { useState, useEffect, useCallback } from "react";
import { IcCheck, IcInfo, IcArrowRight, IcX, IcShield } from "./Icons";
import {
  verifyStudent,
  isFullyVerified,
  formatDob,
  formatGender,
  formatIncome,
  EsamanvayApiError,
  type VerifyResponse,
} from "../services/esamanvayApi";
import { EBC_SCHEME } from "../data/scheme";
import type { UserProfile } from "../services/authService";
import {
  getApplication,
  verificationStatusFromResult,
  type ScholarshipApplication,
} from "../services/applicationStore";

/* ─── Types ─────────────────────────────────────────────── */
type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface EligibilityFlowProps {
  onExit: () => void;
  onComplete?: () => void;
  user: UserProfile;
  application: ScholarshipApplication;
  onApplicationChange: (app: ScholarshipApplication) => ScholarshipApplication;
  verificationResult?: VerifyResponse | null;
  onVerificationComplete?: (result: VerifyResponse) => void;
}

/* ─── Step labels ──────────────────────────────────────── */
const STEPS = [
  "Eligibility",
  "Result",
  "Consent",
  "Data Collection",
  "Verification",
  "Review",
];

/* ─── Progress stepper ─────────────────────────────────── */
function Stepper({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, i) => {
        const num = (i + 1) as Step;
        const done = num < current;
        const active = num === current;
        const last = i === STEPS.length - 1;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: done ? "#0D9488" : active ? "#1D4ED8" : "#F1F5F9",
                  color: done || active ? "white" : "#94A3B8",
                  border: active ? "2px solid #BFDBFE" : "none",
                  boxShadow: active ? "0 0 0 3px #EFF6FF" : "none",
                }}
              >
                {done ? <IcCheck size={13} stroke="white" /> : num}
              </div>
              <span
                className="text-xs mt-1 text-center whitespace-nowrap hidden sm:block"
                style={{ color: done ? "#0D9488" : active ? "#1D4ED8" : "#94A3B8", fontWeight: active ? 600 : 400 }}
              >
                {label}
              </span>
            </div>
            {!last && (
              <div
                className="h-px flex-1 mx-2 mb-4 hidden sm:block"
                style={{ background: done ? "#99F6E4" : "#E2E8F0", minWidth: "24px" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Shell ────────────────────────────────────────────── */
function FlowShell({
  step,
  title,
  subtitle,
  onBack,
  onExit,
  children,
}: {
  step: Step;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onExit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-xs font-medium mr-1"
                style={{ color: "#64748B" }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back
              </button>
            )}
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
              Step {step} of {STEPS.length}
            </span>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>{title}</h1>
          {subtitle && <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>{subtitle}</p>}
        </div>
        <button
          onClick={onExit}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0"
          style={{ color: "#64748B" }}
          title="Save and exit"
        >
          <IcX size={16} />
        </button>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl border px-5 py-4" style={{ borderColor: "#E2E8F0" }}>
        <Stepper current={step} />
      </div>

      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 1 — Eligibility Questions
   ═══════════════════════════════════════════════════════ */
const QUESTIONS = [
  {
    id: "domicile",
    text: "Do you have Maharashtra domicile as required for this MahaDBT scheme?",
    hint: "Maharashtra domicile is required for EBC/EWS technical/professional scholarship.",
    options: ["Yes", "No"],
  },
  {
    id: "bonafide",
    text: "Are you a bonafide student of the institution?",
    hint: "Bonafide student status is required for this scholarship.",
    options: ["Yes", "No"],
  },
  {
    id: "courseType",
    text: "Are you enrolled in a professional or technical course?",
    hint: "This scheme applies to professional/technical courses under MahaDBT.",
    options: ["Yes", "No"],
  },
  {
    id: "capAdmission",
    text: "Was your admission through CAP (Centralised Admission Process)?",
    hint: "CAP admission is a verified scheme requirement.",
    options: ["Yes", "No"],
  },
  {
    id: "income",
    text: "Is your family/guardian annual income not more than ₹8 lakh?",
    hint: "Income limit for this EBC/EWS scheme is ₹8 lakh per year.",
    options: ["Yes", "No", "I do not have an income certificate"],
  },
  {
    id: "otherScholarship",
    text: "Are you currently receiving another scholarship or stipend?",
    hint: "Applicants must not be receiving another scholarship/stipend.",
    options: ["No", "Yes"],
  },
  {
    id: "familyBeneficiaries",
    text: "How many beneficiaries from your family are applying this academic year?",
    hint: "Maximum two beneficiaries from the same family for the current academic year.",
    options: ["None yet — I am the first", "1 (including me)", "2 (maximum allowed)"],
  },
  {
    id: "attendance",
    text: "Do you meet the attendance requirement for your course?",
    hint: "Attendance requirement applies as per scheme guidelines.",
    options: ["Yes", "No"],
  },
  {
    id: "studyGap",
    text: "Do you meet the study gap requirement (if applicable)?",
    hint: "Study gap rules apply as per verified scheme criteria.",
    options: ["Yes — no gap / gap within allowed limit", "No — gap exceeds allowed limit", "Not applicable"],
  },
];

function Step1({
  onNext,
  onExit,
  initialAnswers,
  user,
}: {
  onNext: (answers: Record<string, string>, personalInfo: ScholarshipApplication["personalInfo"]) => void;
  onExit: () => void;
  initialAnswers: Record<string, string>;
  user: UserProfile;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [course, setCourse] = useState("");
  const [college, setCollege] = useState("");
  const [yearSemester, setYearSemester] = useState("");
  const complete = QUESTIONS.every((q) => answers[q.id]) && course && college && yearSemester;

  return (
    <FlowShell
      step={1}
      title="Eligibility Check"
      subtitle={`${EBC_SCHEME.name} — ${EBC_SCHEME.department}`}
      onExit={onExit}
    >
      {/* Service chip */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border" style={{ borderColor: "#E2E8F0" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FF" }}>
          <svg width="18" height="18" fill="none" stroke="#1D4ED8" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>{EBC_SCHEME.shortName}</div>
          <div className="text-xs" style={{ color: "#64748B" }}>{EBC_SCHEME.department}</div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>EBC Scholarship</span>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9" }}>
          <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>Personal & Academic Details</span>
        </div>
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          {[
            { label: "Name", value: user.name, readOnly: true },
            { label: "Email", value: user.email, readOnly: true },
            { label: "Mobile", value: user.mobile, readOnly: true },
            { label: "Date of Birth", value: user.dob, readOnly: true },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>{f.label}</label>
              <input className="w-full rounded-lg border text-sm py-2.5 px-3" style={{ borderColor: "#E2E8F0", background: "#F8FAFC", color: "#0F172A" }} value={f.value} readOnly={f.readOnly} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>Course *</label>
            <input className="w-full rounded-lg border text-sm py-2.5 px-3 outline-none" style={{ borderColor: "#E2E8F0", background: "#FAFAFA" }} value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. B.Tech Computer Engineering" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>College *</label>
            <input className="w-full rounded-lg border text-sm py-2.5 px-3 outline-none" style={{ borderColor: "#E2E8F0", background: "#FAFAFA" }} value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Institution name" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>Current Year / Semester *</label>
            <input className="w-full rounded-lg border text-sm py-2.5 px-3 outline-none" style={{ borderColor: "#E2E8F0", background: "#FAFAFA" }} value={yearSemester} onChange={(e) => setYearSemester(e.target.value)} placeholder="e.g. Second Year / Semester 3" />
          </div>
        </div>
      </div>

      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs"
        style={{ background: "#F0FDFA", border: "1px solid #99F6E4", color: "#0F766E" }}
      >
        <IcInfo size={14} className="flex-shrink-0 mt-0.5" />
        Answer the following questions honestly. Your responses will be verified against authoritative data sources before the application is processed. Providing false information may lead to disqualification.
      </div>

      <div className="space-y-4">
        {QUESTIONS.map((q, qi) => (
          <div key={q.id} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "#F1F5F9" }}>
              <div className="flex items-start gap-2">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: answers[q.id] ? "#1D4ED8" : "#F1F5F9", color: answers[q.id] ? "white" : "#94A3B8" }}
                >
                  {answers[q.id] ? <IcCheck size={11} stroke="white" /> : qi + 1}
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#0F172A" }}>{q.text}</p>
                  {q.hint && (
                    <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>{q.hint}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-5 py-3 flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all"
                  style={{
                    borderColor: answers[q.id] === opt ? "#1D4ED8" : "#E2E8F0",
                    background: answers[q.id] === opt ? "#EFF6FF" : "white",
                    color: answers[q.id] === opt ? "#1D4ED8" : "#475569",
                    fontWeight: answers[q.id] === opt ? 600 : 400,
                  }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: answers[q.id] === opt ? "#1D4ED8" : "#CBD5E1" }}
                  >
                    {answers[q.id] === opt && (
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#1D4ED8" }} />
                    )}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onNext(answers, { name: user.name, dob: user.dob, mobile: user.mobile, email: user.email, course, college, yearSemester })}
          disabled={!complete}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: complete ? "#1D4ED8" : "#93C5FD" }}
        >
          Check Eligibility <IcArrowRight size={15} />
        </button>
      </div>
    </FlowShell>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 2 — Eligibility Result
   ═══════════════════════════════════════════════════════ */
function Step2({
  answers,
  onNext,
  onBack,
  onExit,
}: {
  answers: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
}) {
  const eligible =
    answers["domicile"] === "Yes" &&
    answers["bonafide"] === "Yes" &&
    answers["courseType"] === "Yes" &&
    answers["capAdmission"] === "Yes" &&
    answers["income"] === "Yes" &&
    answers["otherScholarship"] === "No" &&
    answers["attendance"] === "Yes" &&
    (answers["studyGap"] === "Yes — no gap / gap within allowed limit" || answers["studyGap"] === "Not applicable") &&
    answers["familyBeneficiaries"] !== undefined;

  const criteria = [
    { label: "Maharashtra domicile", met: answers["domicile"] === "Yes" },
    { label: "Bonafide student", met: answers["bonafide"] === "Yes" },
    { label: "Professional/technical course", met: answers["courseType"] === "Yes" },
    { label: "CAP admission", met: answers["capAdmission"] === "Yes" },
    { label: `Family income ≤ ${EBC_SCHEME.incomeLimitLabel}`, met: answers["income"] === "Yes" },
    { label: "Not receiving another scholarship/stipend", met: answers["otherScholarship"] === "No" },
    { label: "Family beneficiaries within limit (max 2)", met: !!answers["familyBeneficiaries"] },
    { label: "Attendance requirement met", met: answers["attendance"] === "Yes" },
    { label: "Study gap requirement met", met: answers["studyGap"] === "Yes — no gap / gap within allowed limit" || answers["studyGap"] === "Not applicable", detail: answers["familyBeneficiaries"] },
  ];

  return (
    <FlowShell
      step={2}
      title="Eligibility Result"
      subtitle="Based on your responses — subject to document verification"
      onBack={onBack}
      onExit={onExit}
    >
      {/* Result banner */}
      <div
        className="flex items-start gap-4 px-5 py-5 rounded-2xl border"
        style={{
          background: eligible ? "#F0FDFA" : "#FEF2F2",
          borderColor: eligible ? "#99F6E4" : "#FECACA",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: eligible ? "#0D9488" : "#DC2626" }}
        >
          {eligible ? (
            <IcCheck size={22} stroke="white" />
          ) : (
            <IcX size={22} stroke="white" />
          )}
        </div>
        <div>
          <div className="font-bold text-base" style={{ color: eligible ? "#0F766E" : "#991B1B" }}>
            {eligible ? "Appears Eligible" : "May Not Be Eligible"}
          </div>
          <p className="text-sm mt-1" style={{ color: eligible ? "#0D9488" : "#DC2626" }}>
            {eligible
              ? "Your responses indicate you may be eligible for this scholarship. Proceed to provide consent and verify your data."
              : "One or more eligibility criteria were not met based on your responses. You may still apply — the final determination rests with the department."}
          </p>
        </div>
      </div>

      {/* Criteria breakdown */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9" }}>
          <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>Eligibility Criteria</span>
        </div>
        <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
          {criteria.map((c) => (
            <div key={c.label} className="flex items-center gap-3 px-5 py-3.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: c.met ? "#F0FDFA" : "#FEF2F2" }}
              >
                {c.met
                  ? <IcCheck size={13} stroke="#0D9488" />
                  : <IcX size={13} stroke="#DC2626" />}
              </div>
              <span className="text-sm flex-1" style={{ color: "#334155" }}>{c.label}</span>
              {c.detail && <span className="text-xs" style={{ color: "#64748B" }}>{c.detail}</span>}
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: c.met ? "#F0FDFA" : "#FEF2F2",
                  color: c.met ? "#0D9488" : "#DC2626",
                }}
              >
                {c.met ? "Met" : "Not met"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs"
        style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#78350F" }}
      >
        <IcInfo size={14} className="flex-shrink-0 mt-0.5" />
        This is a preliminary check based on your self-declaration. Final eligibility is determined by MahaDBT after eSamanvaya verification and document review.
      </div>

      {!eligible && (
        <div
          className="flex items-start gap-3 px-5 py-4 rounded-xl border"
          style={{ background: "#FEF2F2", borderColor: "#FECACA" }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#DC2626" }}>
            <IcX size={16} stroke="white" />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1" style={{ color: "#991B1B" }}>
              You do not meet the eligibility criteria for this scheme.
            </div>
            <p className="text-sm" style={{ color: "#DC2626" }}>
              You cannot proceed with this application. If you believe this is incorrect, please review your responses or contact the MahaDBT helpdesk for assistance.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm font-medium border"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          Modify Responses
        </button>
        {eligible && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#1D4ED8" }}
          >
            Continue Application <IcArrowRight size={15} />
          </button>
        )}
        {!eligible && (
          <button
            onClick={onExit}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border"
            style={{ borderColor: "#E2E8F0", color: "#475569" }}
          >
            Exit Application
          </button>
        )}
      </div>
    </FlowShell>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 3 — Consent
   ═══════════════════════════════════════════════════════ */
const DATA_ITEMS = [
  { field: "Identity / Document Information", source: "DigiLocker (:8081)", purpose: "Verify student identity and linked documents", required: true },
  { field: "Income Certificate Information", source: "Revenue Department (:8082)", purpose: "Verify annual family income for EBC eligibility (≤ ₹8 lakh)", required: true },
  { field: "Academic / Result Information", source: "Education Board (:8084)", purpose: "Verify board, percentage, result status, and seat number", required: true },
  { field: "Full Name", source: "DigiLocker", purpose: "Cross-match applicant identity", required: true },
  { field: "Annual Family Income", source: "Revenue Department", purpose: "Income eligibility verification", required: true },
  { field: "Board & Percentage", source: "Education Department", purpose: "Academic performance verification", required: true },
];

function Step3({
  onNext,
  onBack,
  onExit,
}: {
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
}) {
  const [consent, setConsent] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <FlowShell
      step={3}
      title="Consent & Data Access"
      subtitle="Review what information will be accessed and from which sources"
      onBack={onBack}
      onExit={onExit}
    >
      {/* Service + dept card */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FF" }}>
            <IcShield size={18} stroke="#1D4ED8" />
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>{EBC_SCHEME.shortName}</div>
            <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>{EBC_SCHEME.department}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "#FEF3C7", color: "#92400E" }}>{EBC_SCHEME.beneficiaryCategory}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>Education</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "#F0FDFA", color: "#0D9488" }}>Integrated</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "#F8FAFC", color: "#64748B" }}>One-time consent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9" }}>
          <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Information Requested</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: "#1D4ED8" }}
          >
            {expanded ? "Hide" : "View"} Data Access Details
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
              <path strokeLinecap="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
          {DATA_ITEMS.filter((_, i) => expanded || i < 5).map((item) => (
            <div key={item.field} className="px-5 py-3.5 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{item.field}</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-xs font-semibold"
                    style={{
                      background: item.required ? "#FEF2F2" : "#F8FAFC",
                      color: item.required ? "#DC2626" : "#64748B",
                    }}
                  >
                    {item.required ? "Required" : "Optional"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: "#94A3B8" }}>
                  <span>Source: <span style={{ color: "#475569" }}>{item.source}</span></span>
                  <span>·</span>
                  <span>Purpose: <span style={{ color: "#475569" }}>{item.purpose}</span></span>
                </div>
              </div>
            </div>
          ))}
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="w-full px-5 py-3 text-xs font-medium text-center hover:bg-slate-50 transition-colors"
              style={{ color: "#1D4ED8" }}
            >
              + {DATA_ITEMS.length - 5} more fields — click to expand
            </button>
          )}
        </div>
      </div>

      {/* Retention notice */}
      <div className="bg-white rounded-xl border divide-y" style={{ borderColor: "#E2E8F0" }}>
        {[
          { label: "Consent Duration", value: "Valid for this application only" },
          { label: "Data Retention", value: "As per MeitY Data Governance Framework" },
          { label: "Right to Revoke", value: "You may revoke consent at any time from Consent & Data Access" },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center px-5 py-3.5">
            <span className="text-xs font-medium" style={{ color: "#64748B" }}>{row.label}</span>
            <span className="text-xs" style={{ color: "#334155" }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Consent checkbox */}
      <div
        className="flex items-start gap-3.5 px-5 py-4 rounded-xl border cursor-pointer select-none transition-all"
        style={{
          borderColor: consent ? "#1D4ED8" : "#E2E8F0",
          background: consent ? "#EFF6FF" : "white",
        }}
        onClick={() => setConsent(!consent)}
      >
        <div
          className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
          style={{
            borderColor: consent ? "#1D4ED8" : "#CBD5E1",
            background: consent ? "#1D4ED8" : "white",
          }}
        >
          {consent && <IcCheck size={11} stroke="white" />}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "#0F172A" }}>
            I consent to eSamanvaya retrieving the information listed above from DigiLocker, Revenue, and Education services for the purpose of processing my {EBC_SCHEME.shortName} application.
          </p>
          <p className="text-xs mt-1.5" style={{ color: "#64748B" }}>
            I understand that this consent is specific to this application and does not authorize any other data access. I can revoke this consent at any time.
          </p>
        </div>
      </div>

      {!consent && (
        <p className="text-xs text-center" style={{ color: "#94A3B8" }}>
          You must provide consent before proceeding
        </p>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm font-medium border"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!consent}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: consent ? "#1D4ED8" : "#93C5FD" }}
        >
          Continue <IcArrowRight size={15} />
        </button>
      </div>
    </FlowShell>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 4 — Verification Identifiers
   ═══════════════════════════════════════════════════════ */
function Step4({
  onNext,
  onBack,
  onExit,
  user,
  initialIdentifiers,
}: {
  onNext: (identifiers: { digilockerId: string; certificateNumber: string; seatNumber: string }) => void;
  onBack: () => void;
  onExit: () => void;
  user: UserProfile;
  initialIdentifiers?: { digilockerId: string; certificateNumber: string; seatNumber: string };
}) {
  const [digilockerId, setDigilockerId] = useState(initialIdentifiers?.digilockerId ?? user.digilockerId ?? "");
  const [certificateNumber, setCertificateNumber] = useState(initialIdentifiers?.certificateNumber ?? user.certificateNumber ?? "");
  const [seatNumber, setSeatNumber] = useState(initialIdentifiers?.seatNumber ?? user.seatNumber ?? "");
  const complete = digilockerId.trim() && certificateNumber.trim() && seatNumber.trim();

  return (
    <FlowShell
      step={4}
      title="Verification Identifiers"
      subtitle="Enter the identifiers used by eSamanvaya to verify your records across government services"
      onBack={onBack}
      onExit={onExit}
    >
      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs"
        style={{ background: "#F0FDFA", border: "1px solid #99F6E4", color: "#0F766E" }}
      >
        <IcInfo size={14} className="flex-shrink-0 mt-0.5" />
        After consent, eSamanvaya will call DigiLocker (:8081), Revenue (:8082), and Education (:8084) via the orchestrator (:8091).
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9" }}>
          <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Government Service Identifiers</span>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>DigiLocker ID *</label>
            <input className="w-full rounded-lg border text-sm py-2.5 px-3 font-mono outline-none" style={{ borderColor: "#E2E8F0", background: "#FAFAFA" }} value={digilockerId} onChange={(e) => setDigilockerId(e.target.value)} placeholder="DL-MOCK-000001" />
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>DigiLocker — identity/document information</p>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>Income Certificate Number *</label>
            <input className="w-full rounded-lg border text-sm py-2.5 px-3 font-mono outline-none" style={{ borderColor: "#E2E8F0", background: "#FAFAFA" }} value={certificateNumber} onChange={(e) => setCertificateNumber(e.target.value)} placeholder="INC-MH-2025-000001" />
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Revenue — income certificate information</p>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>Education / Seat Number *</label>
            <input className="w-full rounded-lg border text-sm py-2.5 px-3 font-mono outline-none" style={{ borderColor: "#E2E8F0", background: "#FAFAFA" }} value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} placeholder="HSC-PUNE-2025-000001" />
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Education — academic/result information</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={() => onNext({ digilockerId: digilockerId.trim(), certificateNumber: certificateNumber.trim(), seatNumber: seatNumber.trim() })}
          disabled={!complete}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: complete ? "#1D4ED8" : "#93C5FD" }}
        >
          Start Verification <IcArrowRight size={15} />
        </button>
      </div>
    </FlowShell>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 5 — Verification & Conflict Resolution
   ═══════════════════════════════════════════════════════ */
type VerificationStatus = "verified" | "needs-review" | "missing" | "conflict";

interface FieldRow {
  label: string;
  source: string;
  value: string;
  status: VerificationStatus;
  conflict?: { source1: string; value1: string; source2: string; value2: string };
}

function fieldStatus(verified: boolean): VerificationStatus {
  return verified ? "verified" : "missing";
}

function buildFieldsFromResponse(response: VerifyResponse): FieldRow[] {
  const { digiLocker, digiLockerVerified, income, incomeVerified, education, educationVerified } = response;

  return [
    { label: "Full Name", source: "DigiLocker", value: digiLocker.name, status: fieldStatus(digiLockerVerified) },
    { label: "Date of Birth", source: "DigiLocker", value: formatDob(digiLocker.dob), status: fieldStatus(digiLockerVerified) },
    { label: "Gender", source: "DigiLocker", value: formatGender(digiLocker.gender), status: fieldStatus(digiLockerVerified) },
    { label: "Aadhaar Linked", source: "DigiLocker", value: digiLocker.eaadhaar === "Y" ? "Yes" : "No", status: fieldStatus(digiLockerVerified) },
    { label: "DigiLocker ID", source: "DigiLocker", value: digiLocker.digilockerid, status: fieldStatus(digiLockerVerified) },
    { label: "Annual Family Income", source: "Revenue Dept.", value: formatIncome(income.annualIncome), status: fieldStatus(incomeVerified) },
    { label: "Income Certificate", source: "Revenue Dept.", value: income.status, status: fieldStatus(incomeVerified) },
    { label: "District", source: "Revenue Dept.", value: income.district, status: fieldStatus(incomeVerified) },
    { label: "Financial Year", source: "Revenue Dept.", value: income.financialYear, status: fieldStatus(incomeVerified) },
    { label: "Board", source: "Education Dept.", value: education.board, status: fieldStatus(educationVerified) },
    { label: "Stream", source: "Education Dept.", value: education.stream, status: fieldStatus(educationVerified) },
    { label: "Exam Percentage", source: "Education Dept.", value: `${education.percentage}%`, status: fieldStatus(educationVerified) },
    { label: "Result Status", source: "Education Dept.", value: education.resultStatus, status: fieldStatus(educationVerified) },
  ];
}

const STATUS_META_V: Record<VerificationStatus, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  verified: {
    label: "Verified",
    icon: <IcCheck size={13} stroke="#0D9488" />,
    color: "#0D9488",
    bg: "#F0FDFA",
    border: "#99F6E4",
  },
  "needs-review": {
    label: "Needs Review",
    icon: (
      <svg width="13" height="13" fill="none" stroke="#D97706" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  missing: {
    label: "Missing",
    icon: (
      <svg width="13" height="13" fill="none" stroke="#64748B" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M19.5 12h-15" />
      </svg>
    ),
    color: "#64748B",
    bg: "#F8FAFC",
    border: "#E2E8F0",
  },
  conflict: {
    label: "Conflict",
    icon: (
      <svg width="13" height="13" fill="none" stroke="#DC2626" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0l7.353 12.748zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
};

function Step5({
  onNext,
  onBack,
  onExit,
  verificationResult,
  onVerificationComplete,
  identifiers,
}: {
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
  verificationResult: VerifyResponse | null;
  onVerificationComplete: (result: VerifyResponse) => void;
  identifiers: { digilockerId: string; certificateNumber: string; seatNumber: string };
}) {
  const [fields, setFields] = useState<FieldRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedDOB, setResolvedDOB] = useState<string | null>(null);
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  const runVerification = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await verifyStudent(identifiers);
      onVerificationComplete(result);
      setFields(buildFieldsFromResponse(result));
    } catch (err) {
      const message =
        err instanceof EsamanvayApiError
          ? err.message
          : "Verification failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [onVerificationComplete, identifiers]);

  useEffect(() => {
    if (verificationResult) {
      setFields(buildFieldsFromResponse(verificationResult));
      return;
    }
    runVerification();
  }, [verificationResult, runVerification]);

  const conflictField = fields.find((f) => f.status === "conflict");
  const hasConflict = conflictField && !resolvedDOB;
  const fullyVerified = verificationResult ? isFullyVerified(verificationResult) : false;

  function resolveConflict(choice: string) {
    setResolvedDOB(choice);
    setFields((prev) =>
      prev.map((f) => (f.status === "conflict" ? { ...f, value: choice, status: "verified" } : f))
    );
  }

  function confirmAddress() {
    setAddressConfirmed(true);
    setFields((prev) =>
      prev.map((f) => (f.label === "Permanent Address" ? { ...f, status: "verified" } : f))
    );
  }

  const summary = {
    verified: fields.filter((f) => f.status === "verified").length,
    conflict: fields.filter((f) => f.status === "conflict").length,
    missing: fields.filter((f) => f.status === "missing").length,
    review: fields.filter((f) => f.status === "needs-review").length,
  };

  if (loading && fields.length === 0) {
    return (
      <FlowShell
        step={5}
        title="Data Verification"
        subtitle="Verifying your information across DigiLocker, Revenue, and Education services…"
        onBack={onBack}
        onExit={onExit}
      >
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="relative w-16 h-16">
            <div
              className="w-16 h-16 rounded-full border-4 absolute inset-0"
              style={{ borderColor: "#BFDBFE", borderTopColor: "#1D4ED8", animation: "spin 1s linear infinite" }}
            />
          </div>
          <div className="text-center">
            <div className="font-semibold text-base" style={{ color: "#0F172A" }}>Running eSamanvaya verification…</div>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>
              Connecting to DigiLocker (:8081), Revenue (:8082), and Education (:8084)
            </p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </FlowShell>
    );
  }

  if (error && fields.length === 0) {
    return (
      <FlowShell
        step={5}
        title="Data Verification"
        subtitle="Unable to complete verification"
        onBack={onBack}
        onExit={onExit}
      >
        <div
          className="flex items-start gap-4 px-5 py-5 rounded-2xl border"
          style={{ background: "#FEF2F2", borderColor: "#FECACA" }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#DC2626" }}>
            <IcX size={22} stroke="white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-base" style={{ color: "#991B1B" }}>Verification Failed</div>
            <p className="text-sm mt-1" style={{ color: "#DC2626" }}>{error}</p>
            <button
              onClick={runVerification}
              className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#1D4ED8" }}
            >
              Retry Verification
            </button>
          </div>
        </div>
      </FlowShell>
    );
  }

  return (
    <FlowShell
      step={5}
      title="Data Verification"
      subtitle="Review retrieved data from eSamanvaya interoperability services."
      onBack={onBack}
      onExit={onExit}
    >
      {verificationResult && (
        <div
          className="flex items-start gap-4 px-5 py-5 rounded-2xl border"
          style={{
            background: fullyVerified ? "#F0FDFA" : "#FFFBEB",
            borderColor: fullyVerified ? "#99F6E4" : "#FDE68A",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: fullyVerified ? "#0D9488" : "#D97706" }}
          >
            {fullyVerified ? <IcCheck size={22} stroke="white" /> : <IcInfo size={22} stroke="white" />}
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: fullyVerified ? "#0F766E" : "#78350F" }}>
              Overall Status: {verificationResult.overallStatus}
            </div>
            <p className="text-sm mt-1" style={{ color: fullyVerified ? "#0D9488" : "#92400E" }}>
              Student: {verificationResult.studentName} · DigiLocker: {verificationResult.digiLockerVerified ? "VERIFIED" : "NOT VERIFIED"} · Income: {verificationResult.incomeVerified ? "VERIFIED" : "NOT VERIFIED"} · Education: {verificationResult.educationVerified ? "VERIFIED" : "NOT VERIFIED"}
            </p>
          </div>
        </div>
      )}

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { title: "Verified", count: summary.verified, meta: STATUS_META_V.verified },
          { title: "Needs Review", count: summary.review, meta: STATUS_META_V["needs-review"] },
          { title: "Conflict", count: summary.conflict, meta: STATUS_META_V.conflict },
          { title: "Missing", count: summary.missing, meta: STATUS_META_V.missing },
        ]).map((s) => (
          <div
            key={s.title}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border"
            style={{ background: s.meta.bg, borderColor: s.meta.border }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "white" }}>
              {s.meta.icon}
            </div>
            <div>
              <div className="text-lg font-bold leading-none" style={{ color: s.meta.color }}>{s.count}</div>
              <div className="text-xs mt-0.5" style={{ color: s.meta.color, opacity: 0.8 }}>{s.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Field rows */}
      <div className="space-y-3">
        {fields.map((field) => {
          const meta = STATUS_META_V[field.status];
          return (
            <div
              key={field.label}
              className="bg-white rounded-xl border overflow-hidden"
              style={{ borderColor: field.status === "conflict" ? "#FECACA" : field.status === "missing" ? "#E2E8F0" : "#E2E8F0" }}
            >
              <div className="flex items-start gap-3 px-5 py-4">
                {/* Status icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: meta.bg }}
                >
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>{field.label}</span>
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
                    >
                      {meta.icon} {meta.label}
                    </span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Source: {field.source}</div>
                  {field.value && (
                    <div className="mt-1.5 text-sm font-medium" style={{ color: "#334155" }}>{field.value}</div>
                  )}
                </div>
              </div>

              {/* ── Conflict resolution ── */}
              {field.status === "conflict" && field.conflict && (
                <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: "#FECACA", background: "#FFFAFA" }}>
                  <div
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-xs"
                    style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}
                  >
                    <svg width="14" height="14" className="flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0l7.353 12.748zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span>
                      Two authoritative sources returned <strong>different values</strong> for this field. Select the correct value or enter it manually. eSamanvaya will never automatically overwrite conflicting information.
                    </span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: "#64748B" }}>SELECT THE CORRECT VALUE</p>
                  <div className="space-y-2">
                    {[
                      { label: field.conflict.source1, value: field.conflict.value1 },
                      { label: field.conflict.source2, value: field.conflict.value2 },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => resolveConflict(opt.value)}
                        className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-all"
                        style={{
                          borderColor: resolvedDOB === opt.value ? "#1D4ED8" : "#E2E8F0",
                          background: resolvedDOB === opt.value ? "#EFF6FF" : "white",
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0"
                          style={{ borderColor: resolvedDOB === opt.value ? "#1D4ED8" : "#CBD5E1" }}
                        >
                          {resolvedDOB === opt.value && (
                            <div className="w-2 h-2 rounded-full" style={{ background: "#1D4ED8" }} />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-medium mb-0.5" style={{ color: "#64748B" }}>{opt.label}</div>
                          <div className="text-sm font-semibold" style={{ color: "#0F172A" }}>{opt.value}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div
                    className="flex items-start gap-2 text-xs"
                    style={{ color: "#64748B" }}
                  >
                    <IcInfo size={13} className="flex-shrink-0 mt-0.5" />
                    Your selection is used for this application only. Contact the issuing authority (DigiLocker / UIDAI) to resolve the underlying record discrepancy in their systems.
                  </div>
                </div>
              )}

              {/* ── Needs review — address confirmation ── */}
              {field.label === "Permanent Address" && field.status === "needs-review" && !addressConfirmed && (
                <div className="border-t px-5 py-4" style={{ borderColor: "#FDE68A", background: "#FFFDF0" }}>
                  <p className="text-xs mb-3" style={{ color: "#78350F" }}>
                    The retrieved address may differ slightly from your Aadhaar records (formatting differences). Please confirm this is your correct current address.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={confirmAddress}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: "#1D4ED8" }}
                    >
                      Confirm Address
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-xs font-medium border"
                      style={{ borderColor: "#E2E8F0", color: "#475569" }}
                    >
                      Correct Address
                    </button>
                  </div>
                </div>
              )}

              {/* ── Missing — bank account — note only, no manual entry ── */}
              {field.label === "Bank Account (for DBT)" && field.status === "missing" && (
                <div className="border-t px-5 py-3.5 flex items-start gap-2.5" style={{ borderColor: "#E2E8F0", background: "#F8FAFC" }}>
                  <IcInfo size={13} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    PFMS could not retrieve bank account details. This can be provided through PFMS after submission. Your application will still be processed.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasConflict && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs"
          style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}
        >
          <IcInfo size={14} className="flex-shrink-0 mt-0.5" />
          Resolve the Date of Birth conflict before proceeding.
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm font-medium border"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!!hasConflict || !verificationResult}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: hasConflict || !verificationResult ? "#93C5FD" : "#1D4ED8" }}
        >
          Proceed to Review <IcArrowRight size={15} />
        </button>
      </div>
    </FlowShell>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 6 — Application Review
   ═══════════════════════════════════════════════════════ */
function Step6({
  onSubmit,
  onBack,
  onExit,
  verificationResult,
}: {
  onSubmit: () => void;
  onBack: () => void;
  onExit: () => void;
  verificationResult: VerifyResponse | null;
}) {
  const [agreed, setAgreed] = useState(false);

  const reviewRows = verificationResult
    ? [
        { section: "Identity", items: [
          { label: "Full Name", value: verificationResult.digiLocker.name },
          { label: "Date of Birth", value: formatDob(verificationResult.digiLocker.dob) },
          { label: "Gender", value: formatGender(verificationResult.digiLocker.gender) },
          { label: "DigiLocker", value: verificationResult.digiLockerVerified ? "VERIFIED" : "NOT VERIFIED" },
        ]},
        { section: "Eligibility", items: [
          { label: "Beneficiary Category", value: EBC_SCHEME.beneficiaryCategory },
          { label: "Annual Income", value: formatIncome(verificationResult.income.annualIncome) },
          { label: "District", value: verificationResult.income.district },
          { label: "Income Certificate", value: verificationResult.incomeVerified ? "VERIFIED" : "NOT VERIFIED" },
          { label: "Financial Year", value: verificationResult.income.financialYear },
        ]},
        { section: "Education", items: [
          { label: "Board", value: verificationResult.education.board },
          { label: "Percentage", value: `${verificationResult.education.percentage}%` },
          { label: "Result", value: verificationResult.education.resultStatus },
          { label: "Education", value: verificationResult.educationVerified ? "VERIFIED" : "NOT VERIFIED" },
        ]},
        { section: "Application", items: [
          { label: "Service", value: EBC_SCHEME.shortName },
          { label: "Department", value: EBC_SCHEME.department },
          { label: "Overall Status", value: verificationResult.overallStatus },
        ]},
      ]
    : [
        { section: "Application", items: [
          { label: "Service", value: EBC_SCHEME.shortName },
          { label: "Department", value: EBC_SCHEME.department },
          { label: "Status", value: "Awaiting verification" },
        ]},
      ];

  return (
    <FlowShell
      step={6}
      title="Application Review"
      subtitle="Review all details before final submission"
      onBack={onBack}
      onExit={onExit}
    >
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm"
        style={{ background: "#F0FDFA", border: "1px solid #99F6E4", color: "#0F766E" }}
      >
        <IcCheck size={16} stroke="#0D9488" className="flex-shrink-0 mt-0.5" />
        All data verified and conflicts resolved. Review the information below and submit.
      </div>

      {reviewRows.map((section) => (
        <div key={section.section} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{section.section}</span>
          </div>
          <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
            {section.items.map((item) => (
              <div key={item.label} className="flex justify-between items-start gap-4 px-5 py-3.5">
                <span className="text-xs font-medium" style={{ color: "#64748B" }}>{item.label}</span>
                <span className="text-sm text-right" style={{ color: "#0F172A" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
        className="flex items-start gap-3.5 px-5 py-4 rounded-xl border cursor-pointer select-none transition-all"
        style={{ borderColor: agreed ? "#1D4ED8" : "#E2E8F0", background: agreed ? "#EFF6FF" : "white" }}
        onClick={() => setAgreed(!agreed)}
      >
        <div
          className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ borderColor: agreed ? "#1D4ED8" : "#CBD5E1", background: agreed ? "#1D4ED8" : "white" }}
        >
          {agreed && <IcCheck size={11} stroke="white" />}
        </div>
        <p className="text-sm" style={{ color: "#334155" }}>
          I declare that all information provided is true and correct to the best of my knowledge. I understand that providing false information may lead to cancellation of the application and legal action.
        </p>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm font-medium border"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!agreed}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: agreed ? "#0D9488" : "#99F6E4" }}
        >
          Submit Application <IcArrowRight size={15} />
        </button>
      </div>
    </FlowShell>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 7 — Success
   ═══════════════════════════════════════════════════════ */
function SuccessScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-12 space-y-5">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: "#F0FDFA", border: "4px solid #99F6E4" }}
      >
        <IcCheck size={36} stroke="#0D9488" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
          Application Submitted
        </h2>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Your application for <strong>{EBC_SCHEME.shortName}</strong> has been submitted successfully.
        </p>
      </div>
      <div className="bg-white rounded-xl border px-6 py-4 w-full max-w-md" style={{ borderColor: "#E2E8F0" }}>
        {[
          { label: "Application ID", value: "AP-2024-9241" },
          { label: "Submitted on", value: "26 November 2024, 11:42 AM" },
          { label: "Expected response", value: "30–45 working days" },
          { label: "Track at", value: "My Applications" },
        ].map((row) => (
          <div key={row.label} className="flex justify-between py-2.5 border-b last:border-0" style={{ borderColor: "#F1F5F9" }}>
            <span className="text-xs" style={{ color: "#94A3B8" }}>{row.label}</span>
            <span className="text-xs font-medium" style={{ color: "#0F172A" }}>{row.value}</span>
          </div>
        ))}
      </div>
      <div
        className="flex items-start gap-2 px-4 py-3 rounded-xl text-xs max-w-md"
        style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#78350F" }}
      >
        <IcInfo size={13} className="flex-shrink-0 mt-0.5" />
        You will receive SMS and email updates. The final decision is at the discretion of MahaDBT and {EBC_SCHEME.department}.
      </div>
      <button
        onClick={onDone}
        className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
        style={{ background: "#1D4ED8" }}
      >
        Return to Dashboard
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Root orchestrator
   ═══════════════════════════════════════════════════════ */
export default function EligibilityFlow({
  onExit,
  onComplete,
  user,
  application,
  onApplicationChange,
  verificationResult = null,
  onVerificationComplete,
}: EligibilityFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Record<string, string>>(application.answers ?? {});
  const [identifiers, setIdentifiers] = useState(application.identifiers ?? {
    digilockerId: user.digilockerId ?? "",
    certificateNumber: user.certificateNumber ?? "",
    seatNumber: user.seatNumber ?? "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && onComplete) {
      onComplete();
    }
  }, [submitted, onComplete]);

  if (submitted) {
    if (onComplete) return null;
    return <SuccessScreen onDone={onExit} />;
  }

  return (
    <>
      {step === 1 && (
        <Step1
          initialAnswers={answers}
          user={user}
          onNext={(ans, personalInfo) => {
            setAnswers(ans);
            onApplicationChange({ ...application, answers: ans, personalInfo, status: "DRAFT" });
            setStep(2);
          }}
          onExit={onExit}
        />
      )}
      {step === 2 && (
        <Step2
          answers={answers}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          onExit={onExit}
        />
      )}
      {step === 3 && (
        <Step3
          onNext={() => {
            onApplicationChange({
              ...application,
              answers,
              status: "CONSENTED",
              consent: {
                grantedAt: new Date().toISOString(),
                scopes: ["DigiLocker identity/documents", "Revenue income certificate", "Education academic records"],
              },
            });
            setStep(4);
          }}
          onBack={() => setStep(2)}
          onExit={onExit}
        />
      )}
      {step === 4 && (
        <Step4
          user={user}
          initialIdentifiers={identifiers}
          onNext={(ids) => {
            setIdentifiers(ids);
            onApplicationChange({ ...application, answers, identifiers: ids, status: "VERIFICATION_IN_PROGRESS" });
            setStep(5);
          }}
          onBack={() => setStep(3)}
          onExit={onExit}
        />
      )}
      {step === 5 && (
        <Step5
          identifiers={identifiers}
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
          onExit={onExit}
          verificationResult={verificationResult ?? application.verificationResult ?? null}
          onVerificationComplete={(result) => {
            onVerificationComplete?.(result);
            const latest =
              getApplication(application.userId, application.id) ?? application;
            onApplicationChange({
              ...latest,
              answers,
              identifiers,
              verificationResult: result,
              status: verificationStatusFromResult(result),
            });
          }}
        />
      )}
      {step === 6 && (
        <Step6
          onSubmit={() => setSubmitted(true)}
          onBack={() => setStep(5)}
          onExit={onExit}
          verificationResult={verificationResult ?? application.verificationResult ?? null}
        />
      )}
    </>
  );
}
