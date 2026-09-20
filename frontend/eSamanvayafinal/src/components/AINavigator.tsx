import { useState, useRef, useEffect } from "react";
import { SERVICES, aiSearch, type AIMatch } from "../data/services";
import { IcSparkle, IcArrowRight, IcExternalLink, IcMic, IcX, IcInfo } from "./Icons";

const EXAMPLE_QUERIES = [
  "I am a student and want to apply for a scholarship",
  "I am a farmer looking for income support",
  "I need to get an income certificate for a scheme",
  "My family lost our breadwinner and we need help",
  "I want to register for employment exchange",
];

interface AINavigatorProps {
  onClose?: () => void;
  onGoTo?: (section: string) => void;
}

export default function AINavigator({ onClose, onGoTo }: AINavigatorProps) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [matches, setMatches] = useState<AIMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    if (!query.trim()) return;
    setLoading(true);
    setSubmitted(query.trim());
    setTimeout(() => {
      setMatches(aiSearch(query));
      setLoading(false);
    }, 900);
  }

  function handleExample(ex: string) {
    setQuery(ex);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleReset() {
    setQuery("");
    setSubmitted("");
    setMatches([]);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "#DBEAFE", background: "#EFF6FF" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#1D4ED8" }}
          >
            <IcSparkle size={15} stroke="white" />
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: "#1E3A8A" }}>AI Service Navigator</div>
            <div className="text-xs" style={{ color: "#3B82F6" }}>Describe your need in plain language</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
            style={{ color: "#3B82F6" }}
          >
            <IcX size={15} />
          </button>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Disclaimer */}
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-lg border text-xs"
          style={{ background: "white", borderColor: "#BFDBFE", color: "#1E40AF" }}
        >
          <IcInfo size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#3B82F6" } as React.CSSProperties} />
          <span>
            AI provides <strong>guidance only</strong> based on your description. Final eligibility for any scheme is determined exclusively by the concerned government authority.
          </span>
        </div>

        {/* Input area */}
        {!submitted ? (
          <div className="space-y-3">
            <div
              className="rounded-xl border bg-white overflow-hidden"
              style={{ borderColor: "#BFDBFE" }}
            >
              <textarea
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                placeholder="Describe your situation, e.g. &quot;I am a student from a low-income family and need financial support for college fees…&quot;"
                rows={3}
                className="w-full px-4 pt-3.5 pb-2 text-sm outline-none resize-none bg-transparent"
                style={{ color: "#0F172A" }}
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-xs" style={{ color: "#94A3B8" }}>
                  {query.length} chars &nbsp;·&nbsp; Press Enter to search
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-slate-50"
                    style={{ borderColor: "#E2E8F0", color: "#94A3B8" }}
                    title="Voice input (demo)"
                  >
                    <IcMic size={14} />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!query.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                    style={{ background: query.trim() ? "#1D4ED8" : "#93C5FD" }}
                  >
                    Find Services <IcArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Example queries */}
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "#64748B" }}>Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUERIES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleExample(ex)}
                    className="px-3 py-1.5 rounded-full text-xs border transition-colors hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                    style={{ borderColor: "#E2E8F0", color: "#475569", background: "white" }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Results state */
          <div className="space-y-4">
            {/* Query echo */}
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#F1F5F9" }}
              >
                <svg width="14" height="14" fill="none" stroke="#64748B" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
              </div>
              <div
                className="flex-1 px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "#F1F5F9", color: "#334155" }}
              >
                {submitted}
              </div>
              <button
                onClick={handleReset}
                className="flex-shrink-0 text-xs font-medium mt-1 hover:underline"
                style={{ color: "#1D4ED8" }}
              >
                Edit
              </button>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center gap-3 py-6 justify-center">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "#1D4ED8", animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: "#64748B" }}>Finding relevant services…</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold" style={{ color: "#64748B" }}>
                    POTENTIAL MATCHES &nbsp;·&nbsp; {matches.length} services found
                  </p>
                </div>

                <div className="space-y-3">
                  {matches.map((match) => {
                    const svc = SERVICES.find((s) => s.id === match.serviceId);
                    if (!svc) return null;
                    return (
                      <div
                        key={match.serviceId}
                        className="bg-white rounded-xl border p-4"
                        style={{ borderColor: "#E2E8F0" }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>
                                {svc.name}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  background: match.confidence === "High" ? "#F0FDFA" : "#FFF7ED",
                                  color: match.confidence === "High" ? "#0D9488" : "#C2410C",
                                  border: `1px solid ${match.confidence === "High" ? "#99F6E4" : "#FED7AA"}`,
                                }}
                              >
                                {match.confidence === "High" ? "Strong match" : "Possible match"}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: "#64748B" }}>{svc.department}</p>
                          </div>
                        </div>

                        {/* Why relevant */}
                        <div
                          className="flex items-start gap-2 px-3 py-2 rounded-lg mb-3"
                          style={{ background: "#F8FBFF", border: "1px solid #DBEAFE" }}
                        >
                          <IcSparkle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#3B82F6" } as React.CSSProperties} />
                          <p className="text-xs leading-relaxed" style={{ color: "#1E40AF" }}>
                            {match.reason}
                          </p>
                        </div>

                        {/* Eligibility snippet */}
                        <p className="text-xs mb-3 leading-relaxed" style={{ color: "#475569" }}>
                          <strong>Eligibility:</strong> {svc.eligibility}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                          {svc.integrated ? (
                            <button
                              onClick={() => onGoTo?.("apply-flow")}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                              style={{ background: "#1D4ED8" }}
                            >
                              Start Application <IcArrowRight size={12} />
                            </button>
                          ) : (
                            <a
                              href={svc.portalUrl ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-colors hover:bg-slate-50"
                              style={{ borderColor: "#CBD5E1", color: "#334155" }}
                            >
                              Official Portal <IcExternalLink size={12} />
                            </a>
                          )}
                          <button
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-slate-50"
                            style={{ borderColor: "#E2E8F0", color: "#64748B" }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Disclaimer repeat */}
                <div
                  className="flex items-start gap-2.5 px-4 py-3 rounded-lg border text-xs"
                  style={{ background: "#FFFBEB", borderColor: "#FDE68A", color: "#78350F" }}
                >
                  <IcInfo size={13} className="flex-shrink-0 mt-0.5" />
                  <span>
                    These are suggested services based on your description. AI guidance does not constitute official eligibility determination. Always verify your eligibility directly with the concerned government department.
                  </span>
                </div>

                <button
                  onClick={handleReset}
                  className="text-sm font-medium flex items-center gap-1.5"
                  style={{ color: "#1D4ED8" }}
                >
                  Ask a different question
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
