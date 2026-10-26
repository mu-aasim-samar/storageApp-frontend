import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ModernFolderIcon } from "./icons/FileFolderIcon";

function CreateDirectoryModal({ newDirname, setNewDirname, onClose, onCreateDirectory }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.select();
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white/95 dark:bg-[#090b10]/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/60 border border-slate-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100/80 dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="shrink-0 flex items-center justify-center">
              <ModernFolderIcon name={newDirname || "Folder"} size="sm" />
            </div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">New folder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onCreateDirectory} className="px-6 py-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Folder name
          </label>
          <input
            ref={inputRef}
            id="new-folder-name"
            type="text"
            value={newDirname}
            onChange={(e) => setNewDirname(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-sm border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] text-slate-800 dark:text-white outline-none focus:border-indigo-500/70 dark:focus:border-indigo-400/70 focus:ring-4 focus:ring-indigo-500/15 backdrop-blur-sm transition-all"
            placeholder="Untitled folder"
            required
          />

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="create-folder-submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDirectoryModal;
