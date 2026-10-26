import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCheck } from "lucide-react";
import { getActivities, markActivitiesAsRead } from "../api/activityApi";

/**
 * 🌟 Executive Liquid Glass Activity Icons
 */
function GlassBellIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="actBellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="url(#actBellGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
      />
      <path
        d="M13.73 21a2 2 0 01-3.46 0"
        stroke="#38bdf8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="5" r="2" fill="#22d3ee" className="animate-pulse" />
    </svg>
  );
}

function GlassUploadIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="actUploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <path
        d="M4 16.5v1.5a2.5 2.5 0 002.5 2.5h11a2.5 2.5 0 002.5-2.5v-1.5"
        stroke="url(#actUploadGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 3.5v11m0-11l-4 4m4-4l4 4"
        stroke="#34d399"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]"
      />
    </svg>
  );
}

function GlassDeleteIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="actTrashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
      </defs>
      <path
        d="M4 7h16M10 11v6M14 11v6"
        stroke="url(#actTrashGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="drop-shadow-[0_0_6px_rgba(251,113,133,0.8)]"
      />
      <path
        d="M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
        stroke="#fb7185"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlassEditIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="actEditGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke="url(#actEditGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="#fbbf24"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
      />
    </svg>
  );
}

function GlassFolderPlusIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="actFolderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path
        d="M2 7.5A2.5 2.5 0 014.5 5h3.293a1 1 0 01.707.293L10.5 7.5H20a2 2 0 012 2v9a2 2 0 01-2 2H4.5A2.5 2.5 0 012 18.5v-11z"
        stroke="url(#actFolderGrad)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 11v6m-3-3h6"
        stroke="#c084fc"
        strokeWidth="2"
        strokeLinecap="round"
        className="drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]"
      />
    </svg>
  );
}

function GlassClockIcon({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="actClockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="url(#actClockGrad)"
        strokeWidth="1.8"
        className="drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
      />
      <path
        d="M12 7v5l3 2"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function getActionConfig(action) {
  switch (action) {
    case "FILE_UPLOAD":
      return {
        icon: GlassUploadIcon,
        label: "uploaded",
        containerStyle:
          "bg-emerald-500/15 border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
      };
    case "FILE_DELETE":
    case "DIRECTORY_DELETE":
      return {
        icon: GlassDeleteIcon,
        label: "deleted",
        containerStyle:
          "bg-rose-500/15 border-rose-400/30 shadow-[0_0_12px_rgba(244,63,94,0.25)]",
      };
    case "FILE_RENAME":
    case "DIRECTORY_RENAME":
      return {
        icon: GlassEditIcon,
        label: "renamed",
        containerStyle:
          "bg-amber-500/15 border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      };
    case "DIRECTORY_CREATE":
      return {
        icon: GlassFolderPlusIcon,
        label: "created folder",
        containerStyle:
          "bg-indigo-500/15 border-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]",
      };
    default:
      return {
        icon: GlassBellIcon,
        label: "modified",
        containerStyle:
          "bg-cyan-500/15 border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]",
      };
  }
}

export default function ActivityDrawer({
  isOpen,
  onClose,
  onUnreadCountChange,
  targetUserId,
}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivitiesList = async () => {
    setLoading(true);
    try {
      const data = await getActivities(targetUserId);
      setActivities(data.activities || []);
      if (onUnreadCountChange) onUnreadCountChange(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch activities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchActivitiesList();
    }
  }, [isOpen, targetUserId]);

  const handleMarkAllRead = async () => {
    try {
      await markActivitiesAsRead();
      setActivities((prev) => prev.map((a) => ({ ...a, isRead: true })));
      if (onUnreadCountChange) onUnreadCountChange(0);
    } catch (err) {
      console.error("Failed to mark activities as read", err);
    }
  };

  if (!isOpen) return null;

  // Mount directly to document.body to prevent any parent header clipping or stacking issues
  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in overflow-hidden">
      {/* Dimmed & Frosted Glass Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Liquid Glass Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#0d1322] dark:bg-[#090d16] text-white border-l border-white/10 shadow-[-16px_0_48px_rgba(0,0,0,0.7)] flex flex-col z-10 animate-slide-left overflow-hidden">
        {/* Specular Edge Highlight */}
        <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-400/50 via-white/20 to-transparent pointer-events-none" />

        {/* ── Header ── */}
        <div className="p-4 px-5 border-b border-white/[0.08] bg-[#111827]/90 backdrop-blur-2xl flex items-center justify-between shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_14px_rgba(6,182,212,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]">
              <GlassBellIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Activity & Notifications
              </h3>
              <p className="text-[11px] text-slate-400">
                Drive changes and admin actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all shadow-sm group"
            >
              <CheckCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>
            <button
              onClick={onClose}
              title="Close drawer"
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-400/40 transition-all shadow-sm group"
            >
              <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
            </button>
          </div>
        </div>

        {/* ── Content list ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-18 rounded-2xl bg-white/[0.04] border border-white/[0.06] shimmer"
                />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center px-4">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <GlassClockIcon className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-white">
                No recent activity
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Any changes made by you or an admin will show up here in real time.
              </p>
            </div>
          ) : (
            activities.map((act) => {
              const config = getActionConfig(act.action);
              const ActionIcon = config.icon;
              return (
                <div
                  key={act._id}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 relative group overflow-hidden ${
                    !act.isRead
                      ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/10 border-indigo-400/40 shadow-[0_0_16px_rgba(99,102,241,0.25)]"
                      : "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20"
                  }`}
                >
                  {/* Subtle top edge glint */}
                  <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border backdrop-blur-md ${config.containerStyle}`}
                    >
                      <ActionIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white">
                          <span
                            className={
                              act.actorDisplay === "Admin"
                                ? "text-cyan-400 font-bold"
                                : "text-indigo-300"
                            }
                          >
                            {act.actorDisplay}
                          </span>{" "}
                          <span className="font-normal text-slate-400">
                            {config.label}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {formatTimeAgo(act.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-200 truncate mt-1">
                        {act.itemName}
                      </p>
                      {act.details && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {act.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
