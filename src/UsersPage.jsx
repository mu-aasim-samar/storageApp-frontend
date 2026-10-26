import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllUsers,
  fetchUser,
  deleteUserById,
  logoutUserById,
  updateUserRoleById,
  recoverUserById,
} from "./api/userApi";
import AppLayout from "./components/layout/AppLayout";
import {
  FolderOpen,
  Users,
  Radio,
  HardDrive,
  Shield,
  Crown,
  ChevronDown,
  Check,
  SlidersHorizontal,
  X,
  RotateCcw,
  Zap,
  Sparkles,
} from "lucide-react";

const ALL_COLUMNS = [
  {
    id: "name",
    label: "Name & Drive",
    required: true,
    minWidth: "min-w-[220px]",
  },
  {
    id: "email",
    label: "Email Address",
    required: false,
    minWidth: "min-w-[200px]",
  },
  {
    id: "status",
    label: "Online Status",
    required: false,
    minWidth: "min-w-[130px]",
  },
  {
    id: "role",
    label: "User Role",
    required: false,
    minWidth: "min-w-[140px]",
  },
  {
    id: "plan",
    label: "Storage Plan",
    required: false,
    minWidth: "min-w-[130px]",
  },
  {
    id: "storage",
    label: "Storage Usage",
    required: false,
    minWidth: "min-w-[210px]",
  },
  {
    id: "sessions",
    label: "Sessions",
    required: false,
    minWidth: "min-w-[120px]",
  },
  {
    id: "danger",
    label: "Danger Zone",
    required: false,
    minWidth: "min-w-[150px]",
    adminOnly: true,
  },
];

function PlanBadge({ plan }) {
  const normalized = (plan || "Starter").toLowerCase();
  if (normalized === "ultimate") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-400/40 text-purple-600 dark:text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)] select-none">
        <Sparkles className="w-3 h-3 text-purple-400" />
        <span className="tracking-wide">Ultimate</span>
      </span>
    );
  }
  if (normalized === "pro") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-400/40 text-cyan-600 dark:text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] select-none">
        <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
        <span className="tracking-wide">Pro</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 dark:bg-white/[0.04] border border-slate-300/40 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 select-none">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      <span className="tracking-wide">Starter</span>
    </span>
  );
}

function RoleBadge({ role }) {
  const normalized = (role || "User").toLowerCase();
  if (normalized === "owner") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-400/40 text-amber-500 dark:text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.35)] select-none">
        <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-400/20 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
        <span className="tracking-wide">Owner</span>
      </span>
    );
  }
  if (normalized === "admin") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 border border-purple-400/35 text-purple-600 dark:text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.25)] select-none">
        <Shield className="w-3 h-3 text-purple-400" />
        <span className="tracking-wide">Admin</span>
      </span>
    );
  }
  if (normalized === "manager") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 border border-indigo-400/35 text-indigo-600 dark:text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
        <span className="tracking-wide">Manager</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 border border-cyan-400/35 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] select-none">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
      <span className="tracking-wide">User</span>
    </span>
  );
}

function RoleGlassDropdown({
  currentRole,
  currentUserRole,
  onSelectRole,
  dropUp = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const allRolesConfig = {
    owner: {
      name: "Owner",
      color: "text-amber-400",
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
      desc: "Ultimate authority (Primary)",
    },
    admin: {
      name: "Admin",
      color: "text-purple-400",
      dot: "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]",
      desc: "Full administrative access",
    },
    manager: {
      name: "Manager",
      color: "text-indigo-400",
      dot: "bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]",
      desc: "Drive & team control",
    },
    user: {
      name: "User",
      color: "text-cyan-400",
      dot: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
      desc: "Standard access",
    },
  };

  const activeRoleConfig =
    allRolesConfig[(currentRole || "User").toLowerCase()] ||
    allRolesConfig.user;

  // Hierarchical allowed choices:
  // - Owner can make anyone Admin, Manager, User (can't make Owner)
  // - Admin can make anyone Manager, User (can't make Admin, nor Owner)
  const selectableRoles =
    currentUserRole === "Owner"
      ? [allRolesConfig.user, allRolesConfig.manager, allRolesConfig.admin]
      : [allRolesConfig.user, allRolesConfig.manager];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer backdrop-blur-xl border ${
          isOpen
            ? "bg-[#0b1120] border-cyan-400/60 text-white shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-500/25"
            : "bg-white/80 dark:bg-slate-900/80 border-slate-300/80 dark:border-white/15 text-slate-800 dark:text-slate-100 hover:border-cyan-400/50 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${activeRoleConfig.dot}`} />
        <span className="tracking-wide">{currentRole || "User"}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen
              ? "rotate-180 text-cyan-400"
              : "text-slate-400 group-hover:text-cyan-400"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 min-w-[185px] bg-white/95 dark:bg-[#090b10]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 animate-scale-in ${
            dropUp ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
          }`}
        >
          {/* Top specular glint */}
          <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent rounded-full pointer-events-none" />

          <div className="space-y-1">
            {selectableRoles.map((r) => {
              const isSelected =
                (currentRole || "User").toLowerCase() === r.name.toLowerCase();
              return (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => {
                    onSelectRole(r.name);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-transparent"
                  }`}
                >
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${r.dot} ${isSelected ? "animate-pulse" : ""}`}
                      />
                      <span className="tracking-wide">{r.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal pl-3.5">
                      {r.desc}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("User");
  const navigate = useNavigate();

  // Column Customization State
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("users_table_columns");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.includes("plan")) {
            const roleIdx = parsed.indexOf("role");
            if (roleIdx !== -1) parsed.splice(roleIdx + 1, 0, "plan");
            else parsed.push("plan");
            localStorage.setItem("users_table_columns", JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return [
      "name",
      "email",
      "status",
      "role",
      "plan",
      "storage",
      "sessions",
      "danger",
    ];
  });

  const toggleColumn = (colId) => {
    if (colId === "name") return;
    setVisibleColumns((prev) => {
      const next = prev.includes(colId)
        ? prev.filter((id) => id !== colId)
        : [...prev, colId];
      localStorage.setItem("users_table_columns", JSON.stringify(next));
      return next;
    });
  };

  const resetDefaultColumns = () => {
    const defaultCols = [
      "name",
      "email",
      "status",
      "role",
      "plan",
      "storage",
      "sessions",
      "danger",
    ];
    setVisibleColumns(defaultCols);
    localStorage.setItem("users_table_columns", JSON.stringify(defaultCols));
  };

  const logoutUser = async (user) => {
    const confirmed = confirm(`You are about to logout ${user.email}`);
    if (!confirmed) return;
    try {
      await logoutUserById(user.id);
      fetchUsers();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const deleteUser = async (user) => {
    const confirmed = confirm(`You are about to delete ${user.email}`);
    if (!confirmed) return;
    try {
      await deleteUserById(user.id);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  async function fetchUsers() {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      if (err.response?.status === 403) navigate("/");
      else if (err.response?.status === 401) navigate("/login");
      else console.error("Fetching users failed:", err);
    }
  }

  async function fetchCurrentUser() {
    try {
      const data = await fetchUser();
      setUserName(data.name);
      setUserEmail(data.email);
      setUserRole(data.role);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else console.error("Fetching user failed:", err);
    }
  }

  const handleRoleChange = async (targetUser, newRole) => {
    try {
      await updateUserRoleById(targetUser.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  const recoverUser = async (user) => {
    const confirmed = confirm(
      `Are you sure you want to recover ${user.email}'s account?`,
    );
    if (!confirmed) return;
    try {
      await recoverUserById(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, deleted: false } : u)),
      );
    } catch (err) {
      console.error("Recover error:", err);
      alert(err.response?.data?.error || "Failed to recover account");
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0 || isNaN(bytes)) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Compute stats
  const totalUsersCount = users.length;
  const onlineCount = users.filter((u) => u.isLoggedIn && !u.deleted).length;
  const totalStorageUsed = users.reduce(
    (acc, u) => acc + (u.usedStorageInBytes || 0),
    0,
  );

  return (
    <AppLayout directoryName="All Users" disabled={true}>
      <div className="relative max-w-7xl mx-auto py-6 px-3 sm:px-6 animate-fade-up">
        {/* Ambient Glow Lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/[0.06] rounded-full blur-3xl pointer-events-none" />

        {/* ── Top Header & Stats Summary ── */}
        <div className="mb-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                User Management
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  {userRole === "Owner" ? "Owner Console" : "Admin Console"}
                </span>
              </h1>

              <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-3">
                <span>
                  Signed in as{" "}
                  <b className="text-slate-900 dark:text-white">{userName}</b>
                </span>
                <RoleBadge role={userRole} />
              </div>
            </div>

            {/* Customize Columns Button (Most Right / Right End) */}
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setShowColumnModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/80 dark:bg-white/[0.06] hover:bg-cyan-500/15 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200/80 dark:border-white/10 hover:border-cyan-400/40 shadow-sm hover:shadow-[0_4px_16px_rgba(6,182,212,0.15)] backdrop-blur-md transition-all duration-200 cursor-pointer group"
                title="Customize table columns"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 transition-transform group-hover:rotate-45" />
                <span>Columns</span>
                <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 text-[10px] font-black border border-cyan-400/20">
                  {
                    visibleColumns.filter(
                      (id) =>
                        id !== "danger" ||
                        userRole === "Admin" ||
                        userRole === "Owner",
                    ).length
                  }
                </span>
              </button>
            </div>
          </div>

          {/* Quick Metrics (Liquid Glass Capsules) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="relative rounded-2xl p-4 backdrop-blur-xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-none flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.25)] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Users
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {totalUsersCount}
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="relative rounded-2xl p-4 backdrop-blur-xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-none flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Active Sessions
                </p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {onlineCount} Online
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="relative rounded-2xl p-4 backdrop-blur-xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-none flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-500 dark:text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Managed Space
                </p>
                <p className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                  {formatBytes(totalStorageUsed)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Liquid Glass Table Prismatic Container ── */}
        <div className="relative rounded-3xl backdrop-blur-2xl bg-white/75 dark:bg-[#080a10]/85 border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden z-10">
          {/* Specular top edge glint */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-full pointer-events-none" />

          {/* Table Container with smooth horizontal scroll when columns >= 6 */}
          {(() => {
            const effectiveCount = visibleColumns.filter(
              (id) =>
                id !== "danger" || userRole === "Admin" || userRole === "Owner",
            ).length;
            const isScrollable = effectiveCount >= 6;

            return (
              <div className="overflow-x-auto w-full">
                <table
                  className={`w-full text-left text-sm text-slate-600 dark:text-slate-300 ${
                    isScrollable ? "min-w-[1080px]" : ""
                  }`}
                >
                  <thead className="bg-slate-100/70 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200/70 dark:border-white/[0.08]">
                    <tr>
                      {visibleColumns.includes("name") && (
                        <th className="p-4 pl-6 min-w-[220px] whitespace-nowrap">
                          Name
                        </th>
                      )}
                      {visibleColumns.includes("email") && (
                        <th className="p-4 min-w-[200px] whitespace-nowrap">
                          Email
                        </th>
                      )}
                      {visibleColumns.includes("status") && (
                        <th className="p-4 min-w-[130px] whitespace-nowrap">
                          Status
                        </th>
                      )}
                      {visibleColumns.includes("role") && (
                        <th className="p-4 min-w-[140px] whitespace-nowrap">
                          Role
                        </th>
                      )}
                      {visibleColumns.includes("plan") && (
                        <th className="p-4 min-w-[130px] whitespace-nowrap">
                          Plan
                        </th>
                      )}
                      {visibleColumns.includes("storage") && (
                        <th className="p-4 min-w-[210px] whitespace-nowrap">
                          Storage Usage
                        </th>
                      )}
                      {visibleColumns.includes("sessions") && (
                        <th className="p-4 min-w-[120px] whitespace-nowrap">
                          Sessions
                        </th>
                      )}
                      {(userRole === "Admin" || userRole === "Owner") &&
                        visibleColumns.includes("danger") && (
                          <th className="p-4 pr-6 min-w-[150px] whitespace-nowrap">
                            Danger Zone
                          </th>
                        )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                    {users.map((user, idx) => (
                      <tr
                        key={user.id}
                        className="hover:bg-indigo-50/30 dark:hover:bg-white/[0.04] transition-colors duration-150"
                      >
                        {/* Name & Browse Drive */}
                        {visibleColumns.includes("name") && (
                          <td className="p-4 pl-6 min-w-[220px] text-slate-900 dark:text-white font-medium">
                            <div className="flex items-center justify-between gap-3 max-w-[200px]">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-b from-cyan-500/20 via-indigo-600/20 to-slate-900/40 dark:from-cyan-400/15 dark:to-indigo-500/20 border border-cyan-400/40 text-cyan-300 font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] shrink-0 backdrop-blur-md">
                                  <div className="absolute top-0.5 left-1.5 right-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none rounded-full" />
                                  <span className="drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="truncate font-semibold text-slate-900 dark:text-white">
                                  {user.name}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  navigate(`/users/${user.id}/drive`)
                                }
                                title="Browse User Drive"
                                className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-slate-200/60 dark:border-white/10 hover:border-cyan-400/40 transition-all shrink-0 cursor-pointer shadow-sm group"
                              >
                                <FolderOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
                              </button>
                            </div>
                          </td>
                        )}

                        {/* Email (Clean Inter Typography) */}
                        {visibleColumns.includes("email") && (
                          <td className="p-4 min-w-[200px] text-slate-600 dark:text-slate-300 text-xs font-medium tracking-normal select-all">
                            {user.email}
                          </td>
                        )}

                        {/* Status Pill */}
                        {visibleColumns.includes("status") && (
                          <td className="p-4 min-w-[130px]">
                            {user.deleted ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-400/30 text-rose-500 dark:text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.25)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                Deactivated
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                                  user.isLoggedIn
                                    ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-600 dark:text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                                    : "bg-slate-200/60 dark:bg-white/[0.04] border-slate-300/70 dark:border-white/10 text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    user.isLoggedIn
                                      ? "bg-emerald-400 animate-pulse"
                                      : "bg-slate-400"
                                  }`}
                                />
                                {user.isLoggedIn ? "Online" : "Offline"}
                              </span>
                            )}
                          </td>
                        )}

                        {/* Role */}
                        {visibleColumns.includes("role") && (
                          <td className="p-4 min-w-[140px]">
                            {(() => {
                              const isSelf = user.email === userEmail;
                              const isTargetOwner =
                                (user.role || "").toLowerCase() === "owner";
                              const isTargetAdmin =
                                (user.role || "").toLowerCase() === "admin";
                              const isCallerOwner =
                                (userRole || "").toLowerCase() === "owner";
                              const isCallerAdmin =
                                (userRole || "").toLowerCase() === "admin";

                              // Owner can change anyone except self and Owner
                              // Admin can only change Manager and User (cannot change self, Admin, or Owner)
                              const canEdit =
                                !isSelf &&
                                !isTargetOwner &&
                                (isCallerOwner ||
                                  (isCallerAdmin && !isTargetAdmin));

                              if (canEdit) {
                                return (
                                  <RoleGlassDropdown
                                    currentRole={user.role}
                                    currentUserRole={userRole}
                                    onSelectRole={(newRole) =>
                                      handleRoleChange(user, newRole)
                                    }
                                    dropUp={
                                      idx >= users.length - 2 &&
                                      users.length > 2
                                    }
                                  />
                                );
                              }

                              return <RoleBadge role={user.role} />;
                            })()}
                          </td>
                        )}

                        {/* Storage Plan */}
                        {visibleColumns.includes("plan") && (
                          <td className="p-4 min-w-[130px] whitespace-nowrap">
                            <PlanBadge plan={user.subscriptionPlan} />
                          </td>
                        )}

                        {/* Storage Meter */}
                        {visibleColumns.includes("storage") && (
                          <td className="p-4 min-w-[210px]">
                            {(() => {
                              const used = user.usedStorageInBytes || 0;
                              const max = user.maxStorageInBytes || 1;
                              const percentage = Math.min(
                                (used / max) * 100,
                                100,
                              ).toFixed(1);

                              return (
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                      {formatBytes(used)}
                                    </span>
                                    <span className="text-slate-400 font-bold text-[11px]">
                                      {percentage}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-200/80 dark:bg-white/[0.08] rounded-full h-2 overflow-hidden p-[1px] border border-slate-300/40 dark:border-white/10">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        percentage > 90
                                          ? "bg-gradient-to-r from-rose-500 to-red-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                                          : percentage > 70
                                            ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                                            : "bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    of {formatBytes(max)} capacity
                                  </span>
                                </div>
                              );
                            })()}
                          </td>
                        )}

                        {/* Sessions Button */}
                        {visibleColumns.includes("sessions") && (
                          <td className="p-4 min-w-[120px]">
                            {(() => {
                              const isTargetOwner =
                                (user.role || "").toLowerCase() === "owner";
                              const isCallerOwner =
                                (userRole || "").toLowerCase() === "owner";
                              const isLogoutDisabled =
                                !user.isLoggedIn ||
                                (isTargetOwner && !isCallerOwner);

                              return (
                                <button
                                  onClick={() =>
                                    !isLogoutDisabled && logoutUser(user)
                                  }
                                  disabled={isLogoutDisabled}
                                  title={
                                    isTargetOwner && !isCallerOwner
                                      ? "Only the Owner can terminate Owner sessions"
                                      : ""
                                  }
                                  className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 border ${
                                    !isLogoutDisabled
                                      ? "bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-indigo-600 dark:text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:scale-105 active:scale-95 cursor-pointer"
                                      : "bg-slate-100 text-slate-400 dark:bg-white/[0.03] dark:text-slate-500 border-transparent cursor-not-allowed opacity-50"
                                  }`}
                                >
                                  Logout
                                </button>
                              );
                            })()}
                          </td>
                        )}

                        {/* Danger Zone */}
                        {(userRole === "Admin" || userRole === "Owner") &&
                          visibleColumns.includes("danger") && (
                            <td className="p-4 pr-6 min-w-[160px] whitespace-nowrap">
                              {user.deleted ? (
                                <button
                                  onClick={() => recoverUser(user)}
                                  className="px-4 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-200"
                                >
                                  Recover Account
                                </button>
                              ) : (
                                (() => {
                                  const isSelf = user.email === userEmail;
                                  const isTargetOwner =
                                    (user.role || "").toLowerCase() === "owner";
                                  const isTargetAdmin =
                                    (user.role || "").toLowerCase() === "admin";
                                  const isCallerAdmin =
                                    (userRole || "").toLowerCase() === "admin";

                                  let isDeleteDisabled = false;
                                  let disabledTitle = "";

                                  if (isTargetOwner) {
                                    isDeleteDisabled = true;
                                    disabledTitle =
                                      "The Owner account cannot be deleted";
                                  } else if (isSelf) {
                                    isDeleteDisabled = true;
                                    disabledTitle =
                                      "You cannot delete your own account";
                                  } else if (isCallerAdmin && isTargetAdmin) {
                                    isDeleteDisabled = true;
                                    disabledTitle =
                                      "Admins cannot delete other Admins";
                                  }

                                  return (
                                    <button
                                      onClick={() =>
                                        !isDeleteDisabled && deleteUser(user)
                                      }
                                      disabled={isDeleteDisabled}
                                      title={disabledTitle}
                                      className={`px-4 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 border ${
                                        isDeleteDisabled
                                          ? "bg-slate-100 text-slate-400 dark:bg-white/[0.03] dark:text-slate-500 border-transparent cursor-not-allowed opacity-50"
                                          : "bg-rose-500/15 hover:bg-rose-500/25 border-rose-400/40 text-rose-600 dark:text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                                      }`}
                                    >
                                      Delete Account
                                    </button>
                                  );
                                })()
                              )}
                            </td>
                          )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>

        {/* ── Column Customization Modal ── */}
        {showColumnModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
            onClick={() => setShowColumnModal(false)}
          >
            <div
              className="relative w-full max-w-[320px] sm:max-w-[340px] bg-white dark:bg-[#090b10] border border-slate-200/80 dark:border-white/[0.12] rounded-3xl p-5 shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] text-slate-900 dark:text-white backdrop-blur-3xl animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top specular glint */}
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent rounded-full pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/10 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-cyan-400 shadow-sm">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                      Customize Columns
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Select which columns to show in the table
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowColumnModal(false)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Column Checkboxes */}
              <div className="space-y-1.5 mb-4 max-h-[300px] overflow-y-auto pr-1">
                {ALL_COLUMNS.filter(
                  (col) =>
                    !col.adminOnly ||
                    userRole === "Admin" ||
                    userRole === "Owner",
                ).map((col) => {
                  const isVisible = visibleColumns.includes(col.id);
                  const isRequired = col.required;

                  return (
                    <div
                      key={col.id}
                      onClick={() => !isRequired && toggleColumn(col.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-200 select-none ${
                        isRequired
                          ? "bg-slate-50 dark:bg-white/[0.02] border-slate-200/50 dark:border-white/[0.04] opacity-50 cursor-not-allowed"
                          : isVisible
                            ? "bg-slate-100/90 dark:bg-white/[0.07] border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white hover:bg-slate-200/70 dark:hover:bg-white/[0.1] cursor-pointer"
                            : "bg-transparent border-transparent hover:bg-slate-100/60 dark:hover:bg-white/[0.03] text-slate-400 dark:text-slate-500 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                            isVisible
                              ? "bg-cyan-500 dark:bg-cyan-400 border-cyan-500 dark:border-cyan-400 text-slate-950 font-bold shadow-sm"
                              : "border-slate-300 dark:border-white/20 bg-white/40 dark:bg-white/[0.02]"
                          }`}
                        >
                          {isVisible && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-semibold tracking-wide ${isVisible ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}
                          >
                            {col.label}
                          </span>
                          {isRequired && (
                            <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                              (Required)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={resetDefaultColumns}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowColumnModal(false)}
                  className="px-5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
