import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DEMO_USER_CREDENTIALS } from "../data/scheme";

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess?: () => void;
}

type LoginMethod = "password" | "otp";
type IdentifierType = "mobile" | "email" | "userid";

export default function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps) {
  const { login, loginWithOtp } = useAuth();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [identifierType, setIdentifierType] = useState<IdentifierType>("mobile");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const placeholders: Record<IdentifierType, string> = {
    mobile: "Enter 10-digit mobile number",
    email: "Enter registered email address",
    userid: "Enter User ID / Aadhaar-linked ID",
  };

  function handleOtpChange(index: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[index] = val.slice(-1);
    setOtp(next);
    if (val && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  }

  function handleOtpKey(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  function handleSendOtp() {
    if (!identifier) { setError("Please enter your mobile / email / user ID."); return; }
    setError("");
    setOtpSent(true);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier) { setError("Please enter your mobile / email / user ID."); return; }
    if (loginMethod === "password" && !password) { setError("Please enter your password."); return; }
    if (loginMethod === "otp" && otp.join("").length < 6) { setError("Please enter the 6-digit OTP."); return; }
    if (!captchaChecked) { setError("Please confirm you are not a robot."); return; }
    setError("");
    setLoading(true);
    const result =
      loginMethod === "otp"
        ? await loginWithOtp(identifier, otp.join(""))
        : await login(identifier, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Login failed. Please try again.");
      return;
    }
    onLoginSuccess?.();
    onNavigate("language");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F8FC", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#1E3A8A", color: "#BFDBFE" }} className="text-xs py-1.5 px-4 flex justify-between items-center">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-1.5 hover:text-white transition-colors">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </button>
        <span>Government of India — Secure Login Portal</span>
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
        <div className="flex items-center gap-2 text-xs" style={{ color: "#64748B" }}>
          <svg width="14" height="14" fill="none" stroke="#0D9488" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span className="hidden sm:inline" style={{ color: "#0D9488", fontWeight: 500 }}>Secured Connection</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
            {/* Card header */}
            <div className="px-7 pt-7 pb-5 border-b" style={{ borderColor: "#F1F5F9" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#EFF6FF" }}>
                  <svg width="14" height="14" fill="none" stroke="#1D4ED8" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>Citizen Login</span>
              </div>
              <p className="text-xs" style={{ color: "#64748B" }}>Access government services with your registered credentials</p>
            </div>

            <form onSubmit={handleLogin} className="px-7 py-6 space-y-5">
              {/* Identifier type tabs */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "#475569" }}>Login with</label>
                <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "#E2E8F0" }}>
                  {(["mobile", "email", "userid"] as IdentifierType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setIdentifierType(t)}
                      className="flex-1 py-2 text-xs font-medium transition-colors capitalize"
                      style={{
                        background: identifierType === t ? "#1D4ED8" : "white",
                        color: identifierType === t ? "white" : "#64748B",
                      }}
                    >
                      {t === "userid" ? "User ID" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Identifier input */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                  {identifierType === "mobile" ? "Mobile Number" : identifierType === "email" ? "Email Address" : "User ID"}
                </label>
                <div className="relative">
                  {identifierType === "mobile" && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#64748B" }}>+91</span>
                  )}
                  <input
                    type={identifierType === "email" ? "email" : "text"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={placeholders[identifierType]}
                    className="w-full rounded-lg border text-sm py-2.5 pr-3 outline-none transition-all focus:ring-2"
                    style={{
                      paddingLeft: identifierType === "mobile" ? "42px" : "12px",
                      borderColor: "#E2E8F0",
                      color: "#0F172A",
                      background: "#FAFAFA",
                    }}
                  />
                </div>
              </div>

              {/* Login method tabs */}
              <div>
                <div className="flex items-center gap-4 mb-3">
                  {(["password", "otp"] as LoginMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setLoginMethod(m); setOtpSent(false); setError(""); }}
                      className="flex items-center gap-1.5 text-xs font-medium pb-1 border-b-2 transition-colors"
                      style={{
                        borderColor: loginMethod === m ? "#1D4ED8" : "transparent",
                        color: loginMethod === m ? "#1D4ED8" : "#94A3B8",
                      }}
                    >
                      {m === "password" ? "Password" : "OTP Login"}
                    </button>
                  ))}
                </div>

                {loginMethod === "password" ? (
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border text-sm py-2.5 px-3 outline-none transition-all"
                      style={{ borderColor: "#E2E8F0", color: "#0F172A", background: "#FAFAFA", paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#94A3B8" }}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {showPassword
                          ? <><path strokeLinecap="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></>
                          : <><path strokeLinecap="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>}
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div>
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold border transition-colors"
                        style={{ borderColor: "#1D4ED8", color: "#1D4ED8", background: "#EFF6FF" }}
                      >
                        Send OTP
                      </button>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: "#475569" }}>Enter 6-digit OTP</label>
                        <div className="flex gap-2 justify-between">
                          {otp.map((digit, i) => (
                            <input
                              key={i}
                              id={`otp-${i}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(i, e.target.value)}
                              onKeyDown={(e) => handleOtpKey(i, e)}
                              className="w-10 h-11 text-center text-lg font-bold rounded-lg border outline-none transition-all"
                              style={{ borderColor: digit ? "#1D4ED8" : "#E2E8F0", background: digit ? "#EFF6FF" : "#FAFAFA", color: "#0F172A" }}
                            />
                          ))}
                        </div>
                        <button type="button" className="mt-2 text-xs" style={{ color: "#1D4ED8" }} onClick={() => { setOtp(["","","","","",""]); }}>
                          Resend OTP
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Captcha */}
              <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: "#E2E8F0", background: "#FAFAFA" }}>
                <button
                  type="button"
                  onClick={() => setCaptchaChecked(!captchaChecked)}
                  className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ borderColor: captchaChecked ? "#1D4ED8" : "#CBD5E1", background: captchaChecked ? "#1D4ED8" : "white" }}
                >
                  {captchaChecked && (
                    <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
                <span className="text-sm" style={{ color: "#334155" }}>I am not a robot</span>
                <div className="ml-auto flex flex-col items-center" style={{ color: "#94A3B8" }}>
                  <div className="text-lg leading-none">⟳</div>
                  <div className="text-xs">reCAPTCHA</div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Forgot password */}
              {loginMethod === "password" && (
                <div className="text-right">
                  <button type="button" className="text-xs font-medium" style={{ color: "#1D4ED8" }}>Forgot Password?</button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                style={{ background: loading ? "#93C5FD" : "#1D4ED8" }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating…
                  </>
                ) : "Login Securely"}
              </button>

              {/* Register link */}
              <div className="text-center text-xs" style={{ color: "#64748B" }}>
                New to eSamanvaya?{" "}
                <button
                  type="button"
                  className="font-semibold"
                  style={{ color: "#1D4ED8" }}
                  onClick={() => onNavigate("register")}
                >
                  Register here
                </button>
              </div>
            </form>
          </div>

          {/* Demo credentials hint */}
          <div
            className="mt-4 flex items-start gap-3 px-3 py-3 rounded-xl border text-xs"
            style={{ background: "#F0FDFA", borderColor: "#99F6E4", color: "#0F766E" }}
          >
            <svg width="14" height="14" className="flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <div>
              <span className="font-semibold">SIH Demo User:</span>{" "}
              {DEMO_USER_CREDENTIALS.email} / {DEMO_USER_CREDENTIALS.mobile} · Password: {DEMO_USER_CREDENTIALS.password}
            </div>
          </div>

          {/* Security info */}
          <div className="mt-4 flex items-start gap-3 px-2">
            <svg width="16" height="16" className="mt-0.5 flex-shrink-0" fill="none" stroke="#0D9488" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.953 11.953 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
              This is an official Government of India platform. Your login credentials are encrypted end-to-end. Government officials will never ask for your OTP or password.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
