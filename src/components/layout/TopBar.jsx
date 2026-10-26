import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Sun,
  Moon,
  LayoutGrid,
  List,
  FolderPlus,
  Upload,
  ChevronRight,
  LogOut,
  User,
  HardDrive,
  Shield,
  X,
  Bell,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { fetchUser, logoutUser, logoutAllSessions } from "../../api/userApi";
import { getActivities } from "../../api/activityApi";
import { useTheme } from "../../context/ThemeContext";
import ActivityDrawer from "../ActivityDrawer";
import CancelSubscriptionModal from "../CancelSubscriptionModal";

function TopBar({
  directoryName,
  currentPath = [],
  onCreateFolderClick,
  onUploadFilesClick,
  disabled,
  onMenuToggle,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
}) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const loadUserData = () => {
      fetchUser()
        .then((data) => {
          setUser(data);
          setAvatarError(false);
        })
        .catch(() => setUser(null));
    };

    loadUserData();

    getActivities()
      .then((data) => setUnreadCount(data.unreadCount || 0))
      .catch(() => {});

    window.addEventListener("storageUpdated", loadUserData);
    return () => window.removeEventListener("storageUpdated", loadUserData);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
    setShowUserMenu(false);
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
    setShowUserMenu(false);
  };

  const isRoot = !directoryName || directoryName === "My Drive";

  return (
    <header className="h-16 flex items-center justify-between gap-3 px-4 lg:px-6 shrink-0 border-b border-slate-200/50 dark:border-white/[0.07] bg-white/70 dark:bg-[#06070a]/80 backdrop-blur-2xl z-20">
      {/* ── Left Side (Mobile Only) ── */}
      <div className="flex items-center gap-2 lg:hidden shrink-0">
        {/* ── Hamburger (mobile) ── */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Drive Logo for Mobile */}
        <div className="flex items-center gap-2 px-1">
          <HardDrive className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
          <span className="font-bold text-slate-800 dark:text-white text-sm">MyDrive</span>
        </div>
      </div>

      {/* ── Search (Frosted Glass Capsule) ── */}
      <div className="flex-1 max-w-md lg:max-w-lg hidden md:flex items-center min-w-0 mx-2 lg:mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search files, folders and documents…"
            className="w-full pl-10 pr-9 py-2 text-sm rounded-xl bg-slate-100/70 dark:bg-white/[0.05] text-slate-800 dark:text-slate-100 placeholder-slate-400/80 border border-slate-200/60 dark:border-white/[0.08] focus:border-indigo-400 dark:focus:border-indigo-400/80 focus:bg-white dark:focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center justify-end gap-2 lg:gap-2.5 shrink-0 ml-auto">
        {/* Create folder & upload */}
        {!disabled && (
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateFolderClick}
              title="New Folder"
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/70 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-500/15 hover:text-indigo-600 dark:hover:text-cyan-300 border border-slate-200/60 dark:border-white/[0.08] hover:border-indigo-400/40 transition-all shadow-sm"
            >
              <FolderPlus className="w-4 h-4 text-indigo-500 dark:text-cyan-400 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden sm:inline">New Folder</span>
            </button>
            <button
              onClick={onUploadFilesClick}
              title="Upload Files"
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white dark:text-slate-950 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-cyan-400 shadow-md shadow-cyan-500/25 dark:shadow-[0_2px_14px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Upload className="w-4 h-4 text-white dark:text-slate-950 transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline font-bold">Upload</span>
            </button>
          </div>
        )}

        {/* View toggle (Glass Capsule) */}
        {onViewModeChange && (
          <div className="hidden sm:flex items-center bg-slate-100/70 dark:bg-white/[0.05] backdrop-blur-md rounded-xl p-1 gap-1 border border-slate-200/60 dark:border-white/[0.08]">
            <button
              onClick={() => onViewModeChange("grid")}
              title="Grid view"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-700/80 text-indigo-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              title="List view"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700/80 text-indigo-600 dark:text-cyan-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Activity & Notifications Bell */}
        <button
          onClick={() => setShowActivityDrawer(true)}
          title="Activity & Notifications"
          className="group relative p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200/60 dark:border-white/[0.08] transition-all shadow-sm"
        >
          <Bell className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse shadow-sm shadow-indigo-500/50" />
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200/60 dark:border-white/[0.08] transition-all shadow-sm"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* User menu */}
        <div className="relative ml-1" ref={menuRef}>
          {(() => {
            const userPlan = (user?.subscriptionPlan || "Starter").toUpperCase();
            const isPro = userPlan === "PRO";
            const isUltimate = userPlan === "ULTIMATE";
            const hasValidPicture =
              Boolean(user?.picture) &&
              !avatarError &&
              !user.picture.includes("vecteezy.com");

            return (
              <>
                <button
                  onClick={() => setShowUserMenu((p) => !p)}
                  className="group relative flex items-center justify-center p-0.5 rounded-full ring-2 ring-slate-200/80 dark:ring-white/10 hover:ring-cyan-400 dark:hover:ring-cyan-400 transition-all cursor-pointer shadow-sm"
                  title={`${user?.name || "User"} (${user?.subscriptionPlan || "Starter"} Plan)`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-white/[0.05]">
                    {hasValidPicture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        onError={() => setAvatarError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-inner select-none">
                        {user?.name?.[0]?.toUpperCase() ?? <User className="w-4 h-4 text-slate-950" />}
                      </div>
                    )}
                  </div>

                  {/* Small Pro / Ultimate floating badge on bottom-right of profile */}
                  {isPro && (
                    <span className="absolute -bottom-1 -right-1 px-1 py-[1.5px] bg-gradient-to-r from-cyan-400 to-blue-500 text-[8px] font-black text-slate-950 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.85)] border border-slate-950 uppercase tracking-tighter leading-none z-10 pointer-events-none">
                      PRO
                    </span>
                  )}
                  {isUltimate && (
                    <span className="absolute -bottom-1 -right-1 px-1 py-[1.5px] bg-gradient-to-r from-rose-400 to-purple-500 text-[8px] font-black text-white rounded-full shadow-[0_0_10px_rgba(244,63,94,0.85)] border border-slate-950 uppercase tracking-tighter leading-none z-10 pointer-events-none">
                      ULT
                    </span>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-60 bg-white/95 dark:bg-[#08090f]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 animate-scale-in">
                    {user ? (
                      <>
                        <div className="px-4 py-3 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-white/[0.04] dark:to-white/[0.02] border-b border-slate-100 dark:border-white/[0.06]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-200 dark:ring-cyan-400/40 shrink-0">
                              {hasValidPicture ? (
                                <img
                                  src={user.picture}
                                  alt={user.name}
                                  onError={() => setAvatarError(true)}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-inner">
                                  {user.name?.[0]?.toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                                  {user.name}
                                </span>
                                {isPro && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/15 border border-cyan-400/40 text-cyan-400 text-[9px] font-black uppercase tracking-wider">
                                    PRO
                                  </span>
                                )}
                                {isUltimate && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-rose-500/15 border border-rose-400/40 text-rose-400 text-[9px] font-black uppercase tracking-wider">
                                    ULT
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              navigate("/subscription");
                              setShowUserMenu(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                          >
                            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
                            Manage subscription
                          </button>
                          {(isPro || isUltimate) &&
                            user?.subscriptionStatus === "active" && (
                              <button
                                onClick={() => {
                                  setShowUserMenu(false);
                                  setShowCancelModal(true);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer group"
                              >
                                <XCircle className="w-4 h-4 text-slate-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors shrink-0" />
                                Cancel subscription
                              </button>
                            )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-slate-400 shrink-0" />
                            Sign out
                          </button>
                          <button
                            onClick={handleLogoutAll}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Shield className="w-4 h-4 shrink-0" />
                            Sign out all devices
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          navigate("/login");
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors font-medium"
                      >
                        <User className="w-4 h-4" />
                        Sign in
                      </button>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      <ActivityDrawer
        isOpen={showActivityDrawer}
        onClose={() => setShowActivityDrawer(false)}
        onUnreadCountChange={setUnreadCount}
      />

      {showCancelModal && (
        <CancelSubscriptionModal
          currentPlan={user?.subscriptionPlan}
          onClose={() => setShowCancelModal(false)}
          onSuccess={async () => {
            const updated = await fetchUser();
            setUser(updated);
            window.dispatchEvent(new Event("storageUpdated"));
          }}
        />
      )}
    </header>
  );
}

export default TopBar;
