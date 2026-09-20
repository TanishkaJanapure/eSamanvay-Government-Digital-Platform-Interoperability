import { useState } from "react";

interface LanguagePageProps {
  onNavigate: (page: string, lang?: string) => void;
}

const LANGUAGES = [
  { code: "en", native: "English", script: "English", region: "All States" },
  { code: "mr", native: "मराठी", script: "Marathi", region: "Maharashtra" },
  { code: "hi", native: "हिन्दी", script: "Hindi", region: "Most States" },
  { code: "ta", native: "தமிழ்", script: "Tamil", region: "Tamil Nadu" },
  { code: "te", native: "తెలుగు", script: "Telugu", region: "Andhra Pradesh, Telangana" },
  { code: "kn", native: "ಕನ್ನಡ", script: "Kannada", region: "Karnataka" },
  { code: "ml", native: "മലയാളം", script: "Malayalam", region: "Kerala" },
  { code: "bn", native: "বাংলা", script: "Bengali", region: "West Bengal" },
  { code: "gu", native: "ગુજરાતી", script: "Gujarati", region: "Gujarat" },
  { code: "pa", native: "ਪੰਜਾਬੀ", script: "Punjabi", region: "Punjab" },
  { code: "or", native: "ଓଡ଼ିଆ", script: "Odia", region: "Odisha" },
  { code: "as", native: "অসমীয়া", script: "Assamese", region: "Assam" },
];

export default function LanguagePage({ onNavigate }: LanguagePageProps) {
  const [selected, setSelected] = useState("en");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: "#F5F8FC", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md" style={{ background: "#1D4ED8" }}>
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.636-6.364-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05 5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#0F172A", letterSpacing: "-0.01em" }}>eSamanvaya</h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>Government Digital Interoperability Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="px-6 pt-6 pb-5 border-b" style={{ borderColor: "#F1F5F9" }}>
            <h2 className="font-bold text-lg" style={{ color: "#0F172A", letterSpacing: "-0.01em" }}>Choose your language</h2>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>Select your preferred language to access government services.</p>
            <div className="mt-1 text-xs" style={{ color: "#94A3B8" }}>भाषा चुनें · भाषा निवडा · மொழியைத் தேர்ந்தெடுக்கவும்</div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelected(lang.code)}
                  className="relative flex flex-col items-start px-4 py-3.5 rounded-xl border transition-all text-left"
                  style={{
                    borderColor: selected === lang.code ? "#1D4ED8" : "#E2E8F0",
                    background: selected === lang.code ? "#EFF6FF" : "white",
                    boxShadow: selected === lang.code ? "0 0 0 3px #DBEAFE" : "none",
                  }}
                >
                  {selected === lang.code && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#1D4ED8" }}>
                      <svg width="9" height="9" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                  <span className="text-xl font-bold leading-none mb-1.5" style={{ color: selected === lang.code ? "#1D4ED8" : "#0F172A" }}>
                    {lang.native}
                  </span>
                  <span className="text-xs font-medium" style={{ color: "#64748B" }}>{lang.script}</span>
                  <span className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{lang.region}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 p-3.5 rounded-xl flex items-start gap-2.5" style={{ background: "#F0FDFA", border: "1px solid #CCFBF1" }}>
              <svg width="15" height="15" className="mt-0.5 flex-shrink-0" fill="none" stroke="#0D9488" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="text-xs leading-relaxed" style={{ color: "#0F7A73" }}>
                You can change the display language at any time from your dashboard settings. All government forms and certificates will be available in your chosen language.
              </p>
            </div>

            <button
              onClick={() => onNavigate("dashboard", selected)}
              className="mt-5 w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: "#1D4ED8" }}
            >
              Continue to Dashboard
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: "#94A3B8" }}>
          Supported in all 22 scheduled languages of the Constitution of India
        </p>
      </div>
    </div>
  );
}
