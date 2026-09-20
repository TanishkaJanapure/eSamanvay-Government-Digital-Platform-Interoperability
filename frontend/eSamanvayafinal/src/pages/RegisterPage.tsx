import { useState } from "react";

export interface RegisteredCitizenData {
  name: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  aadhaarLast4: string;
  accountCreated: string;
}

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onRegister: (data: RegisteredCitizenData, password: string) => Promise<{ ok: boolean; error?: string }>;
}

/* ─────────────────────────────────────────────────────────
   ALL HELPER COMPONENTS DEFINED OUTSIDE RegisterPage
   so they are never recreated on state change.
───────────────────────────────────────────────────────── */

function StepBar({ current }: { current: number }) {
  const STEPS = [
    { n: 1, label: "Personal Information" },
    { n: 2, label: "Aadhaar Verification" },
    { n: 3, label: "Account Setup" },
  ];
  return (
    <div className="flex items-center gap-0 mb-7">
      {STEPS.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: done ? "#0D9488" : active ? "#1D4ED8" : "#F1F5F9",
                  color: done || active ? "white" : "#94A3B8",
                }}
              >
                {done ? (
                  <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : s.n}
              </div>
              <div
                className="text-xs mt-1 font-medium whitespace-nowrap hidden sm:block"
                style={{ color: active ? "#1D4ED8" : done ? "#0D9488" : "#94A3B8", fontSize: "10px" }}
              >
                {s.label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-1 transition-all duration-500"
                style={{ background: done ? "#0D9488" : "#E2E8F0", marginBottom: "16px" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
        {label}{required && <span style={{ color: "#DC2626" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function OtpBoxes({
  otp, onChange, onKeyDown,
}: {
  otp: string[];
  onChange: (i: number, v: string) => void;
  onKeyDown: (i: number, e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="flex gap-2 justify-between">
      {otp.map((digit, i) => (
        <input
          key={i}
          id={`reg-otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="w-11 h-12 text-center text-lg font-bold rounded-lg border outline-none transition-all"
          style={{
            borderColor: digit ? "#1D4ED8" : "#E2E8F0",
            background: digit ? "#EFF6FF" : "#FAFAFA",
            color: "#0F172A",
          }}
        />
      ))}
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
      style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      {msg}
    </div>
  );
}

function PwEye({ show, toggle }: { show: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        {show ? (
          <>
            <path strokeLinecap="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </>
        ) : (
          <>
            <path strokeLinecap="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </>
        )}
      </svg>
    </button>
  );
}

/* Shell wraps every step in the same page chrome.
   Defined OUTSIDE RegisterPage so it is never recreated on state change. */
function Shell({
  onNavigate,
  stepNum,
  title,
  subtitle,
  children,
}: {
  onNavigate: (page: string) => void;
  stepNum: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F8FC", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#1E3A8A", color: "#BFDBFE" }} className="text-xs py-1.5 px-4 flex justify-between items-center">
        <button onClick={() => onNavigate("login")} className="flex items-center gap-1.5 hover:text-white transition-colors">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Login
        </button>
        <span>Government of India — Citizen Registration</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#1D4ED8" }}>
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.636-6.364-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05 5.636 5.636" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: "#0F172A", letterSpacing: "-0.01em" }}>eSamanvaya</div>
            <div className="text-xs" style={{ color: "#64748B" }}>Government Digital Interoperability Platform</div>
          </div>
        </button>
        <div className="flex items-center gap-2 text-xs" style={{ color: "#0D9488", fontWeight: 500 }}>
          <svg width="14" height="14" fill="none" stroke="#0D9488" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span className="hidden sm:inline">Secured Connection</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
            <div className="px-7 pt-6 pb-5 border-b" style={{ borderColor: "#F1F5F9" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#EFF6FF" }}>
                  <svg width="14" height="14" fill="none" stroke="#1D4ED8" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                </div>
                <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Create Citizen Account</span>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#F1F5F9", color: "#64748B" }}>
                  Step {stepNum} of 3
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "#64748B" }}>{subtitle}</p>
            </div>

            <div className="px-7 py-6">
              <StepBar current={stepNum} />
              <h2 className="text-base font-semibold mb-5" style={{ color: "#0F172A" }}>{title}</h2>
              {children}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-4 flex items-start gap-3 px-2">
            <svg width="16" height="16" className="mt-0.5 flex-shrink-0" fill="none" stroke="#0D9488" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.953 11.953 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
              Your information is encrypted and stored securely. We do not share your personal data with unauthorised parties.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

const inputCls = "w-full rounded-lg border text-sm py-2.5 px-3 outline-none transition-all focus:ring-2 focus:ring-blue-100";
const inputStyle: React.CSSProperties = { borderColor: "#E2E8F0", color: "#0F172A", background: "#FAFAFA" };

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT — no nested component definitions
───────────────────────────────────────────────────────── */
export default function RegisterPage({ onNavigate, onRegister }: RegisterPageProps) {
  const [step, setStep] = useState(1);

  /* Step 1 */
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  /* Step 2 */
  const [aadhaarDigits, setAadhaarDigits] = useState(""); // always raw digits
  const [aadhaarFocused, setAadhaarFocused] = useState(false);
  const [aadhaarPhase, setAadhaarPhase] = useState<"input" | "authenticating" | "sending-otp" | "otp" | "verified">("input");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  /* Step 3 */
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [consent, setConsent] = useState(false);

  /* Global */
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ── Aadhaar display ── */
  const last4 = aadhaarDigits.slice(-4);
  const maskedDisplay =
    aadhaarDigits.length === 0
      ? ""
      : aadhaarFocused || aadhaarDigits.length < 12
      ? aadhaarDigits.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
      : `XXXX XXXX ${last4}`;

  function handleAadhaarInput(val: string) {
    const digits = val.replace(/[^\d]/g, "").slice(0, 12);
    setAadhaarDigits(digits);
  }

  /* ── Step 1 validation ── */
  function validateStep1() {
    if (!fullName.trim()) return "Please enter your full name.";
    if (!dob) return "Please enter your date of birth.";
    if (!gender) return "Please select your gender.";
    if (!email.trim() || !email.includes("@")) return "Please enter a valid email address.";
    if (!/^\d{10}$/.test(mobile)) return "Please enter a valid 10-digit mobile number.";
    return "";
  }

  function goNext1() {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError("");
    setStep(2);
  }

  /* ── Step 2: Verify Aadhaar → OTP ── */
  function handleVerifyAadhaar() {
    if (aadhaarDigits.length !== 12) { setError("Please enter a valid 12-digit Aadhaar number."); return; }
    setError("");
    setAadhaarPhase("authenticating");
    setTimeout(() => {
      setAadhaarPhase("sending-otp");
      setTimeout(() => setAadhaarPhase("otp"), 1400);
    }, 1800);
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setOtpError("");
    if (val && i < 5) document.getElementById(`reg-otp-${i + 1}`)?.focus();
  }

  function handleOtpKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`reg-otp-${i - 1}`)?.focus();
  }

  function handleVerifyOtp() {
    const entered = otp.join("");
    if (entered.length < 6) { setOtpError("Please enter all 6 digits."); return; }
    if (entered !== "123456") { setOtpError("Incorrect OTP. Use Demo OTP: 123456"); return; }
    setOtpError("");
    setAadhaarPhase("verified");
  }

  /* ── Step 3: Submit ── */
  function validateStep3() {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!consent) return "Please accept the consent to proceed.";
    return "";
  }

  async function handleFinalSubmit() {
    const err = validateStep3();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const result = await onRegister(
      {
        name: fullName.trim(),
        email: email.trim(),
        mobile: "+91 " + mobile.slice(0, 5) + " " + mobile.slice(5),
        dob: new Date(dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        gender,
        aadhaarLast4: last4 || "4521",
        accountCreated: dateStr,
      },
      password,
    );
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Registration failed. Please try again.");
      return;
    }
    onNavigate("language");
  }

  /* ── Password strength ── */
  const pwStrength =
    password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 8 ? 2
    : /[A-Z]/.test(password) && /\d/.test(password) ? 4
    : 3;
  const pwStrengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const pwStrengthColor = ["", "#DC2626", "#D97706", "#2563EB", "#0D9488"][pwStrength];

  /* ── Step titles / subtitles ── */
  const stepMeta = [
    { title: "Personal Information",  subtitle: "Enter your basic details to create your eSamanvaya account" },
    { title: "Aadhaar Verification",  subtitle: "Verify your Aadhaar identity to link your account securely" },
    { title: "Account Setup",         subtitle: "Create a secure password to protect your eSamanvaya account" },
  ];
  const { title, subtitle } = stepMeta[step - 1];

  return (
    <Shell onNavigate={onNavigate} stepNum={step} title={title} subtitle={subtitle}>

      {/* ══ STEP 1 — Personal Information ══ */}
      {step === 1 && (
        <div className="space-y-4">
          <Field label="Full Name" required>
            <input
              className={inputCls}
              style={inputStyle}
              placeholder="As per Aadhaar card"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date of Birth" required>
              <input
                type="date"
                className={inputCls}
                style={inputStyle}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </Field>
            <Field label="Gender" required>
              <select
                className={inputCls}
                style={inputStyle}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </Field>
          </div>

          <Field label="Email Address" required>
            <input
              type="email"
              className={inputCls}
              style={inputStyle}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Mobile Number" required>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium select-none"
                style={{ color: "#64748B" }}
              >+91</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                className={inputCls}
                style={{ ...inputStyle, paddingLeft: "42px" }}
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
              OTP will be sent to this number for Aadhaar verification
            </p>
          </Field>

          {error && <ErrorBox msg={error} />}

          <div className="flex justify-end pt-1">
            <button
              onClick={goNext1}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: "#1D4ED8" }}
            >
              Continue
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ══ STEP 2 — Aadhaar Verification ══ */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Prototype notice */}
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border text-xs"
            style={{ background: "#FFFBEB", borderColor: "#FDE68A", color: "#78350F" }}
          >
            <svg width="14" height="14" className="flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <div>
              <span className="font-semibold">Prototype / Sandbox Mode</span> — This verification is simulated for demonstration purposes. No connection to UIDAI or DigiLocker production databases.
            </div>
          </div>

          {/* ── Aadhaar input phase ── */}
          {aadhaarPhase === "input" && (
            <div className="space-y-4">
              <Field label="Aadhaar Number" required>
                <input
                  type="text"
                  inputMode="numeric"
                  className={inputCls}
                  style={{
                    ...inputStyle,
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    fontSize: "15px",
                  }}
                  placeholder="XXXX XXXX XXXX"
                  value={maskedDisplay}
                  onFocus={() => setAadhaarFocused(true)}
                  onBlur={() => setAadhaarFocused(false)}
                  onChange={(e) => handleAadhaarInput(e.target.value)}
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    12-digit Aadhaar number — masked after entry
                  </p>
                  <span className="text-xs font-medium" style={{ color: aadhaarDigits.length === 12 ? "#0D9488" : "#94A3B8" }}>
                    {aadhaarDigits.length}/12
                  </span>
                </div>
              </Field>

              <div
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border text-xs"
                style={{ background: "#F0F9FF", borderColor: "#BAE6FD", color: "#0C4A6E" }}
              >
                <svg width="14" height="14" className="flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                An OTP will be sent to <strong className="mx-1">+91 {mobile.slice(0, 5)} {mobile.slice(5)} ×××××</strong> registered with your Aadhaar.
              </div>

              {error && <ErrorBox msg={error} />}

              <div className="flex gap-3 justify-between">
                <button
                  onClick={() => { setStep(1); setError(""); }}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium border"
                  style={{ borderColor: "#E2E8F0", color: "#475569" }}
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyAadhaar}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: aadhaarDigits.length === 12 ? "#1D4ED8" : "#93C5FD" }}
                >
                  Verify Aadhaar
                  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── Authenticating / Sending OTP ── */}
          {(aadhaarPhase === "authenticating" || aadhaarPhase === "sending-otp") && (
            <div className="flex flex-col items-center py-10 gap-5">
              <div className="relative w-14 h-14">
                <div
                  className="w-14 h-14 rounded-full border-4 absolute inset-0"
                  style={{ borderColor: "#BFDBFE", borderTopColor: "#1D4ED8", animation: "spin 1s linear infinite" }}
                />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm" style={{ color: "#0F172A" }}>
                  {aadhaarPhase === "authenticating" ? "Authenticating…" : "Sending OTP…"}
                </div>
                <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                  {aadhaarPhase === "authenticating"
                    ? "Connecting to Aadhaar Sandbox for identity verification"
                    : `Sending a 6-digit OTP to +91 ${mobile.slice(0, 5)} XXXXX`}
                </p>
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}
              >
                Prototype / Sandbox
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* ── OTP entry ── */}
          {aadhaarPhase === "otp" && (
            <div className="space-y-4">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}
              >
                <svg width="16" height="16" fill="none" stroke="#1D4ED8" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: "#1D4ED8" }}>OTP sent to +91 {mobile.slice(0, 5)} XXXXX</div>
                  <div className="text-xs" style={{ color: "#64748B" }}>Check your registered mobile number</div>
                </div>
              </div>

              {/* Demo hint */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs"
                style={{ background: "#F0FDFA", borderColor: "#99F6E4", color: "#0F766E" }}
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <span className="font-medium">Demo OTP:</span>
                <span className="font-bold font-mono tracking-widest">123456</span>
              </div>

              <Field label="Enter 6-digit OTP" required>
                <OtpBoxes otp={otp} onChange={handleOtpChange} onKeyDown={handleOtpKey} />
              </Field>

              {otpError && <ErrorBox msg={otpError} />}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-xs font-medium"
                  style={{ color: "#1D4ED8" }}
                  onClick={() => { setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
                >
                  Resend OTP
                </button>
                <button
                  onClick={() => { setAadhaarPhase("input"); setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
                  className="text-xs"
                  style={{ color: "#94A3B8" }}
                >
                  Change Aadhaar
                </button>
              </div>

              <div className="flex gap-3 justify-between pt-1">
                <button
                  onClick={() => setAadhaarPhase("input")}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium border"
                  style={{ borderColor: "#E2E8F0", color: "#475569" }}
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOtp}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: "#1D4ED8" }}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}

          {/* ── Verified ── */}
          {aadhaarPhase === "verified" && (
            <div className="space-y-4">
              <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl border"
                style={{ background: "#F0FDFA", borderColor: "#99F6E4" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#0D9488" }}>
                  <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: "#0F766E" }}>Aadhaar Verified</div>
                  <div className="text-xs mt-0.5" style={{ color: "#0D9488" }}>
                    Identity confirmed · {maskedDisplay} · Mobile linked
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border divide-y" style={{ borderColor: "#E2E8F0" }}>
                {[
                  { label: "Aadhaar", value: maskedDisplay },
                  { label: "Name (from Aadhaar)", value: fullName },
                  { label: "Mobile linked", value: `+91 ${mobile.slice(0, 5)} XXXXX` },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between px-4 py-3 gap-3">
                    <span className="text-xs" style={{ color: "#94A3B8" }}>{r.label}</span>
                    <span className="text-sm font-medium font-mono" style={{ color: "#0F172A" }}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setStep(3); setError(""); }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: "#1D4ED8" }}
                >
                  Continue to Account Setup
                  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ STEP 3 — Account Setup ══ */}
      {step === 3 && (
        <div className="space-y-4">
          <Field label="Create Password" required>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                className={inputCls}
                style={{ ...inputStyle, paddingRight: "40px" }}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PwEye show={showPw} toggle={() => setShowPw((v) => !v)} />
            </div>
            {password.length > 0 && (
              <div className="mt-1.5 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{ background: n <= pwStrength ? pwStrengthColor : "#F1F5F9" }}
                    />
                  ))}
                </div>
                <div className="text-xs font-medium" style={{ color: pwStrengthColor }}>{pwStrengthLabel}</div>
              </div>
            )}
          </Field>

          <Field label="Confirm Password" required>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className={inputCls}
                style={{
                  ...inputStyle,
                  paddingRight: "40px",
                  borderColor: confirmPassword && confirmPassword !== password ? "#FECACA" : "#E2E8F0",
                }}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <PwEye show={showConfirm} toggle={() => setShowConfirm((v) => !v)} />
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="text-xs mt-1" style={{ color: "#DC2626" }}>Passwords do not match</p>
            )}
          </Field>

          {/* Consent */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer"
            style={{ borderColor: consent ? "#BFDBFE" : "#E2E8F0", background: consent ? "#EFF6FF" : "#FAFAFA" }}
            onClick={() => setConsent((v) => !v)}
          >
            <div
              className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
              style={{ borderColor: consent ? "#1D4ED8" : "#CBD5E1", background: consent ? "#1D4ED8" : "white" }}
            >
              {consent && (
                <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
            <p className="text-xs leading-relaxed select-none" style={{ color: "#334155" }}>
              I consent to eSamanvaya using my Aadhaar-verified identity and the information I have provided to authenticate my account and pre-fill eligible government service applications, in accordance with the{" "}
              <span className="font-semibold" style={{ color: "#1D4ED8" }}>Data Protection & Privacy Policy</span>.
            </p>
          </div>

          {/* Account summary */}
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "#F1F5F9" }}>
              <span className="text-xs font-semibold" style={{ color: "#64748B" }}>ACCOUNT SUMMARY</span>
            </div>
            <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
              {[
                { label: "Name", value: fullName },
                { label: "Email", value: email },
                { label: "Mobile", value: `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}` },
                { label: "Aadhaar", value: maskedDisplay },
                { label: "Aadhaar Status", value: "Verified ✓", green: true },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center px-4 py-2.5 gap-3">
                  <span className="text-xs" style={{ color: "#94A3B8" }}>{r.label}</span>
                  <span className="text-xs font-medium" style={{ color: r.green ? "#0D9488" : "#0F172A" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {error && <ErrorBox msg={error} />}

          <div className="flex gap-3 justify-between pt-1">
            <button
              onClick={() => { setStep(2); setError(""); }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium border"
              style={{ borderColor: "#E2E8F0", color: "#475569" }}
            >
              Back
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: submitting ? "#93C5FD" : "#1D4ED8" }}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account…
                </>
              ) : (
                <>
                  Create Account
                  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </Shell>
  );
}
