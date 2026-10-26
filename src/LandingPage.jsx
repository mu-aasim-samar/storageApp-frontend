import { Link, useNavigate } from "react-router-dom";
import { Database, Shield, Zap, Globe, ArrowRight, Lock, HardDrive, Users, Plus, Search, FolderPlus, Upload } from "lucide-react";
import { useTheme } from "./context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUser } from "./api/userApi";
import FileFolderIcon from "./components/icons/FileFolderIcon";
import { NavDriveIcon, NavUpgradeIcon, NavUsersIcon } from "./components/icons/NavGlassIcons";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Uploads",
    description:
      "Upload multiple files simultaneously with real-time speed tracking and instant server synchronization.",
    iconBg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.25)]",
  },
  {
    icon: Shield,
    title: "Enterprise Encryption",
    description:
      "Role-based security isolation, granular permissions, and encrypted session tokens protect every single file.",
    iconBg: "bg-indigo-500/15 border-indigo-500/30 text-indigo-400 shadow-[0_0_16px_rgba(99,102,241,0.25)]",
  },
  {
    icon: Globe,
    title: "Access Everywhere",
    description:
      "Seamless cross-device availability. Download, preview, share, and manage folders from anywhere on earth.",
    iconBg: "bg-sky-500/15 border-sky-500/30 text-sky-400 shadow-[0_0_16px_rgba(14,165,233,0.25)]",
  },
];

const stats = [
  { label: "Files Stored", value: "10M+" },
  { label: "Active Users", value: "50K+" },
  { label: "Uptime SLA", value: "99.9%" },
  { label: "Starter Storage", value: "15 GB" },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050608] text-slate-800 dark:text-slate-100 overflow-x-hidden font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* ── Soft Ambient Background Glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-cyan-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-48 w-[400px] h-[400px] rounded-full bg-indigo-500/[0.03] blur-[140px]" />
        <div className="absolute top-2/3 -left-48 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.03] blur-[140px]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-12 bg-white/80 dark:bg-[#06070a]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.07] transition-colors">
        <Link to="/landing" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          {/* Executive Luminous Glass Cube Logo */}
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-b from-cyan-400/35 via-indigo-500/25 to-slate-900/60 p-[1px] shadow-[0_0_16px_rgba(6,182,212,0.35)] shrink-0 transition-transform duration-300 group-hover:scale-105 border border-cyan-400/40">
            <div className="w-full h-full bg-[#0c1322]/90 backdrop-blur-md rounded-[10px] flex items-center justify-center">
              <Database className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
            </div>
            <div className="absolute top-0.5 left-1.5 right-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full pointer-events-none" />
          </div>
          <span className="font-extrabold text-[16px] sm:text-[17px] tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            MyDrive
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            to="/subscription"
            className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
          >
            Pricing
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent dark:hover:border-white/10 transition-all shrink-0"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          {isLoggedIn ? (
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white dark:text-slate-950 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-cyan-400 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all shadow-md shadow-cyan-500/25 dark:shadow-[0_2px_14px_rgba(6,182,212,0.4)] whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Open MyDrive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm font-bold text-white dark:text-slate-950 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-cyan-400 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all shadow-md shadow-cyan-500/25 dark:shadow-[0_2px_14px_rgba(6,182,212,0.4)] whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 sm:pt-30 pb-8 sm:pb-14 px-4 sm:px-6 lg:px-12 overflow-hidden z-10">
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 sm:mb-8 shadow-[0_0_16px_rgba(6,182,212,0.15)] animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
            Personal Cloud Storage Redefined
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-5 sm:mb-6 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            Your files,{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(6,182,212,0.25)]">
              everywhere
            </span>
            <br />you go
          </h1>

          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base md:text-lg leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
            MyDrive gives you a high-performance personal cloud space — upload files at lightning speed, organize
            folders, and manage everything with clean, dependable security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up w-full max-w-xs sm:max-w-none mx-auto" style={{ animationDelay: "0.15s" }}>
            {isLoggedIn ? (
              <Link
                to="/"
                className="group flex items-center justify-center gap-2 w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-cyan-400 text-white dark:text-slate-950 font-bold shadow-md shadow-cyan-500/25 dark:shadow-[0_4px_20px_rgba(6,182,212,0.4)] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
              >
                Open MyDrive
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group flex items-center justify-center gap-2 w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-cyan-400 text-white dark:text-slate-950 font-bold shadow-md shadow-cyan-500/25 dark:shadow-[0_4px_20px_rgba(6,182,212,0.4)] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-xl bg-white dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] transition-all duration-200 hover:-translate-y-0.5 shadow-sm whitespace-nowrap"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              Secure & encrypted
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20 hidden xs:block" />
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              15 GB free storage
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20 hidden xs:block" />
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              No credit card needed
            </div>
          </div>
        </div>

        {/* ── App preview mockup (Exact replica of user's MyDrive) ── */}
        <div className="relative max-w-4xl mx-auto mt-8 sm:mt-14 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/[0.08] shadow-2xl shadow-slate-900/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-white dark:bg-[#050608]">
            {/* Fake window chrome matching TopBar */}
            <div className="h-12 sm:h-14 bg-slate-100 dark:bg-[#06070a] border-b border-slate-200/50 dark:border-white/[0.07] flex items-center justify-between px-3 sm:px-4 gap-2">
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <div className="w-6 h-6 rounded-lg bg-[#0c1322] border border-cyan-400/40 flex items-center justify-center">
                    <Database className="w-3 h-3 text-cyan-300" />
                  </div>
                  <span className="font-extrabold text-xs text-white">MyDrive</span>
                </div>
              </div>

              {/* Fake Search bar - fully responsive, never pushes Upload out */}
              <div className="flex-1 min-w-0 max-w-[150px] xs:max-w-[200px] sm:max-w-xs mx-1 sm:mx-auto">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-200/50 dark:bg-white/[0.05] border border-slate-300/40 dark:border-white/[0.06] text-[11px] sm:text-xs text-slate-400">
                  <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                  <span className="truncate">Search files...</span>
                </div>
              </div>

              {/* Fake Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08]">
                  <FolderPlus className="w-3 h-3 text-cyan-400" />
                  <span>New Folder</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-sm shadow-cyan-500/30 shrink-0">
                  <Upload className="w-3 h-3 text-slate-950 shrink-0" />
                  <span>Upload</span>
                </div>
              </div>
            </div>

            {/* Fake app UI matching MyDrive clean dark palette */}
            <div className="bg-slate-50 dark:bg-[#050608] flex min-h-[19rem] sm:h-80 relative">
              {/* Sidebar mock (hidden on mobile, visible on desktop) */}
              <div className="hidden sm:flex flex-col justify-between w-48 border-r border-slate-200/50 dark:border-white/[0.07] p-3 bg-white/75 dark:bg-[#06070a]/90 shrink-0">
                <div className="space-y-1.5">
                  {/* Active My Drive */}
                  <div className="relative flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-indigo-500/[0.18] border border-indigo-400/35 text-white font-semibold text-xs shadow-[0_4px_16px_rgba(99,102,241,0.12)]">
                    <NavDriveIcon isActive={true} className="w-7 h-7" />
                    <span>My Drive</span>
                  </div>
                  {/* Upgrade Plan */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-slate-400 text-xs font-medium">
                    <NavUpgradeIcon className="w-7 h-7" />
                    <span>Upgrade Plan</span>
                  </div>
                  {/* Users */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-slate-400 text-xs font-medium">
                    <NavUsersIcon className="w-7 h-7" />
                    <span>Users</span>
                  </div>
                </div>

                {/* Storage meter */}
                <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1.5">
                    <span>STORAGE</span>
                    <span className="text-cyan-400">0.0%</span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full w-[12%] rounded-full" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5">64.75 KB of 1 GB used</p>
                </div>
              </div>

              {/* Content mock - Exact replica of user's drive items */}
              <div className="flex-1 p-3.5 sm:p-5 pb-16 sm:pb-6 overflow-hidden relative">
                {/* Breadcrumb pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 mb-3 sm:mb-4">
                  <div className="w-3.5 h-3.5 text-cyan-400">
                    <NavDriveIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>My Drive</span>
                </div>

                {/* FOLDERS section - balanced 2 columns */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FOLDERS</span>
                    <span className="text-[10px] font-bold text-cyan-400 bg-white/[0.06] px-1.5 py-0.2 rounded-full border border-white/[0.08]">2</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    <div className="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] p-2 sm:p-3 flex flex-col items-center justify-center hover:border-cyan-400/40 transition-colors">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center my-0.5 sm:my-1">
                        <FileFolderIcon isDirectory={true} name="New Folder" size="md" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-slate-200 mt-1 truncate max-w-full">New Folder</span>
                    </div>
                    <div className="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] p-2 sm:p-3 flex flex-col items-center justify-center hover:border-cyan-400/40 transition-colors">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center my-0.5 sm:my-1">
                        <FileFolderIcon isDirectory={true} name="Work Projects" size="md" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-slate-200 mt-1 truncate max-w-full">Work Projects</span>
                    </div>
                  </div>
                </div>

                {/* FILES section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FILES</span>
                    <span className="text-[10px] font-bold text-indigo-400 bg-white/[0.06] px-1.5 py-0.2 rounded-full border border-white/[0.08]">2</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    <div className="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] p-2 sm:p-3 flex flex-col items-center justify-center hover:border-cyan-400/40 transition-colors">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center my-0.5 sm:my-1">
                        <FileFolderIcon isDirectory={false} name="test22.webp" size="md" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-slate-200 mt-1 truncate max-w-full">test22.webp</span>
                    </div>
                    <div className="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] p-2 sm:p-3 flex flex-col items-center justify-center hover:border-cyan-400/40 transition-colors">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center my-0.5 sm:my-1">
                        <FileFolderIcon isDirectory={false} name="test.png" size="md" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-slate-200 mt-1 truncate max-w-full">test.png</span>
                    </div>
                  </div>
                </div>

                {/* Floating Action Button (FAB) replica - positioned with clear margin, zero overlap */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-10">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-8 sm:py-14 px-4 sm:px-6 lg:px-12 bg-white/60 dark:bg-[#06070a]/80 border-y border-slate-200/80 dark:border-white/[0.07] backdrop-blur-xl relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                {value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="pt-8 pb-4 sm:pt-20 sm:pb-12 px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              Everything you need in one place
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              MyDrive is engineered for velocity and bulletproof reliability. No bloat, just an ultra-clean, high-performance storage experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, title, description, iconBg }) => (
              <div
                key={title}
                className="group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] hover:border-cyan-400/40 dark:hover:border-cyan-400/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${iconBg} border flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="pt-4 pb-12 sm:pt-8 sm:pb-20 px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl bg-gradient-to-br from-cyan-950/20 via-[#06070a] to-indigo-950/20 border border-cyan-500/20 shadow-2xl p-6 sm:p-10 md:p-12 overflow-hidden backdrop-blur-2xl">
            {/* Ambient inner glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                {isLoggedIn ? "Continue to your drive" : "Ready to get started?"}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                {isLoggedIn
                  ? "Head over to your workspace to manage your files and folders securely."
                  : "Create your free account today and start uploading in seconds."}
              </p>
              {isLoggedIn ? (
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-cyan-400 text-white dark:text-slate-950 font-bold shadow-md shadow-cyan-500/25 dark:shadow-[0_4px_20px_rgba(6,182,212,0.4)] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Open MyDrive
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-cyan-400 text-white dark:text-slate-950 font-bold shadow-md shadow-cyan-500/25 dark:shadow-[0_4px_20px_rgba(6,182,212,0.4)] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Create free account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.07] bg-white/50 dark:bg-[#06070a]/90 py-8 px-4 sm:px-6 lg:px-12 backdrop-blur-xl relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0c1322] border border-cyan-400/40 flex items-center justify-center">
              <Database className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">MyDrive</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 MyDrive. High-performance cloud storage.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/subscription" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
              Pricing
            </Link>
            <Link to="/login" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
