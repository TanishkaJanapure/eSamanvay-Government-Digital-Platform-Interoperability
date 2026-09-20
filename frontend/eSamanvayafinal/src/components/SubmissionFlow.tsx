import { useState, useEffect } from "react";
import { IcCheck, IcArrowRight, IcShield } from "./Icons";
import { EBC_SCHEME } from "../data/scheme";
import type { ScholarshipApplication } from "../services/applicationStore";
import {
  formatIncome,
  isFullyVerified,
  type VerifyResponse,
} from "../services/esamanvayApi";

interface SubmissionFlowProps {
  onDone: (appId: string) => void;
  application: ScholarshipApplication;
  verificationResult?: VerifyResponse | null;
}

export default function SubmissionFlow({ onDone, application, verificationResult }: SubmissionFlowProps) {
  const appId = application.id;
  const [phase, setPhase] = useState<"confirm" | "submitting" | "done">("confirm");

  const applicantName = verificationResult?.studentName ?? "Applicant";
  const verifiedFieldCount = verificationResult
    ? [
        verificationResult.digiLockerVerified,
        verificationResult.incomeVerified,
        verificationResult.educationVerified,
      ].filter(Boolean).length
    : 0;
  const dataVerifiedLabel = verificationResult
    ? `${verifiedFieldCount} of 3 interoperability checks verified · Overall: ${verificationResult.overallStatus}`
    : "8 of 9 fields verified from authoritative sources";
  const fullyVerified = verificationResult ? isFullyVerified(verificationResult) : true;

  useEffect(() => {
    if (phase !== "submitting") return;
    const t = setTimeout(() => setPhase("done"), 3000);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "confirm") {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
            Submit Application
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            Review the summary below before submitting your application to the department.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9" }}>
            <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Application Summary</span>
          </div>
          <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
            {[
              { label: "Applicant", value: applicantName },
              { label: "Service / Scheme", value: EBC_SCHEME.shortName },
              { label: "Department", value: EBC_SCHEME.department },
              { label: "Application Type", value: "Fresh Application" },
              { label: "Data Verified", value: dataVerifiedLabel },
              ...(verificationResult
                ? [
                    { label: "Annual Income", value: formatIncome(verificationResult.income.annualIncome) },
                    { label: "District", value: verificationResult.income.district },
                    { label: "Board", value: verificationResult.education.board },
                    { label: "Percentage", value: `${verificationResult.education.percentage}%` },
                    { label: "Result", value: verificationResult.education.resultStatus },
                  ]
                : []),
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-start px-5 py-3.5 gap-4">
                <span className="text-xs font-medium flex-shrink-0" style={{ color: "#94A3B8" }}>{r.label}</span>
                <span className="text-sm font-medium text-right" style={{ color: "#0F172A" }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy assurance */}
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border" style={{ background: "#F0FDFA", borderColor: "#99F6E4" }}>
          <IcShield size={15} stroke="#0D9488" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs" style={{ color: "#0F766E" }}>
            Your data is submitted securely and will only be shared with {EBC_SCHEME.department} for processing this application via MahaDBT, in accordance with your consent.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setPhase("submitting")}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#1D4ED8" }}
          >
            Submit Application <IcArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  if (phase === "submitting") {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 gap-6">
        <div className="relative w-16 h-16">
          <div
            className="w-16 h-16 rounded-full border-4 absolute inset-0"
            style={{ borderColor: "#BFDBFE", borderTopColor: "#1D4ED8", animation: "spin 1s linear infinite" }}
          />
        </div>
        <div className="text-center">
          <div className="font-semibold text-base" style={{ color: "#0F172A" }}>Submitting your application…</div>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>Please wait. Do not close this window.</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Done ── */
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Success banner */}
      <div
        className="flex items-center gap-4 px-5 py-5 rounded-2xl border"
        style={{
          background: fullyVerified ? "#F0FDFA" : "#FFFBEB",
          borderColor: fullyVerified ? "#99F6E4" : "#FDE68A",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: fullyVerified ? "#0D9488" : "#D97706" }}
        >
          <IcCheck size={26} stroke="white" />
        </div>
        <div>
          <div className="font-bold text-lg leading-tight" style={{ color: fullyVerified ? "#0F766E" : "#78350F" }}>
            Application Submitted Successfully
          </div>
          <p className="text-sm mt-1" style={{ color: fullyVerified ? "#0D9488" : "#92400E" }}>
            {verificationResult
              ? `${applicantName} · DigiLocker: ${verificationResult.digiLockerVerified ? "VERIFIED" : "NOT VERIFIED"} · Income: ${verificationResult.incomeVerified ? "VERIFIED" : "NOT VERIFIED"} · Education: ${verificationResult.educationVerified ? "VERIFIED" : "NOT VERIFIED"} · Overall: ${verificationResult.overallStatus}`
              : `Your application has been received by ${EBC_SCHEME.department}.`}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9" }}>
          <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Application Details</span>
        </div>
        <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
          {[
            { label: "Application ID", value: appId, mono: true, highlight: true },
            { label: "Applicant", value: applicantName },
            { label: "Service / Scheme", value: EBC_SCHEME.name },
            { label: "Beneficiary Category", value: EBC_SCHEME.beneficiaryCategory },
            { label: "Submitted On", value: new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }) },
            { label: "Verification Status", value: verificationResult?.overallStatus ?? "Submitted", badge: true },
            { label: "Expected Processing", value: "30–45 working days" },
          ].map((r) => (
            <div key={r.label} className="flex justify-between items-center px-5 py-3.5 gap-4">
              <span className="text-xs font-medium flex-shrink-0" style={{ color: "#94A3B8" }}>{r.label}</span>
              {r.badge ? (
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: fullyVerified ? "#F0FDFA" : "#FFFBEB",
                    color: fullyVerified ? "#0D9488" : "#D97706",
                  }}
                >
                  {r.value}
                </span>
              ) : (
                <span
                  className="text-sm font-medium text-right"
                  style={{
                    color: r.highlight ? "#1D4ED8" : "#0F172A",
                    fontFamily: r.mono ? "monospace" : "inherit",
                    letterSpacing: r.mono ? "0.05em" : undefined,
                  }}
                >
                  {r.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next steps note */}
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl border text-xs"
        style={{ background: "#FFFBEB", borderColor: "#FDE68A", color: "#78350F" }}
      >
        <svg width="14" height="14" className="flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        Department verification will begin within 7 working days. You will receive status updates via notifications and registered mobile number.
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onDone(appId)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#1D4ED8" }}
        >
          Track Application <IcArrowRight size={15} />
        </button>
        <button
          onClick={() => onDone(appId)}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-slate-50"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          View Application Details
        </button>
      </div>
    </div>
  );
}
