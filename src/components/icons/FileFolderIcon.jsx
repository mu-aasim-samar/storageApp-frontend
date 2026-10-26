import React from "react";

/**
 * Apple VisionOS 3D Liquid Glass Color Themes
 */
const FOLDER_THEMES = [
  {
    name: "sapphire",
    backTop: "#38bdf8",
    backMid: "#0284c7",
    backBottom: "#0369a1",
    frontGlassTop: "rgba(56, 189, 248, 0.72)",
    frontGlassMid: "rgba(14, 165, 233, 0.82)",
    frontGlassBottom: "rgba(3, 105, 161, 0.94)",
    glow: "rgba(14, 165, 233, 0.5)",
    specular: "#bae6fd",
    lipLight: "#ffffff",
    accent: "#0ea5e9",
  },
  {
    name: "emerald",
    backTop: "#34d399",
    backMid: "#059669",
    backBottom: "#047857",
    frontGlassTop: "rgba(52, 211, 153, 0.72)",
    frontGlassMid: "rgba(16, 185, 129, 0.82)",
    frontGlassBottom: "rgba(4, 120, 87, 0.94)",
    glow: "rgba(16, 185, 129, 0.5)",
    specular: "#a7f3d0",
    lipLight: "#ffffff",
    accent: "#10b981",
  },
  {
    name: "amethyst",
    backTop: "#c084fc",
    backMid: "#7c3aed",
    backBottom: "#5b21b6",
    frontGlassTop: "rgba(192, 132, 252, 0.72)",
    frontGlassMid: "rgba(124, 58, 237, 0.82)",
    frontGlassBottom: "rgba(91, 33, 182, 0.94)",
    glow: "rgba(124, 58, 237, 0.5)",
    specular: "#e9d5ff",
    lipLight: "#ffffff",
    accent: "#8b5cf6",
  },
  {
    name: "coral",
    backTop: "#fb7185",
    backMid: "#e11d48",
    backBottom: "#be123c",
    frontGlassTop: "rgba(251, 113, 133, 0.72)",
    frontGlassMid: "rgba(225, 29, 72, 0.82)",
    frontGlassBottom: "rgba(190, 18, 60, 0.94)",
    glow: "rgba(225, 29, 72, 0.5)",
    specular: "#fecdd3",
    lipLight: "#ffffff",
    accent: "#f43f5e",
  },
  {
    name: "amber",
    backTop: "#fcd34d",
    backMid: "#d97706",
    backBottom: "#b45309",
    frontGlassTop: "rgba(252, 211, 77, 0.72)",
    frontGlassMid: "rgba(217, 119, 6, 0.82)",
    frontGlassBottom: "rgba(180, 83, 9, 0.94)",
    glow: "rgba(217, 119, 6, 0.5)",
    specular: "#fef3c7",
    lipLight: "#ffffff",
    accent: "#f59e0b",
  },
  {
    name: "cyan",
    backTop: "#22d3ee",
    backMid: "#0891b2",
    backBottom: "#0e7490",
    frontGlassTop: "rgba(34, 211, 238, 0.72)",
    frontGlassMid: "rgba(8, 145, 178, 0.82)",
    frontGlassBottom: "rgba(14, 116, 144, 0.94)",
    glow: "rgba(8, 145, 178, 0.5)",
    specular: "#cffafe",
    lipLight: "#ffffff",
    accent: "#06b6d4",
  },
];

export function getFolderTheme(name = "") {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % FOLDER_THEMES.length;
  return FOLDER_THEMES[hash];
}

export function detectFileType(filename = "") {
  const ext = (filename || "").split(".").pop().toLowerCase();
  switch (ext) {
    case "pdf":
      return "pdf";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "svg":
    case "bmp":
    case "ico":
      return "image";
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
    case "webm":
      return "video";
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
    case "m4a":
    case "aac":
      return "audio";
    case "zip":
    case "rar":
    case "tar":
    case "gz":
    case "7z":
      return "archive";
    case "xls":
    case "xlsx":
    case "csv":
      return "sheet";
    case "doc":
    case "docx":
    case "txt":
    case "rtf":
    case "md":
      return "document";
    case "ppt":
    case "pptx":
      return "presentation";
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "html":
    case "css":
    case "py":
    case "java":
    case "go":
    case "rs":
    case "json":
    case "sql":
      return "code";
    default:
      return "alt";
  }
}

/**
 * 3D Apple VisionOS Liquid Glass Folder
 * Features realistic 3D perspective, physical U-fold spine, specular glare, and internal paper depth.
 */
export function ModernFolderIcon({ name = "", size = "md", className = "" }) {
  const theme = getFolderTheme(name);
  const uid = React.useId().replace(/:/g, "");

  const isSm = size === "sm"; // List view
  const isLg = size === "lg"; // Grid hero

  if (isSm) {
    return (
      <div
        className={`relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${className}`}
        style={{ width: 40, height: 32 }}
      >
        <svg viewBox="0 0 46 36" fill="none" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id={`sm-back-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.backTop} />
              <stop offset="100%" stopColor={theme.backBottom} />
            </linearGradient>
            <linearGradient id={`sm-front-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.frontGlassTop} />
              <stop offset="100%" stopColor={theme.frontGlassBottom} />
            </linearGradient>
          </defs>

          {/* Back tab & body */}
          <path
            d="M 4 8 C 4 5 6 3 9.5 3 L 18.5 3 C 21 3 23 4.5 24.5 6.5 L 26.5 8.5 C 27.5 9.5 29 10 31 10 L 40 10 C 42.5 10 44.5 12 44.5 14.5 L 44.5 31 C 44.5 33.5 42.5 35 40 35 L 7 35 C 4.5 35 2 33 2 30.5 L 2 13 C 2 9.5 4 8 4 8 Z"
            fill={`url(#sm-back-${uid})`}
          />
          {/* Peeking paper */}
          <rect x="9" y="7" width="28" height="12" rx="2" fill="#ffffff" fillOpacity="0.9" />
          {/* Translucent Front Pocket */}
          <path
            d="M 2 15 C 2 12.5 4.5 11 7 11 L 40 11 C 42.5 11 44.5 12.5 44.5 15 L 44.5 31 C 44.5 33.5 42.5 35 40 35 L 6.5 35 C 4 35 2 33 2 30.5 Z"
            fill={`url(#sm-front-${uid})`}
          />
          {/* Specular Rim */}
          <line x1="6" y1="12" x2="41" y2="12" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Hero Grid View (Grand 3D Apple VisionOS Glass Folder)
  const width = isLg ? 88 : 58;
  const height = isLg ? 72 : 48;

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-1.5 ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 100 82"
        fill="none"
        className="w-full h-full"
        style={{
          filter: `drop-shadow(0 16px 32px ${theme.glow}) drop-shadow(0 6px 12px rgba(0,0,0,0.35))`,
        }}
      >
        <defs>
          {/* Backplate 3D Depth Gradient */}
          <linearGradient id={`back-depth-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.backTop} />
            <stop offset="40%" stopColor={theme.backMid} />
            <stop offset="100%" stopColor={theme.backBottom} />
          </linearGradient>

          {/* Front Liquid Glass Panel Gradient */}
          <linearGradient id={`front-liquid-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.frontGlassTop} />
            <stop offset="45%" stopColor={theme.frontGlassMid} />
            <stop offset="100%" stopColor={theme.frontGlassBottom} />
          </linearGradient>

          {/* 3D Curved Glass Optical Rim Light */}
          <linearGradient id={`rim-glare-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor={theme.specular} stopOpacity="0.9" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>

          {/* Diagonal Refractive Glass Glare */}
          <linearGradient id={`glass-sheen-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* Internal Document Shadow */}
          <filter id={`paper-depth-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ── 1. Back Tab & Backplate with 3D Bevel ── */}
        <path
          d="M 8 16 C 8 9.5 12.5 5 19 5 L 38 5 C 42.5 5 46.5 7.8 49 11.5 L 53 17 C 55 19.5 58 21 62 21 L 87 21 C 93 21 97 25 97 31 L 97 68 C 97 74.5 92 79 85 79 L 14 79 C 7 79 2 74.5 2 68 L 2 24 C 2 17.5 6 16 8 16 Z"
          fill={`url(#back-depth-${uid})`}
        />

        {/* Tab Specular Edge */}
        <path
          d="M 19 6.5 L 38 6.5 C 42 6.5 45.5 9 48 12.5 L 52 18 C 54 20.5 57 22 61 22 L 86 22"
          stroke="#ffffff"
          strokeOpacity="0.75"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* ── 2. Peeking Internal Documents (Physical Layer) ── */}
        <g filter={`url(#paper-depth-${uid})`}>
          {/* Back Paper (tilted slightly for 3D realism) */}
          <rect
            x="18"
            y="11"
            width="64"
            height="32"
            rx="5"
            fill="#ffffff"
            fillOpacity="0.75"
            transform="rotate(-1.5 50 27)"
          />
          {/* Front Crisp Document */}
          <rect
            x="20"
            y="13"
            width="60"
            height="30"
            rx="5"
            fill="#ffffff"
            fillOpacity="0.95"
          />
          {/* Document typography lines */}
          <line x1="28" y1="20" x2="48" y2="20" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="28" y1="25" x2="66" y2="25" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="28" y1="29" x2="58" y2="29" stroke="#e2e8f0" strokeWidth="1.4" strokeLinecap="round" />
        </g>

        {/* ── 3. Front Liquid Glass Flap with 3D Lean Angle ── */}
        <path
          d="M 3 34 C 3 28 8 24 14 24 L 86 24 C 92 24 97 28 97 34 L 97 69 C 97 75 92 80 86 80 L 14 80 C 8 80 3 75 3 69 Z"
          fill={`url(#front-liquid-${uid})`}
        />

        {/* Diagonal Optical Light Refraction Sheen */}
        <path
          d="M 4 34 C 4 29 8 25 14 25 L 60 25 L 34 80 L 14 80 C 8 80 4 75 4 69 Z"
          fill={`url(#glass-sheen-${uid})`}
        />

        {/* Crisp Glowing Glass Top Rim Specular */}
        <path
          d="M 13 25 L 87 25"
          stroke={`url(#rim-glare-${uid})`}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Physical 3D U-Fold Bottom Glass Spine Highlight */}
        <path
          d="M 14 79 L 86 79"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Apple Center Glass Clasp */}
        <rect
          x="44"
          y="27"
          width="12"
          height="3.5"
          rx="1.75"
          fill="#ffffff"
          fillOpacity="0.5"
        />
      </svg>
    </div>
  );
}

/**
 * 3D Apple VisionOS Glass Document Icon
 */
export function ModernFileIcon({ name = "", size = "md", className = "" }) {
  const type = detectFileType(name);
  const ext = (name.split(".").pop() || "").toUpperCase().slice(0, 4);
  const uid = React.useId().replace(/:/g, "");

  const isSm = size === "sm";
  const isLg = size === "lg";

  const config = {
    image: {
      from: "#c084fc",
      mid: "#ec4899",
      to: "#f43f5e",
      glow: "rgba(236, 72, 153, 0.45)",
      badgeBg: "#db2777",
    },
    video: {
      from: "#38bdf8",
      mid: "#3b82f6",
      to: "#6366f1",
      glow: "rgba(59, 130, 246, 0.45)",
      badgeBg: "#2563eb",
    },
    sheet: {
      from: "#34d399",
      mid: "#10b981",
      to: "#047857",
      glow: "rgba(16, 185, 129, 0.45)",
      badgeBg: "#059669",
    },
    code: {
      from: "#334155",
      mid: "#0f172a",
      to: "#020617",
      glow: "rgba(56, 189, 248, 0.4)",
      badgeBg: "#0284c7",
    },
    pdf: {
      from: "#fb7185",
      mid: "#e11d48",
      to: "#9f1239",
      glow: "rgba(225, 29, 72, 0.45)",
      badgeBg: "#be123c",
    },
    archive: {
      from: "#fcd34d",
      mid: "#f59e0b",
      to: "#b45309",
      glow: "rgba(245, 158, 11, 0.45)",
      badgeBg: "#d97706",
    },
    audio: {
      from: "#f472b6",
      mid: "#d946ef",
      to: "#9333ea",
      glow: "rgba(217, 70, 239, 0.45)",
      badgeBg: "#c026d3",
    },
    document: {
      from: "#60a5fa",
      mid: "#2563eb",
      to: "#1d4ed8",
      glow: "rgba(37, 99, 235, 0.45)",
      badgeBg: "#1d4ed8",
    },
    presentation: {
      from: "#fdba74",
      mid: "#f97316",
      to: "#c2410c",
      glow: "rgba(249, 115, 22, 0.45)",
      badgeBg: "#ea580c",
    },
    alt: {
      from: "#94a3b8",
      mid: "#64748b",
      to: "#334155",
      glow: "rgba(100, 116, 139, 0.35)",
      badgeBg: "#475569",
    },
  }[type] || {
    from: "#94a3b8",
    mid: "#64748b",
    to: "#334155",
    glow: "rgba(100, 116, 139, 0.35)",
    badgeBg: "#475569",
  };

  if (isSm) {
    return (
      <div
        className={`relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${className}`}
        style={{ width: 34, height: 34 }}
      >
        <svg viewBox="0 0 38 46" fill="none" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id={`sm-f-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.from} />
              <stop offset="100%" stopColor={config.to} />
            </linearGradient>
          </defs>
          <path
            d="M 5 6 C 5 3.5 7 1.5 9.5 1.5 L 24 1.5 L 34 11.5 L 34 39.5 C 34 42 32 44 29.5 44 L 9.5 44 C 7 44 5 42 5 39.5 Z"
            fill={`url(#sm-f-${uid})`}
          />
          <path d="M 24 1.5 L 24 9.5 C 24 10.5 25 11.5 26 11.5 L 34 11.5 Z" fill="#ffffff" fillOpacity="0.45" />
          <text
            x="19"
            y="30"
            fill="#ffffff"
            fontSize="8.5"
            fontWeight="bold"
            letterSpacing="0.6"
            textAnchor="middle"
          >
            {ext || "FILE"}
          </text>
        </svg>
      </div>
    );
  }

  // Hero Grid View (Grand 3D Glass Document)
  const width = isLg ? 76 : 54;
  const height = isLg ? 90 : 64;

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-1.5 ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 78 96"
        fill="none"
        className="w-full h-full"
        style={{
          filter: `drop-shadow(0 16px 30px ${config.glow}) drop-shadow(0 6px 12px rgba(0,0,0,0.35))`,
        }}
      >
        <defs>
          <linearGradient id={`fb-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.from} />
            <stop offset="50%" stopColor={config.mid} />
            <stop offset="100%" stopColor={config.to} />
          </linearGradient>

          <linearGradient id={`fsheen-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id={`fdeg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* ── Document Body with Folded Top Right ── */}
        <path
          d="M 8 11 C 8 5.5 12.5 1 18 1 L 52 1 L 73 22 L 73 84 C 73 89.5 68.5 94 63 94 L 18 94 C 12.5 94 8 89.5 8 84 Z"
          fill={`url(#fb-${uid})`}
        />

        {/* Diagonal Optical Glare */}
        <path
          d="M 8 11 C 8 6 12 2 17 2 L 52 2 L 25 94 L 18 94 C 12 94 8 90 8 84 Z"
          fill={`url(#fsheen-${uid})`}
        />

        {/* Top & Left Bevel Stroke */}
        <path d="M 18 2 L 51 2" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 9 13 L 9 82" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round" />

        {/* 3D Folded Dog-Ear Corner */}
        <path d="M 52 1 L 52 22 L 73 22 Z" fill="#000000" fillOpacity="0.3" />
        <path d="M 52 1 L 52 18 C 52 20.2 53.8 22 56 22 L 73 22 Z" fill={`url(#fdeg-${uid})`} />

        {/* High-Fidelity Type Glyphs */}
        {type === "video" && (
          <g transform="translate(23, 29)">
            <circle cx="16" cy="16" r="16" fill="#ffffff" fillOpacity="0.22" />
            <circle cx="16" cy="16" r="15" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
            <circle cx="16" cy="16" r="11" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
            <polygon points="13,9 23,16 13,23" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
          </g>
        )}

        {type === "sheet" && (
          <g transform="translate(20, 28)">
            <rect x="0" y="0" width="38" height="32" rx="6" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1" />
            <rect x="0" y="0" width="38" height="9" rx="5" fill="#ffffff" fillOpacity="0.35" />
            <line x1="0" y1="16.5" x2="38" y2="16.5" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
            <line x1="0" y1="24.5" x2="38" y2="24.5" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
            <line x1="13" y1="0" x2="13" y2="32" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
            <line x1="25.5" y1="0" x2="25.5" y2="32" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
          </g>
        )}

        {type === "code" && (
          <g transform="translate(19, 27)">
            <rect x="0" y="0" width="40" height="33" rx="7" fill="#020617" fillOpacity="0.75" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="1" />
            <circle cx="7" cy="7" r="2.2" fill="#ff5f56" />
            <circle cx="13" cy="7" r="2.2" fill="#ffbd2e" />
            <circle cx="19" cy="7" r="2.2" fill="#27c93f" />
            <line x1="0" y1="12" x2="40" y2="12" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.8" />
            <path d="M 12 18 L 6 22.5 L 12 27" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 28 18 L 34 22.5 L 28 27" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="22" y1="16" x2="18" y2="29" stroke="#6ee7b7" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}

        {type === "pdf" && (
          <g transform="translate(20, 27)">
            <rect x="0" y="0" width="38" height="32" rx="6" fill="#ffffff" fillOpacity="0.18" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
            <line x1="8" y1="8" x2="30" y2="8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="8" y1="14" x2="26" y2="14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
            <line x1="8" y1="20" x2="30" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
            <line x1="8" y1="26" x2="20" y2="26" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.6" />
          </g>
        )}

        {type === "archive" && (
          <g transform="translate(26, 24)">
            <rect x="8" y="0" width="10" height="26" rx="2" fill="#ffffff" fillOpacity="0.25" />
            <line x1="8" y1="4" x2="18" y2="4" stroke="#ffffff" strokeWidth="2" />
            <line x1="8" y1="9" x2="18" y2="9" stroke="#ffffff" strokeWidth="2" />
            <line x1="8" y1="14" x2="18" y2="14" stroke="#ffffff" strokeWidth="2" />
            <line x1="8" y1="19" x2="18" y2="19" stroke="#ffffff" strokeWidth="2" />
            <rect x="5" y="21" width="16" height="12" rx="3.5" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
            <circle cx="13" cy="27" r="2.5" fill="#b45309" />
          </g>
        )}

        {type === "audio" && (
          <g transform="translate(20, 31)">
            <rect x="3" y="10" width="4.5" height="15" rx="2.2" fill="#ffffff" />
            <rect x="11.5" y="3" width="4.5" height="22" rx="2.2" fill="#ffffff" />
            <rect x="20" y="8" width="4.5" height="17" rx="2.2" fill="#ffffff" />
            <rect x="28.5" y="13" width="4.5" height="12" rx="2.2" fill="#ffffff" />
          </g>
        )}

        {(type === "image" || type === "document" || type === "presentation" || type === "alt") && (
          <g transform="translate(21, 30)">
            <line x1="4" y1="4" x2="32" y2="4" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="4" y1="12" x2="28" y2="12" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.85" />
            <line x1="4" y1="20" x2="32" y2="20" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.85" />
            <line x1="4" y1="28" x2="20" y2="28" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.6" />
          </g>
        )}

        {/* Frosted Acrylic Pill */}
        <g transform="translate(15, 69)">
          <rect
            x="0"
            y="0"
            width="48"
            height="18"
            rx="9"
            fill="#ffffff"
            fillOpacity="0.96"
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.25))"
          />
          <text
            x="24"
            y="12.5"
            fill={config.badgeBg}
            fontSize="9"
            fontWeight="900"
            letterSpacing="0.8"
            textAnchor="middle"
          >
            {ext || "FILE"}
          </text>
        </g>
      </svg>
    </div>
  );
}

/**
 * Universal Master Icon Component
 */
export default function FileFolderIcon({
  isDirectory = false,
  name = "",
  size = "md",
  className = "",
}) {
  if (isDirectory) {
    return <ModernFolderIcon name={name} size={size} className={className} />;
  }
  return <ModernFileIcon name={name} size={size} className={className} />;
}
