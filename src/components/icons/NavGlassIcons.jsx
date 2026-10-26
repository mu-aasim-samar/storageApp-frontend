import React from "react";

/**
 * 🌟 Executive-Grade Liquid Glass Icons (Linear / Apple macOS Pro Aesthetic)
 * Precision geometric glass prisms with:
 * - Always-vivid signature dual-tone illuminated vectors (colors active at all times)
 * - Smoked frosted lens background with luminous tint
 * - Specular micro-bevel edge lighting
 * - Elevated ambient neon bloom on active state
 */

export function NavDriveIcon({ isActive = false, className = "w-8 h-8" }) {
  return (
    <div
      className={`relative ${className} shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-b from-cyan-500/25 to-indigo-600/25 border border-cyan-300/50 shadow-[0_0_16px_rgba(6,182,212,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] scale-105"
          : "bg-cyan-500/[0.12] dark:bg-cyan-500/[0.15] border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:border-cyan-400/40 hover:bg-cyan-500/[0.18]"
      }`}
    >
      {/* Specular top rim light */}
      <div className="absolute top-0.5 left-1.5 right-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full pointer-events-none" />

      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 transition-all duration-200"
      >
        <defs>
          <linearGradient id="driveLaserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {/* Server / Cloud Storage Chassis */}
        <rect
          x="3"
          y="4"
          width="18"
          height="7"
          rx="2"
          stroke="#38bdf8"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="text-cyan-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
        />
        <rect
          x="3"
          y="13"
          width="18"
          height="7"
          rx="2"
          stroke="#38bdf8"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="text-cyan-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
        />

        {/* Optical Data Slots */}
        <line
          x1="6.5"
          y1="7.5"
          x2="11.5"
          y2="7.5"
          stroke="url(#driveLaserGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="6.5"
          y1="16.5"
          x2="11.5"
          y2="16.5"
          stroke="url(#driveLaserGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Status Micro-LEDs */}
        <circle
          cx="17"
          cy="7.5"
          r="1"
          fill="#22d3ee"
          className={isActive ? "animate-pulse" : ""}
        />
        <circle
          cx="17"
          cy="16.5"
          r="1"
          fill="#4ade80"
        />
      </svg>
    </div>
  );
}

export function NavUpgradeIcon({ isActive = false, className = "w-8 h-8" }) {
  return (
    <div
      className={`relative ${className} shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-b from-rose-500/25 to-purple-600/25 border border-rose-300/50 shadow-[0_0_16px_rgba(244,63,94,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] scale-105"
          : "bg-rose-500/[0.12] dark:bg-rose-500/[0.15] border border-rose-400/30 shadow-[0_0_10px_rgba(244,63,94,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:border-rose-400/40 hover:bg-rose-500/[0.18]"
      }`}
    >
      {/* Specular top rim light */}
      <div className="absolute top-0.5 left-1.5 right-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full pointer-events-none" />

      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 transition-all duration-200"
      >
        <defs>
          <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Faceted Glass Diamond Prism */}
        <path
          d="M6 3.5 L18 3.5 L21.5 8.5 L12 20.5 L2.5 8.5 Z"
          stroke="url(#diamondGrad)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]"
        />
        <path
          d="M2.5 8.5 L21.5 8.5"
          stroke="#fb7185"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M12 20.5 L8.5 8.5 L10 3.5"
          stroke="#e879f9"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M12 20.5 L15.5 8.5 L14 3.5"
          stroke="#e879f9"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function NavUsersIcon({ isActive = false, className = "w-8 h-8" }) {
  return (
    <div
      className={`relative ${className} shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-b from-emerald-500/25 to-teal-600/25 border border-emerald-300/50 shadow-[0_0_16px_rgba(16,185,129,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] scale-105"
          : "bg-emerald-500/[0.12] dark:bg-emerald-500/[0.15] border border-emerald-400/30 shadow-[0_0_10px_rgba(16,185,129,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:border-emerald-400/40 hover:bg-emerald-500/[0.18]"
      }`}
    >
      {/* Specular top rim light */}
      <div className="absolute top-0.5 left-1.5 right-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full pointer-events-none" />

      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 transition-all duration-200"
      >
        <defs>
          <linearGradient id="usersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Primary User (Left / Foreground) */}
        <circle
          cx="9"
          cy="7"
          r="3.5"
          stroke="url(#usersGrad)"
          strokeWidth="1.6"
          className="drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]"
        />
        <path
          d="M3 18.5 C3 14.5 5.5 13 9 13 C12.5 13 15 14.5 15 18.5"
          stroke="url(#usersGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]"
        />

        {/* Secondary User (Right / Depth) */}
        <path
          d="M15.5 4.5 C16.5 5 17 6.2 17 7.5 C17 8.8 16.5 10 15.5 10.5"
          stroke="#34d399"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M17.5 13.5 C19.5 14.2 21 15.8 21 18.5"
          stroke="#34d399"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
