import { useEffect } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import FileFolderIcon from "./icons/FileFolderIcon";

function ConfirmDeleteModal({ item, items, onConfirm, onCancel, isDeleting = false }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const isBulk = Array.isArray(items) && items.length > 0;
  const count = isBulk ? items.length : 1;
  const hasDirectories = isBulk ? items.some((i) => i.isDirectory) : Boolean(item?.isDirectory);

  return (
    <div
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white/95 dark:bg-[#090b10]/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/60 border border-slate-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning header */}
        <div className="px-6 pt-7 pb-4 text-center">
          <div className="relative flex items-center justify-center mx-auto mb-4 w-16 h-16">
            <FileFolderIcon
              isDirectory={isBulk ? true : item?.isDirectory}
              name={isBulk ? "Bulk" : item?.name}
              size="lg"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-[#090b10]">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            {isBulk ? `Delete ${count} items?` : `Delete ${item?.isDirectory ? "folder" : "file"}?`}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {isBulk ? (
              <span>{count} selected files and folders will be permanently deleted.</span>
            ) : (
              <>
                <span className="font-semibold text-slate-700 dark:text-slate-200">"{item?.name}"</span>{" "}
                will be permanently deleted.
              </>
            )}
            {hasDirectories && (
              <>
                <br />
                <span className="text-rose-500 dark:text-rose-400 text-xs mt-2 inline-flex items-center gap-1 font-medium bg-rose-500/10 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  {isBulk
                    ? "Folders and all files inside them will also be deleted."
                    : "All files inside will also be deleted."}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            id="delete-cancel"
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-white/[0.05] hover:bg-slate-200/70 dark:hover:bg-white/[0.1] transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(isBulk ? items : item)}
            disabled={isDeleting}
            id="delete-confirm"
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isDeleting ? "Deleting..." : isBulk ? `Delete (${count})` : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
