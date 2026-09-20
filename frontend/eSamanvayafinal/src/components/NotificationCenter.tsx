import { useState } from "react";
import { IcCheck, IcInfo, IcBell, IcArrowRight } from "./Icons";

type NotifType = "status" | "document" | "confirmation" | "message" | "security";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  appId?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFS: Notification[] = [
  {
    id: "n1",
    type: "confirmation",
    title: "Application Submitted — ESM2026001234",
    body: "Your application for Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC/EWS) was successfully submitted to MahaDBT via the Directorate of Technical Education.",
    time: "26 Nov 2024 · 11:42 AM",
    read: false,
    appId: "ESM2026001234",
    actionLabel: "Track Application",
  },
  {
    id: "n2",
    type: "status",
    title: "Application Under Scrutiny",
    body: "ESM2026001234 — Your scholarship application has been received and is now under initial scrutiny by the department officer. No action required from your end.",
    time: "26 Nov 2024 · 2:15 PM",
    read: false,
    appId: "ESM2026001234",
    actionLabel: "View Timeline",
  },
  {
    id: "n3",
    type: "document",
    title: "Bank Account Required — ESM2026001234",
    body: "PFMS data retrieval failed during your application. Please provide your bank account number and IFSC code for Direct Benefit Transfer of the scholarship amount.",
    time: "26 Nov 2024 · 3:00 PM",
    read: false,
    appId: "ESM2026001234",
    actionLabel: "Add Bank Details",
  },
  {
    id: "n4",
    type: "status",
    title: "Income Certificate Approved — AP-2024-8821",
    body: "Your Income Certificate application has been approved by the Revenue Department, Pune. The document is available for download in My Documents.",
    time: "12 Nov 2024 · 4:30 PM",
    read: true,
    appId: "AP-2024-8821",
    actionLabel: "Download Certificate",
  },
  {
    id: "n5",
    type: "document",
    title: "Consent Request from Civil Supplies Department",
    body: "Civil Supplies Department has requested access to your household composition data for ration card annual renewal verification. This consent is valid for 30 days.",
    time: "5 Nov 2024 · 10:15 AM",
    read: true,
    actionLabel: "Review Consent",
  },
  {
    id: "n6",
    type: "message",
    title: "DigiLocker Sync Completed",
    body: "4 new documents were detected in your DigiLocker and are now accessible via eSamanvaya. Caste Certificate (Oct 2024) and Birth Certificate are now linked.",
    time: "3 Nov 2024 · 9:00 AM",
    read: true,
  },
  {
    id: "n7",
    type: "security",
    title: "Login from New Device",
    body: "A login to your eSamanvaya account was detected from a new device (Chrome, Windows 11, Pune, MH). If this was not you, change your password immediately.",
    time: "1 Nov 2024 · 8:47 AM",
    read: true,
    actionLabel: "Review Security",
  },
  {
    id: "n8",
    type: "status",
    title: "Birth Certificate Application Submitted — AP-2024-9105",
    body: "Your application for a Birth Certificate has been submitted to the Municipal Corporation, Pune. You will be notified at each stage.",
    time: "21 Nov 2024 · 10:34 AM",
    read: true,
    appId: "AP-2024-9105",
    actionLabel: "Track Application",
  },
];

const TYPE_META: Record<NotifType, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  status: {
    label: "Status Update",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    icon: (
      <svg width="15" height="15" fill="none" stroke="#1D4ED8" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  document: {
    label: "Action Required",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: (
      <svg width="15" height="15" fill="none" stroke="#D97706" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  confirmation: {
    label: "Confirmation",
    color: "#0D9488",
    bg: "#F0FDFA",
    border: "#99F6E4",
    icon: <IcCheck size={15} stroke="#0D9488" />,
  },
  message: {
    label: "Service Message",
    color: "#64748B",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    icon: <IcInfo size={15} stroke="#64748B" />,
  },
  security: {
    label: "Security Alert",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    icon: (
      <svg width="15" height="15" fill="none" stroke="#DC2626" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 2.25l8.25 3v5.625C20.25 16.088 16.725 20.7 12 21.75 7.275 20.7 3.75 16.088 3.75 10.875V5.25L12 2.25z" />
      </svg>
    ),
  },
};

type FilterType = "all" | NotifType | "unread";

export default function NotificationCenter({ onGoTo }: { onGoTo?: (s: string) => void }) {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<FilterType>("all");

  const unreadCount = notifs.filter((n) => !n.read).length;

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const filtered = notifs.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "all") return true;
    return n.type === filter;
  });

  const filterOptions: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: `Unread (${unreadCount})` },
    { id: "status", label: "Status Updates" },
    { id: "document", label: "Action Required" },
    { id: "confirmation", label: "Confirmations" },
    { id: "security", label: "Security" },
    { id: "message", label: "Messages" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Notifications</h1>
            {unreadCount > 0 && (
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: "#DC2626" }}
              >
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Application updates, consent requests, and important service messages</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg border hover:bg-slate-50 transition-colors"
            style={{ borderColor: "#E2E8F0", color: "#1D4ED8" }}
          >
            <IcCheck size={13} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              background: filter === opt.id ? "#0F172A" : "white",
              color: filter === opt.id ? "white" : "#64748B",
              borderColor: filter === opt.id ? "#0F172A" : "#E2E8F0",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
              <IcBell size={22} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium" style={{ color: "#334155" }}>No notifications</p>
            <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>You're all caught up.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const meta = TYPE_META[n.type];
            return (
              <div
                key={n.id}
                className="rounded-xl border overflow-hidden transition-all"
                style={{
                  background: n.read ? "white" : "#FAFCFF",
                  borderColor: n.read ? "#E2E8F0" : "#BFDBFE",
                  borderLeft: n.read ? `3px solid #E2E8F0` : `3px solid #1D4ED8`,
                }}
              >
                <div className="flex items-start gap-3.5 px-4 py-4">
                  {/* Type icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
                  >
                    {meta.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {!n.read && (
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#1D4ED8" }} />
                        )}
                        <span
                          className="text-sm leading-snug"
                          style={{ color: "#0F172A", fontWeight: n.read ? 500 : 600 }}
                        >
                          {n.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs" style={{ color: "#CBD5E1" }}>{n.time}</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium hidden sm:inline-block"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#64748B" }}>{n.body}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {n.actionLabel && (
                        <button
                          onClick={() => {
                            markRead(n.id);
                            if (n.appId) onGoTo?.("my-applications");
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold"
                          style={{ color: "#1D4ED8" }}
                        >
                          {n.actionLabel} <IcArrowRight size={12} />
                        </button>
                      )}
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="flex items-center gap-1 text-xs"
                          style={{ color: "#94A3B8" }}
                        >
                          <IcCheck size={11} /> Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-center" style={{ color: "#CBD5E1" }}>
          {filtered.length} notification{filtered.length !== 1 ? "s" : ""} shown · Notifications are retained for 90 days
        </p>
      )}
    </div>
  );
}
