import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronRight, Database, X } from "lucide-react";
import { fetchUser } from "../../api/userApi";
import {
  NavDriveIcon,
  NavUpgradeIcon,
  NavUsersIcon,
} from "../icons/NavGlassIcons";

const baseNavItems = [
  {
    icon: NavDriveIcon,
    label: "My Drive",
    href: "/",
    roles: null,
  },
  {
    icon: NavUpgradeIcon,
    label: "Upgrade Plan",
    href: "/subscription",
    roles: null,
  },
  {
    icon: NavUsersIcon,
    label: "Users",
    href: "/users",
    roles: ["owner", "Owner", "admin", "manager", "Admin", "Manager"],
  },
];

const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0 || isNaN(bytes)) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Screen size check: desktop vs mobile
  const [isDesktop, setIsDesktop] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth >= 1024 : true;
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. Sidebar Width & Collapsed State (Desktop only)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem("sidebar_width");
    return saved ? parseInt(saved, 10) : 240;
  });

  const [isResizing, setIsResizing] = useState(false);

  // Effective collapsed: NEVER collapse on mobile
  const effectiveCollapsed = isDesktop && isCollapsed;

  const loadUser = () => {
    fetchUser()
      .then((u) => setUser(u || null))
      .catch(() => setUser(null));
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("storageUpdated", loadUser);
    return () => window.removeEventListener("storageUpdated", loadUser);
  }, []);

  // 2. Keyboard shortcut: Ctrl + B (Desktop ONLY)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (!isDesktop) return; // Strict desktop-only functionality!

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => {
          const next = !prev;
          localStorage.setItem("sidebar_collapsed", next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDesktop]);

  // 3. Mouse Drag Resizing (Desktop ONLY)
  const startResizing = (e) => {
    if (!isDesktop) return;
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !isDesktop) return;

      let newWidth = e.clientX;

      if (newWidth < 140) {
        setIsCollapsed(true);
        localStorage.setItem("sidebar_collapsed", "true");
      } else {
        setIsCollapsed(false);
        localStorage.setItem("sidebar_collapsed", "false");

        if (newWidth < 200) newWidth = 200;
        if (newWidth > 420) newWidth = 420;
        setWidth(newWidth);
        localStorage.setItem("sidebar_width", newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, isDesktop]);

  const userRole = user?.role ?? null;

  const navItems = baseNavItems.filter(
    ({ roles }) => !roles || roles.includes(userRole),
  );

  // Storage Calculations
  const used = user?.usedStorageInBytes || 0;
  const max = user?.maxStorageInBytes || 1;
  const percentage = Math.min((used / max) * 100, 100).toFixed(1);
  const usedFormatted = formatBytes(used);
  const maxFormatted = formatBytes(max);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        style={
          isDesktop
            ? { width: effectiveCollapsed ? "72px" : `${width}px` }
            : undefined
        }
        className={[
          isDesktop
            ? "relative h-full flex flex-col z-30 shrink-0 border-r border-slate-200/80 dark:border-white/[0.07] bg-white/75 dark:bg-[#06070a]/90 backdrop-blur-2xl shadow-xl"
            : "fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 flex flex-col bg-white dark:bg-[#06070a] border-r border-slate-200 dark:border-white/10 shadow-2xl transition-transform duration-300 ease-in-out",
          !isDesktop && (isOpen ? "translate-x-0" : "-translate-x-full"),
          isResizing
            ? "transition-none select-none"
            : "transition-all duration-200 ease-in-out",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ── Logo ── */}
        <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-slate-200/50 dark:border-white/[0.08]">
          <Link
            to="/landing"
            className={`flex items-center gap-3 hover:opacity-90 transition-all ${
              effectiveCollapsed ? "justify-center w-full" : ""
            }`}
          >
            {/* Executive Luminous Glass Cube Logo */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-b from-cyan-400/35 via-indigo-500/25 to-slate-900/60 p-[1px] shadow-[0_0_16px_rgba(6,182,212,0.35)] shrink-0 transition-transform duration-300 hover:scale-105 border border-cyan-400/40">
              <div className="w-full h-full bg-[#0c1322]/90 backdrop-blur-md rounded-[10px] flex items-center justify-center">
                <Database className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              </div>
              <div className="absolute top-0.5 left-1.5 right-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full pointer-events-none" />
            </div>
            {!effectiveCollapsed && (
              <span className="font-extrabold text-[17px] tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent truncate">
                MyDrive
              </span>
            )}
          </Link>

          {/* Close button for mobile */}
          {!isDesktop && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav
          className={`flex-1 px-3 py-4 space-y-1.5 ${
            effectiveCollapsed
              ? "overflow-visible"
              : "overflow-y-auto overflow-x-hidden no-scrollbar"
          }`}
        >
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive =
              href === "/"
                ? location.pathname === "/" ||
                  location.pathname.startsWith("/directory")
                : location.pathname.startsWith(href);

            return (
              <div key={href} className="relative group">
                <Link
                  to={href}
                  onClick={() => {
                    if (!isDesktop) onClose();
                  }}
                  className={[
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
                    effectiveCollapsed
                      ? "justify-center px-0 w-11 h-11 mx-auto"
                      : "",
                    isActive
                      ? "bg-indigo-500/[0.14] dark:bg-indigo-500/[0.18] border border-indigo-500/30 dark:border-indigo-400/35 text-indigo-950 dark:text-white font-semibold shadow-[0_4px_16px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.06] border border-transparent hover:border-slate-300/60 dark:hover:border-white/[0.06]",
                  ].join(" ")}
                >
                  {/* Subtle top edge specular glint when active */}
                  {isActive && (
                    <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 dark:via-white/50 to-transparent rounded-full" />
                  )}

                  {/* Executive-grade Glass Icon */}
                  <Icon isActive={isActive} className="w-8 h-8" />
                  {!effectiveCollapsed && (
                    <span className="truncate tracking-wide">{label}</span>
                  )}
                </Link>

                {/* Tooltip in collapsed mode */}
                {effectiveCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/90 text-white backdrop-blur-xl border border-white/10 text-xs font-semibold rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 whitespace-nowrap flex items-center">
                    {label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900/90" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Storage meter (Liquid Glass Capsule) ── */}
        <div className="p-3 border-t border-slate-200/50 dark:border-white/[0.08] shrink-0">
          {effectiveCollapsed ? (
            <div className="flex flex-col items-center group relative cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-slate-100/60 dark:bg-white/[0.05] backdrop-blur-md flex items-center justify-center text-[11px] font-bold text-indigo-600 dark:text-cyan-400 shadow-sm border border-slate-200/60 dark:border-white/[0.08]">
                {percentage}%
              </div>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/90 text-white backdrop-blur-xl border border-white/10 text-xs font-semibold rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 whitespace-nowrap flex items-center">
                {usedFormatted} of {maxFormatted} ({percentage}%)
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-100/60 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200/60 dark:border-white/[0.08] shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Storage
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-400">
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-white/[0.08] rounded-full h-2 overflow-hidden p-[1px]">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-2 truncate font-medium">
                {usedFormatted} of {maxFormatted} used
              </p>
            </div>
          )}
        </div>

        {/* ── Draggable Edge (Resizer Handle) ── */}
        <div
          onMouseDown={startResizing}
          className={`hidden lg:block absolute top-0 right-0 w-1.5 h-full cursor-col-resize transition-colors z-40 hover:bg-indigo-500/50 ${
            isResizing ? "bg-indigo-500 w-1.5" : "bg-transparent"
          }`}
          title="Drag to resize (Ctrl+B to collapse)"
        />
      </aside>
    </>
  );
}

export default Sidebar;
