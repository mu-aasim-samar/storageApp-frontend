import { useEffect } from "react";
import { X, Calendar, HardDrive, MapPin, Clock, FileText, FolderOpen, File, Folder } from "lucide-react";
import FileFolderIcon from "./icons/FileFolderIcon";

/* ── helpers ── */
function formatSize(bytes) {
  if (bytes == null || bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

function Row({ icon: Icon, label, value, iconColor = "text-slate-400" }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100/80 dark:border-white/[0.06] last:border-0">
      <div className="w-8 h-8 rounded-xl bg-slate-100/60 dark:bg-white/[0.05] border border-slate-200/50 dark:border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">{label}</div>
        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 break-all">{value ?? "—"}</div>
      </div>
    </div>
  );
}

function DetailsPopup({ item,currentPath = [], currentDirName = "My Drive", onClose }) {
  if (!item) return null;

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const {
    name,
    isDirectory,
    size,
    createdAt,
    updatedAt,
    fileCount,
    directoryCount,
  } = item;

  const pathNames = currentPath.map(p => 
    p.name.startsWith('root-') ? 'My Drive' : p.name
  );
  const parentName = currentDirName.startsWith('root-') ? 'My Drive' : currentDirName;
  
  const location = [...pathNames, parentName].join(' / ');

  /* type label */
  const typeLabel = isDirectory ? "Folder" : "File";

  return (
    <div
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white/95 dark:bg-[#090b10]/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/60 border border-slate-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100/80 dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="shrink-0 flex items-center justify-center">
              <FileFolderIcon
                isDirectory={isDirectory}
                name={name}
                size="md"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[180px]">
                {name}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">{typeLabel} details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Info rows ── */}
        <div className="px-6 pt-2 pb-2">
          <Row
            icon={FileText}
            label="Name"
            value={name}
            iconColor="text-indigo-400"
          />
          <Row
            icon={isDirectory ? FolderOpen : File}
            label="Type"
            value={typeLabel}
            iconColor="text-violet-400"
          />
          <Row
            icon={MapPin}
            label="Location"
            value={location}
            iconColor="text-sky-400"
          />
            <Row
              icon={HardDrive}
              label="Size"
              value={formatSize(size)}
              iconColor="text-emerald-400"
            />
          {isDirectory && fileCount != null && (
            <Row
              icon={File}
              label="Files"
              value={String(fileCount)}
              iconColor="text-amber-400"
            />
          )}
          {isDirectory && directoryCount != null && (
            <Row
              icon={Folder}
              label="Folders"
              value={String(directoryCount)}
              iconColor="text-orange-400"
            />
          )}
          <Row
            icon={Calendar}
            label="Created"
            value={formatDate(createdAt)}
            iconColor="text-rose-400"
          />
          <Row
            icon={Clock}
            label="Modified"
            value={formatDate(updatedAt)}
            iconColor="text-pink-400"
          />
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-5 pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white dark:text-slate-950 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsPopup;
