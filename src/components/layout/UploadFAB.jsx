import { useState, useRef } from "react";
import { Upload, FolderPlus, Plus, X } from "lucide-react";

function UploadFAB({ onUpload, onNewFolder, disabled }) {
  const [open, setOpen] = useState(false);

  if (disabled) return null;

  const subActions = [
    {
      icon: FolderPlus,
      label: "New Folder",
      onClick: () => { onNewFolder(); setOpen(false); },
      color: "bg-white dark:bg-[#0c0e14] text-slate-700 dark:text-cyan-400 border border-slate-200 dark:border-white/10 hover:border-cyan-400 dark:hover:border-cyan-400/50",
      shadow: "shadow-lg shadow-slate-900/10 dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
    },
    {
      icon: Upload,
      label: "Upload Files",
      onClick: () => { onUpload(); setOpen(false); },
      color: "bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 text-white dark:text-slate-950 font-bold",
      shadow: "shadow-lg shadow-cyan-500/30 dark:shadow-[0_4px_20px_rgba(6,182,212,0.4)]",
    },
  ];

  return (
    <>
      {/* Backdrop to close */}
      {open && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Sub-actions — animate in when open */}
        <div
          className={`flex flex-col items-end gap-2 transition-all duration-200 ${
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {subActions.map(({ icon: Icon, label, onClick, color, shadow }, i) => (
            <button
              key={label}
              onClick={onClick}
              className={`flex items-center gap-2.5 pl-4 pr-5 py-2.5 rounded-2xl text-sm font-semibold ${color} ${shadow} transition-all duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer`}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Main FAB */}
        <button
          onClick={() => setOpen((p) => !p)}
          title="Upload or create"
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 active:scale-95 cursor-pointer ${
            open
              ? "bg-slate-700 dark:bg-slate-800 text-white shadow-slate-900/30 rotate-0"
              : "bg-gradient-to-tr from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 text-white dark:text-slate-950 shadow-cyan-500/30 dark:shadow-[0_4px_25px_rgba(6,182,212,0.45)] fab-pulse"
          }`}
        >
          <Plus
            className={`w-6 h-6 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          />
        </button>
      </div>
    </>
  );
}

export default UploadFAB;
