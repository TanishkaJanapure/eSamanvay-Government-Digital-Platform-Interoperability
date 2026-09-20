import { useState } from "react";

interface OfficerLoginProps {
  onNavigate: (page: string) => void;
}

type AuthStep = "credentials" | "otp" | "authenticating";

const DEMO_USERS = [
  { id: "OFF-441-PUNE", name: "Anjali Mehta", role: "Scrutiny Officer", dept: "Social Justice & Special Assistance" },
  { id: "OFF-318-PUNE", name: "Ravi Kumar", role: "Verification Officer", dept: "Revenue Department" },
];

export default function OfficerLogin({ onNavigate }: OfficerLoginProps) {
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<AuthStep>("credentials");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(DEMO_USERS[0]);

  function handleCredentialSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!officerId.trim() || !password.trim()) { setError("Please enter your Officer ID and password."); return; }
    setError("");
    setStep("otp");
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) {
      const el = document.getElementById(`otp-off-${i + 1}`);
      el?.focus();
    }
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      document.getElementById(`otp-off-${i - 1}`)?.focus();
    }
  }

  function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filled = otp.join("");
    if (filled.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setError("");
    setStep("authenticating");
    setTimeout(() => onNavigate("officer"), 2000);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F5F8FC", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Gov top bar */}
      <div className="h-8 flex items-center px-6 text-xs font-medium text-white" style={{ background: "#1D4ED8" }}>
        <span>Government of Maharashtra · National e-Governance Division</span>
        <span className="ml-auto">Helpline: 1800-233-0001</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b flex items-center px-6 h-14" style={{ borderColor: "#E2E8F0" }}>
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1D4ED8" }}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.636-6.364-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05 5.636 5.636" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-sm leading-tight" style={{ color: "#0F172A" }}>eSamanvaya</div>
            <div className="text-xs" style={{ color: "#94A3B8" }}>Government Digital Interoperability Platform</div>
          </div>
        </button>
        <div className="ml-auto">
          <button
            onClick={() => onNavigate("login")}
            className="text-xs font-medium"
            style={{ color: "#64748B" }}
          >
            Citizen Login →
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-5">
          {/* Demo notice */}
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
            <svg width="16" height="16" className="flex-shrink-0 mt-0.5" fill="none" stroke="#D97706" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#92400E" }}>Prototype Demo — No real credentials required</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#92400E" }}>
                This is a design prototype. Use any Officer ID + password, or use the quick-fill below. No government systems are accessed.
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
            {/* Card header */}
            <div className="px-6 py-5 border-b" style={{ borderColor: "#F1F5F9", background: "#FAFCFF" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#EFF6FF" }}>
                  <svg width="20" height="20" fill="none" stroke="#1D4ED8" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-semibold text-base" style={{ color: "#0F172A" }}>Government Officer Portal</h1>
                  <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                    {step === "credentials" ? "Authorised personnel only" : step === "otp" ? "Enter OTP sent to registered mobile" : "Verifying credentials…"}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                {[{ n: 1, label: "Credentials" }, { n: 2, label: "OTP" }].map((s, i) => {
                  const isDone = (s.n === 1 && step !== "credentials") || (s.n === 2 && step === "authenticating");
                  const isActive = (s.n === 1 && step === "credentials") || (s.n === 2 && (step === "otp" || step === "authenticating"));
                  return (
                    <div key={s.n} className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: isDone ? "#0D9488" : isActive ? "#1D4ED8" : "#F1F5F9",
                          color: (isDone || isActive) ? "white" : "#94A3B8",
                        }}
                      >
                        {isDone ? (
                          <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : s.n}
                      </div>
                      <span className="text-xs font-medium" style={{ color: isActive ? "#0F172A" : "#94A3B8" }}>{s.label}</span>
                      {i === 0 && <div className="flex-1 h-px mx-1" style={{ background: step !== "credentials" ? "#0D9488" : "#E2E8F0", minWidth: "32px" }} />}
                    </div>
                  );
                })}
              </div>

              {/* Quick-fill demo users */}
              {step === "credentials" && (
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: "#94A3B8" }}>Quick fill (demo)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_USERS.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => { setOfficerId(u.id); setPassword("demo1234"); setSelectedUser(u); }}
                        className="px-3 py-2.5 rounded-xl border text-left transition-colors hover:bg-slate-50"
                        style={{ borderColor: officerId === u.id ? "#1D4ED8" : "#E2E8F0", background: officerId === u.id ? "#EFF6FF" : "white" }}
                      >
                        <div className="text-xs font-semibold" style={{ color: "#0F172A" }}>{u.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>{u.role}</div>
                        <div className="text-xs font-mono mt-0.5" style={{ color: "#94A3B8" }}>{u.id}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                  <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H2.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0L21.303 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-xs" style={{ color: "#DC2626" }}>{error}</p>
                </div>
              )}

              {/* Step 1: Credentials */}
              {step === "credentials" && (
                <form onSubmit={handleCredentialSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#334155" }}>Officer ID</label>
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder="e.g. OFF-441-PUNE"
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                      style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#93C5FD"; }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#334155" }}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none pr-10"
                        style={{ borderColor: "#E2E8F0", color: "#0F172A" }}
                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#93C5FD"; }}
                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: "#94A3B8" }}
                      >
                        {showPassword ? (
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: "#1D4ED8" }}
                  >
                    Continue to OTP Verification
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {step === "otp" && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="px-4 py-3 rounded-xl" style={{ background: "#F0FDFA", border: "1px solid #99F6E4" }}>
                    <p className="text-xs font-semibold" style={{ color: "#0D9488" }}>OTP sent</p>
                    <p className="text-xs mt-0.5" style={{ color: "#115E59" }}>
                      A 6-digit OTP has been sent to the registered mobile of <strong>{selectedUser.name}</strong> ({selectedUser.id}).
                      <br /><span className="font-semibold">For this demo, enter any 6 digits.</span>
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-off-${i}`}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-11 h-12 text-center text-lg font-bold rounded-xl border outline-none transition-colors"
                        style={{ borderColor: digit ? "#1D4ED8" : "#E2E8F0", color: "#0F172A", background: digit ? "#EFF6FF" : "white" }}
                        maxLength={1}
                      />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep("credentials"); setOtp(["","","","","",""]); setError(""); }}
                      className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:bg-slate-50"
                      style={{ borderColor: "#E2E8F0", color: "#64748B" }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: "#1D4ED8" }}
                    >
                      Verify & Login
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Authenticating */}
              {step === "authenticating" && (
                <div className="py-6 flex flex-col items-center gap-4">
                  <div className="relative w-14 h-14">
                    <svg className="animate-spin" width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <circle cx="28" cy="28" r="22" stroke="#E2E8F0" strokeWidth="4" />
                      <path d="M28 6a22 22 0 0122 22" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="20" height="20" fill="none" stroke="#1D4ED8" strokeWidth="1.75" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>Authenticating…</p>
                    <p className="text-xs mt-1" style={{ color: "#64748B" }}>Verifying credentials with NIC Identity Services</p>
                    <p className="text-xs mt-1 font-semibold" style={{ color: "#D97706" }}>Prototype — No real authentication</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-center" style={{ color: "#CBD5E1" }}>
            Authorised government personnel only · Unauthorised access is a criminal offence under IT Act 2000
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center" style={{ borderTop: "1px solid #E2E8F0" }}>
        <p className="text-xs" style={{ color: "#94A3B8" }}>
          eSamanvaya · Government Digital Interoperability Platform · Prototype v1.0
        </p>
      </footer>
    </div>
  );
}
