import { useState } from "react";
import { IcCheck, IcInfo, IcArrowRight, IcShield, IcEye } from "./Icons";
import { EBC_SCHEME } from "../data/scheme";
import type { UserProfile } from "../services/authService";
import {
  formatDob,
  formatGender,
  formatIncome,
  isFullyVerified,
  type VerifyResponse,
} from "../services/esamanvayApi";

interface ApplicationReviewProps {
  onSubmit: () => void;
  onBack: () => void;
  user: UserProfile;
  verificationResult?: VerifyResponse | null;
}

/* ─── Data ────────────────────────────────────────────── */
const APPLICANT = {
  name: "Priya Ramesh Sharma",
  dob: "14 March 1994",
  gender: "Female",
  aadhaar: "XXXX-XXXX-4821",
  mobile: "+91 98765 43210",
  email: "priya.sharma@gmail.com",
  address: "B-12, Shivaji Nagar, Pune — 411005, Maharashtra",
  category: EBC_SCHEME.beneficiaryCategory,
};

const EDUCATION = {
  institution: "Savitribai Phule Pune University",
  course: "Bachelor of Arts (Economics)",
  year: "Second Year (2024–25)",
  rollNo: "SPPU/2023/BA-EC-04821",
  enrolmentStatus: "Active",
};

const INCOME = {
  annualIncome: "₹1,85,000",
  certificateNo: "REV/PUN/2024/INC-00412",
  issuedBy: "Tahsildar, Pune",
  issuedDate: "14 October 2024",
  validUntil: "13 October 2025",
};

type DocStatus = "verified" | "pending" | "missing";

const DOCUMENTS: { name: string; source: string; status: DocStatus; date?: string }[] = [
  { name: "Birth Certificate", source: "DigiLocker", status: "verified", date: "22 Jan 2024" },
  { name: "Income Certificate (EBC eligibility)", source: "Revenue Department via DigiLocker", status: "verified", date: "14 Oct 2024" },
  { name: "Institution Enrolment Letter", source: "APAAR / Institution", status: "verified", date: "4 Aug 2024" },
  { name: "Aadhaar Card (masked)", source: "UIDAI eKYC", status: "verified", date: "26 Nov 2024" },
  { name: "Bank Passbook / Account Proof", source: "Self-declared (PFMS failed)", status: "pending" },
];

const DOC_META: Record<DocStatus, { label: string; color: string; bg: string; border: string }> = {
  verified: { label: "Verified", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
  pending:  { label: "Pending",  color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  missing:  { label: "Missing",  color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
};

/* ─── Data Mapping Preview ────────────────────────────── */
const MAPPING_ROWS = [
  { sourceField: "name (DigiLocker)", sourceVal: "SHARMA PRIYA RAMESH", arrow: "→", targetField: "applicant_name", targetVal: "Priya Ramesh Sharma", transform: "Capitalise & reorder" },
  { sourceField: "dob (DigiLocker)",  sourceVal: "14/03/1994",           arrow: "→", targetField: "date_of_birth",   targetVal: "1994-03-14",            transform: "ISO 8601 format" },
  { sourceField: "category (Revenue)", sourceVal: "EBC",                arrow: "→", targetField: "beneficiary_category", targetVal: "EBC / EWS",           transform: "Direct map" },
  { sourceField: "income_amount",     sourceVal: "185000",               arrow: "→", targetField: "annual_income",   targetVal: "185000.00",             transform: "Decimal normalise" },
  { sourceField: "aadhaar_ref (UIDAI)", sourceVal: "XXXX-XXXX-4821",    arrow: "→", targetField: "uid_reference",   targetVal: "XXXX4821",              transform: "Strip hyphens, mask" },
  { sourceField: "enrolment_year",    sourceVal: "2",                    arrow: "→", targetField: "course_year",     targetVal: "Second Year",           transform: "Ordinal label" },
];

/* ─── Section wrapper ─────────────────────────────────── */
function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "#F1F5F9" }}>
        <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

function EditBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-slate-50 transition-colors"
      style={{ borderColor: "#E2E8F0", color: "#1D4ED8" }}
    >
      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
      </svg>
      Edit
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 px-5 py-3 border-b last:border-0" style={{ borderColor: "#F8FAFC" }}>
      <span className="text-xs font-medium flex-shrink-0 pt-0.5" style={{ color: "#94A3B8" }}>{label}</span>
      <span className="text-sm text-right" style={{ color: "#0F172A" }}>{value}</span>
    </div>
  );
}

export default function ApplicationReview({ onSubmit, onBack, verificationResult }: ApplicationReviewProps) {
  const [agreed, setAgreed] = useState(false);
  const [showMapping, setShowMapping] = useState(false);

  const applicant = verificationResult
    ? {
        name: verificationResult.digiLocker.name,
        dob: formatDob(verificationResult.digiLocker.dob),
        gender: formatGender(verificationResult.digiLocker.gender),
        aadhaar: verificationResult.digiLocker.eaadhaar === "Y" ? "Linked via DigiLocker" : "Not linked",
        mobile: APPLICANT.mobile,
        email: APPLICANT.email,
        address: `${verificationResult.income.district}, Maharashtra`,
        category: EBC_SCHEME.beneficiaryCategory,
      }
    : APPLICANT;

  const education = verificationResult
    ? {
        institution: verificationResult.education.board,
        course: `${verificationResult.education.stream} — Exam ${verificationResult.education.examYear}`,
        year: verificationResult.education.examYear,
        rollNo: verificationResult.education.seatNumber,
        enrolmentStatus: verificationResult.education.resultStatus,
      }
    : EDUCATION;

  const income = verificationResult
    ? {
        annualIncome: formatIncome(verificationResult.income.annualIncome),
        certificateNo: verificationResult.income.certificateNumber,
        issuedBy: `Revenue Department, ${verificationResult.income.district}`,
        issuedDate: verificationResult.income.financialYear,
        validUntil: verificationResult.income.status,
      }
    : INCOME;

  const documents = verificationResult
    ? [
        { name: "DigiLocker Identity", source: "DigiLocker", status: verificationResult.digiLockerVerified ? "verified" as DocStatus : "missing" as DocStatus, date: verificationResult.digiLocker.digilockerid },
        { name: "Income Certificate", source: "Revenue Department", status: verificationResult.incomeVerified ? "verified" as DocStatus : "missing" as DocStatus, date: verificationResult.income.certificateNumber },
        { name: "Education Record", source: "Education Board", status: verificationResult.educationVerified ? "verified" as DocStatus : "missing" as DocStatus, date: verificationResult.education.seatNumber },
        { name: "Bank Passbook / Account Proof", source: "Self-declared (PFMS failed)", status: "pending" as DocStatus },
      ]
    : DOCUMENTS;

  const verifiedCount = documents.filter((d) => d.status === "verified").length;
  const fullyVerified = verificationResult ? isFullyVerified(verificationResult) : false;

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: "#64748B" }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <span style={{ color: "#CBD5E1" }}>·</span>
        <span className="text-xs" style={{ color: "#94A3B8" }}>Step 6 of 6</span>
      </div>

      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Application Review</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Review all details before final submission. Use Edit to correct any field.</p>
      </div>

      {/* Service banner */}
      <div className="flex items-start gap-4 p-5 rounded-2xl border" style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#1D4ED8" }}>
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base" style={{ color: "#1E3A8A" }}>{EBC_SCHEME.name}</div>
          <div className="text-sm mt-0.5" style={{ color: "#3B82F6" }}>{EBC_SCHEME.department}, Government of Maharashtra</div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            {[
              { label: EBC_SCHEME.beneficiaryCategory, bg: "#FEF3C7", color: "#92400E" },
              { label: "Education", bg: "#DBEAFE", color: "#1E40AF" },
              { label: "Integrated", bg: "#D1FAE5", color: "#065F46" },
              { label: "Fresh Application", bg: "#EDE9FE", color: "#4C1D95" },
            ].map((t) => (
              <span key={t.label} className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: t.bg, color: t.color }}>{t.label}</span>
            ))}
          </div>
        </div>
      </div>

      {verificationResult && (
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm"
          style={{
            background: fullyVerified ? "#F0FDFA" : "#FFFBEB",
            border: `1px solid ${fullyVerified ? "#99F6E4" : "#FDE68A"}`,
            color: fullyVerified ? "#0F766E" : "#78350F",
          }}
        >
          <IcCheck size={16} stroke={fullyVerified ? "#0D9488" : "#D97706"} className="flex-shrink-0 mt-0.5" />
          eSamanvaya verification complete — Overall: {verificationResult.overallStatus} · Student: {verificationResult.studentName}
        </div>
      )}

      {/* Applicant Details */}
      <Section title="Applicant Details" action={<EditBtn />}>
        {Object.entries({
          "Full Name": applicant.name,
          "Date of Birth": applicant.dob,
          "Gender": applicant.gender,
          "Aadhaar Reference": applicant.aadhaar,
          "Mobile Number": applicant.mobile,
          "Email Address": applicant.email,
          "Permanent Address": applicant.address,
          "Beneficiary Category": applicant.category,
        }).map(([k, v]) => <InfoRow key={k} label={k} value={v} />)}
      </Section>

      {/* Education */}
      <Section title="Education Information" action={<EditBtn />}>
        {Object.entries({
          "Institution": education.institution,
          "Course": education.course,
          "Year of Study": education.year,
          "Roll / Enrolment No.": education.rollNo,
          "Enrolment Status": education.enrolmentStatus,
        }).map(([k, v]) => <InfoRow key={k} label={k} value={v} />)}
      </Section>

      {/* Income */}
      <Section title="Income & Category" action={<EditBtn />}>
        {Object.entries({
          "Annual Family Income": income.annualIncome,
          "Certificate Number": income.certificateNo,
          "Issued By": income.issuedBy,
          "Issue Date": income.issuedDate,
          "Valid Until": income.validUntil,
        }).map(([k, v]) => <InfoRow key={k} label={k} value={v} />)}
      </Section>

      {/* Documents */}
      <Section title={`Documents Collected (${verifiedCount}/${documents.length} verified)`}>
        <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
          {documents.map((doc) => {
            const meta = DOC_META[doc.status];
            return (
              <div key={doc.name} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                  {doc.status === "verified"
                    ? <IcCheck size={14} stroke={meta.color} />
                    : <svg width="14" height="14" fill="none" stroke={meta.color} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0l7.353 12.748zM12 15.75h.007v.008H12v-.008z" /></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: "#0F172A" }}>{doc.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{doc.source}{doc.date ? ` · ${doc.date}` : ""}</div>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                  {meta.label}
                </span>
                {doc.status === "pending" && (
                  <button className="text-xs font-medium" style={{ color: "#1D4ED8" }}>Add</button>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Verification summary */}
      <Section title="Verification Status">
        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(verificationResult
            ? [
                { label: "DigiLocker", count: verificationResult.digiLockerVerified ? "VERIFIED" : "FAILED", color: verificationResult.digiLockerVerified ? "#0D9488" : "#DC2626", bg: verificationResult.digiLockerVerified ? "#F0FDFA" : "#FEF2F2" },
                { label: "Income", count: verificationResult.incomeVerified ? "VERIFIED" : "FAILED", color: verificationResult.incomeVerified ? "#0D9488" : "#DC2626", bg: verificationResult.incomeVerified ? "#F0FDFA" : "#FEF2F2" },
                { label: "Education", count: verificationResult.educationVerified ? "VERIFIED" : "FAILED", color: verificationResult.educationVerified ? "#0D9488" : "#DC2626", bg: verificationResult.educationVerified ? "#F0FDFA" : "#FEF2F2" },
                { label: "Overall", count: verificationResult.overallStatus, color: fullyVerified ? "#0D9488" : "#D97706", bg: fullyVerified ? "#F0FDFA" : "#FFFBEB" },
              ]
            : [
                { label: "Verified", count: 7, color: "#0D9488", bg: "#F0FDFA" },
                { label: "Needs Review", count: 0, color: "#D97706", bg: "#FFFBEB" },
                { label: "Conflict Resolved", count: 1, color: "#1D4ED8", bg: "#EFF6FF" },
                { label: "Pending", count: 1, color: "#94A3B8", bg: "#F8FAFC" },
              ]
          ).map((s) => (
            <div key={s.label} className="flex flex-col items-center p-3 rounded-xl" style={{ background: s.bg }}>
              <span className={`font-bold text-center ${typeof s.count === "string" && s.count.length > 8 ? "text-sm" : "text-2xl"}`} style={{ color: s.color }}>{s.count}</span>
              <span className="text-xs mt-0.5 text-center" style={{ color: s.color, opacity: 0.85 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Consent summary */}
      <Section
        title="Consent Summary"
        action={
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#0D9488" }}>
            <IcCheck size={12} stroke="#0D9488" /> Consent Given
          </span>
        }
      >
        <div className="px-5 py-4 space-y-3">
          {[
            { label: "Consent Scope", value: "This application only" },
            { label: "Data Sources Authorised", value: "DigiLocker, UIDAI, Revenue Dept., APAAR, NSP" },
            { label: "Consent Recorded At", value: "26 Nov 2024, 11:31 AM" },
            { label: "Right to Revoke", value: "Available in Consent & Data Access" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>{label}</span>
              <span className="text-xs text-right" style={{ color: "#334155" }}>{value}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <IcShield size={14} stroke="#0D9488" />
            <span className="text-xs" style={{ color: "#0D9488" }}>Consent logged and auditable in Data Access History</span>
          </div>
        </div>
      </Section>

      {/* ── Data Mapping Preview ── */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <button
          onClick={() => setShowMapping(!showMapping)}
          className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#F5F3FF" }}>
              <svg width="16" height="16" fill="none" stroke="#7C3AED" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>Data Mapping Preview</div>
              <div className="text-xs" style={{ color: "#94A3B8" }}>How eSamanvaya transforms source data into the target application format</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#7C3AED" }}>
            {showMapping ? "Hide" : "View"}
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`transition-transform ${showMapping ? "rotate-180" : ""}`}>
              <path strokeLinecap="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </button>

        {showMapping && (
          <div className="border-t" style={{ borderColor: "#F1F5F9" }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ background: "#FAFAFF" }}>
              <IcInfo size={13} stroke="#7C3AED" />
              <span className="text-xs" style={{ color: "#6D28D9" }}>
                eSamanvaya normalises heterogeneous source formats into the uniform target schema required by the department API. No data is altered — only formatting is transformed.
              </span>
            </div>
            {/* Column headers */}
            <div className="grid grid-cols-11 gap-0 border-b text-xs font-semibold px-5 py-2.5" style={{ borderColor: "#F1F5F9", color: "#94A3B8", background: "#F8FAFC" }}>
              <div className="col-span-3">Source Field · Value</div>
              <div className="col-span-1 text-center">→</div>
              <div className="col-span-3">Target Field · Value</div>
              <div className="col-span-4">Transform</div>
            </div>
            <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
              {MAPPING_ROWS.map((row) => (
                <div key={row.sourceField} className="grid grid-cols-11 gap-0 px-5 py-3 items-center">
                  <div className="col-span-3 min-w-0 pr-2">
                    <div className="text-xs font-medium truncate" style={{ color: "#64748B" }}>{row.sourceField}</div>
                    <div
                      className="text-xs font-mono mt-0.5 px-1.5 py-0.5 rounded inline-block truncate max-w-full"
                      style={{ background: "#F1F5F9", color: "#334155" }}
                    >
                      {row.sourceVal}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#EDE9FE" }}>
                      <svg width="11" height="11" fill="none" stroke="#7C3AED" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                  <div className="col-span-3 min-w-0 pr-2">
                    <div className="text-xs font-medium truncate" style={{ color: "#0D9488" }}>{row.targetField}</div>
                    <div
                      className="text-xs font-mono mt-0.5 px-1.5 py-0.5 rounded inline-block truncate max-w-full"
                      style={{ background: "#F0FDFA", color: "#0F766E" }}
                    >
                      {row.targetVal}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: "#EDE9FE", color: "#6D28D9" }}
                    >
                      {row.transform}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="px-5 py-3 border-t text-xs flex items-center gap-2"
              style={{ borderColor: "#F1F5F9", background: "#FAFAFF", color: "#94A3B8" }}
            >
              <IcEye size={12} />
              This preview is read-only. Actual API payload is prepared at submission time and is not stored by eSamanvaya.
            </div>
          </div>
        )}
      </div>

      {/* Declaration */}
      <div
        className="flex items-start gap-3.5 px-5 py-4 rounded-xl border cursor-pointer select-none transition-all"
        style={{ borderColor: agreed ? "#1D4ED8" : "#E2E8F0", background: agreed ? "#EFF6FF" : "white" }}
        onClick={() => setAgreed(!agreed)}
      >
        <div
          className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
          style={{ borderColor: agreed ? "#1D4ED8" : "#CBD5E1", background: agreed ? "#1D4ED8" : "white" }}
        >
          {agreed && <IcCheck size={11} stroke="white" />}
        </div>
        <p className="text-sm" style={{ color: "#334155" }}>
          I confirm that the information provided above is correct and complete to the best of my knowledge. I understand that submitting incorrect information may result in disqualification and legal consequences.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pb-4">
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
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: agreed ? "#1D4ED8" : "#93C5FD" }}
        >
          Review & Submit <IcArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
