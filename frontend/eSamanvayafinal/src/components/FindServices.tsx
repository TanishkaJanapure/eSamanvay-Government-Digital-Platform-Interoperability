import { useState, useMemo } from "react";
import { SERVICES, CATEGORIES, type ServiceCategory, type Service } from "../data/services";
import {
  IcSearch, IcFilter, IcArrowRight, IcExternalLink,
  IcClock, IcCheck, IcSparkle, IcChevronDown, IcX,
} from "./Icons";
import AINavigator from "./AINavigator";

const CATEGORY_ICONS: Record<ServiceCategory, React.ReactNode> = {
  Education: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  Agriculture: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  Revenue: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  Welfare: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Certificates: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  ),
  Health: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Employment: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
};

const CATEGORY_COLORS: Record<ServiceCategory, { text: string; bg: string; border: string }> = {
  Education:   { text: "#1D4ED8", bg: "#EFF6FF",  border: "#BFDBFE" },
  Agriculture: { text: "#15803D", bg: "#F0FDF4",  border: "#BBF7D0" },
  Revenue:     { text: "#7C3AED", bg: "#F5F3FF",  border: "#DDD6FE" },
  Welfare:     { text: "#D97706", bg: "#FFFBEB",  border: "#FDE68A" },
  Certificates:{ text: "#0D9488", bg: "#F0FDFA",  border: "#99F6E4" },
  Health:      { text: "#DB2777", bg: "#FDF2F8",  border: "#FBCFE8" },
  Employment:  { text: "#334155", bg: "#F8FAFC",  border: "#E2E8F0" },
};

const APP_TYPE_LABELS: Record<string, string> = {
  Direct: "Integrated",
  Offline: "Offline Process",
  Portal: "External Portal",
};

function ServiceCard({ service, onStartApplication }: { service: Service; onStartApplication: () => void }) {
  const catColor = CATEGORY_COLORS[service.category];
  return (
    <div
      className="bg-white rounded-xl border flex flex-col transition-all hover:shadow-sm"
      style={{ borderColor: "#E2E8F0" }}
    >
      {/* Top */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}
            >
              <span style={{ color: catColor.text }}>{CATEGORY_ICONS[service.category]}</span>
              {service.category}
            </span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: service.integrated ? "#F0FDFA" : "#F8FAFC",
                color: service.integrated ? "#0D9488" : "#64748B",
                border: `1px solid ${service.integrated ? "#99F6E4" : "#E2E8F0"}`,
              }}
            >
              {service.integrated
                ? <IcCheck size={11} />
                : <IcExternalLink size={11} />}
              {APP_TYPE_LABELS[service.appType]}
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: "#0F172A" }}>
          {service.name}
        </h3>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#64748B" }}>
          {service.department}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
          {service.description}
        </p>
      </div>

      {/* Meta row */}
      <div className="px-5 py-3 border-t flex items-center gap-3" style={{ borderColor: "#F1F5F9" }}>
        <IcClock size={12} className="flex-shrink-0" style={{ color: "#94A3B8" } as React.CSSProperties} />
        <span className="text-xs flex-1" style={{ color: "#94A3B8" }}>{service.turnaround}</span>
      </div>

      {/* CTA */}
      <div className="px-5 pb-4">
        {service.integrated ? (
          <button
            onClick={onStartApplication}
            className="w-full py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
            style={{ background: "#1D4ED8" }}
          >
            Start Application <IcArrowRight size={13} />
          </button>
        ) : (
          <a
            href={service.portalUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors hover:bg-slate-50"
            style={{ borderColor: "#CBD5E1", color: "#334155" }}
          >
            Continue to Official Portal <IcExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function FindServices({ onGoTo }: { onGoTo?: (section: string) => void }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "All">("All");
  const [appTypeFilter, setAppTypeFilter] = useState<"All" | "Integrated" | "External">("All");
  const [deptFilter, setDeptFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      const matchType =
        appTypeFilter === "All" ||
        (appTypeFilter === "Integrated" && s.integrated) ||
        (appTypeFilter === "External" && !s.integrated);
      const matchDept = !deptFilter || s.department.toLowerCase().includes(deptFilter.toLowerCase());
      const matchQuery =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchType && matchDept && matchQuery;
    });
  }, [query, activeCategory, appTypeFilter, deptFilter]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
            Find Government Services
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {SERVICES.length} integrated and linked services across {CATEGORIES.length} categories
          </p>
        </div>
        <button
          onClick={() => setShowAI(!showAI)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: showAI ? "#1D4ED8" : "#EFF6FF",
            color: showAI ? "white" : "#1D4ED8",
            border: `1px solid ${showAI ? "#1D4ED8" : "#BFDBFE"}`,
          }}
        >
          <IcSparkle size={15} />
          AI Service Navigator
        </button>
      </div>

      {/* AI Navigator panel */}
      {showAI && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#BFDBFE", background: "#F8FBFF" }}>
          <AINavigator onClose={() => setShowAI(false)} onGoTo={onGoTo} />
        </div>
      )}

      {/* Search bar */}
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border bg-white"
          style={{ borderColor: "#E2E8F0" }}
        >
          <IcSearch size={17} className="flex-shrink-0 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What government service do you need? e.g. income certificate, scholarship…"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#0F172A" }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
              <IcX size={15} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:bg-slate-50"
          style={{
            borderColor: showFilters ? "#1D4ED8" : "#E2E8F0",
            color: showFilters ? "#1D4ED8" : "#475569",
            background: "white",
          }}
        >
          <IcFilter size={15} />
          <span className="hidden sm:inline">Filters</span>
          <IcChevronDown size={13} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border p-4 grid sm:grid-cols-2 gap-4" style={{ borderColor: "#E2E8F0" }}>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>Application Type</label>
            <div className="flex gap-2">
              {(["All", "Integrated", "External"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setAppTypeFilter(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                  style={{
                    background: appTypeFilter === t ? "#1D4ED8" : "white",
                    color: appTypeFilter === t ? "white" : "#475569",
                    borderColor: appTypeFilter === t ? "#1D4ED8" : "#E2E8F0",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>Filter by Department</label>
            <input
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              placeholder="e.g. Revenue, Municipal…"
              className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: "#E2E8F0", color: "#0F172A", background: "#F8FAFC" }}
            />
          </div>
        </div>
      )}

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory("All")}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors"
          style={{
            background: activeCategory === "All" ? "#0F172A" : "white",
            color: activeCategory === "All" ? "white" : "#475569",
            borderColor: activeCategory === "All" ? "#0F172A" : "#E2E8F0",
          }}
        >
          All Services
        </button>
        {CATEGORIES.map((cat) => {
          const c = CATEGORY_COLORS[cat];
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(active ? "All" : cat)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors"
              style={{
                background: active ? c.bg : "white",
                color: active ? c.text : "#475569",
                borderColor: active ? c.border : "#E2E8F0",
              }}
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center" style={{ color: active ? c.text : "#94A3B8" }}>
                {CATEGORY_ICONS[cat]}
              </span>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "#94A3B8" }}>
          {filtered.length} service{filtered.length !== 1 ? "s" : ""} found
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          {query ? ` matching "${query}"` : ""}
        </p>
        {(query || activeCategory !== "All" || appTypeFilter !== "All" || deptFilter) && (
          <button
            onClick={() => { setQuery(""); setActiveCategory("All"); setAppTypeFilter("All"); setDeptFilter(""); }}
            className="text-xs font-medium"
            style={{ color: "#1D4ED8" }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Service cards grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              onStartApplication={() => onGoTo?.("apply-flow")}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
            <IcSearch size={22} className="text-slate-400" />
          </div>
          <p className="font-medium text-sm" style={{ color: "#334155" }}>No services match your search</p>
          <p className="text-sm mt-1 max-w-sm" style={{ color: "#94A3B8" }}>
            Try a different keyword or remove a filter. You can also use the AI Navigator to describe your need in plain language.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ background: "#F8FAFC", borderColor: "#E2E8F0" }}
      >
        <svg width="15" height="15" className="flex-shrink-0 mt-0.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9.75" />
          <path strokeLinecap="round" d="M12 8.25v.008M12 11.25v4.5" />
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
          Services marked <strong>Integrated</strong> can be applied for directly through eSamanvaya with your consent. Services marked <strong>External Portal</strong> are not yet integrated — eSamanvaya will redirect you to the official government portal. Eligibility is always determined by the concerned department.
        </p>
      </div>
    </div>
  );
}
