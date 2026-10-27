import { createPortal } from "react-dom";
import { useDirectoryContext } from "../context/DirectoryContext";
import { Download, Pencil, Trash2, Info, X } from "lucide-react";
import { axiosWithCreds } from "../api/axiosInstances";

function ContextMenu({ item, isUploadingItem }) {
  const {
    handleCancelUpload,
    setDeleteItem,
    openRenameModal,
    openDetailsPopup,
    BASE_URL,
    contextMenuPos,
    closeContextMenu,
    isReadOnly,
  } = useDirectoryContext();

  const BASE = BASE_URL || import.meta.env.VITE_SERVER_URL;

  // Position menu so it doesn't fall off screen edges
  const MENU_W = 176;
  const MENU_H = isUploadingItem ? 44 : item.isDirectory ? (isReadOnly ? 50 : 124) : (isReadOnly ? 88 : 160);
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let x = (contextMenuPos?.x ?? 0) + 4;
  let y = (contextMenuPos?.y ?? 0) + 4;
  if (x + MENU_W > vw) x = vw - MENU_W - 8;
  if (y + MENU_H > vh) y = y - MENU_H - 8;

  const menuBase =
    "fixed w-48 bg-white/95 dark:bg-[#090b10]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-black/50 rounded-2xl p-1.5 overflow-hidden z-[9999] animate-scale-in ring-1 ring-black/5 dark:ring-white/5";

  const btn =
    "flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-xl transition-all text-left";

  // Wrap every action to also close the menu
  const action = (fn) => () => {
    closeContextMenu();
    fn();
  };

  const menu = (
    <div
      className={menuBase}
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {isUploadingItem && item.isUploading ? (
        <button
          className={`${btn} text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 group`}
          onClick={action(() => handleCancelUpload(item.id))}
        >
          <X className="w-4 h-4 text-rose-500 transition-transform group-hover:scale-110" />
          Cancel upload
        </button>
      ) : item.isDirectory ? (
        <>
          {!isReadOnly && (
            <button
              className={`${btn} text-slate-700 dark:text-slate-200 hover:bg-violet-50/80 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 group`}
              onClick={action(() => openRenameModal("directory", item.id, item.name))}
            >
              <Pencil className="w-4 h-4 text-violet-500 transition-transform group-hover:scale-110" />
              Rename
            </button>
          )}
          <button
            className={`${btn} text-slate-700 dark:text-slate-200 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 group`}
            onClick={action(() => openDetailsPopup(item))}
          >
            <Info className="w-4 h-4 text-indigo-500 transition-transform group-hover:scale-110" />
            Details
          </button>
          {!isReadOnly && (
            <>
              <div className="border-t border-slate-100 dark:border-slate-700/60 my-0.5" />
              <button
                className={`${btn} text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 group`}
                onClick={action(() => setDeleteItem(item))}
              >
                <Trash2 className="w-4 h-4 text-rose-500 transition-transform group-hover:scale-110" />
                Delete
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <button
            className={`${btn} text-slate-700 dark:text-slate-200 hover:bg-sky-50/80 dark:hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 group`}
            onClick={action(async () => {
              try {
                const { data } = await axiosWithCreds.get(`/file/${item.id}?action=download&json=true`);
                if (data.url) {
                  const a = document.createElement("a");
                  a.href = data.url;
                  a.download = item.name;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }
              } catch (err) {
                console.error("Download failed:", err);
                window.location.href = `${BASE}/file/${item.id}?action=download`;
              }
            })}
          >
            <Download className="w-4 h-4 text-sky-500 transition-transform group-hover:scale-110" />
            Download
          </button>
          {!isReadOnly && (
            <button
              className={`${btn} text-slate-700 dark:text-slate-200 hover:bg-violet-50/80 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 group`}
              onClick={action(() => openRenameModal("file", item.id, item.name))}
            >
              <Pencil className="w-4 h-4 text-violet-500 transition-transform group-hover:scale-110" />
              Rename
            </button>
          )}
          <button
            className={`${btn} text-slate-700 dark:text-slate-200 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 group`}
            onClick={action(() => openDetailsPopup(item))}
          >
            <Info className="w-4 h-4 text-indigo-500 transition-transform group-hover:scale-110" />
            Details
          </button>
          {!isReadOnly && (
            <>
              <div className="border-t border-slate-100 dark:border-slate-700/60 my-0.5" />
              <button
                className={`${btn} text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 group`}
                onClick={action(() => setDeleteItem(item))}
              >
                <Trash2 className="w-4 h-4 text-rose-500 transition-transform group-hover:scale-110" />
                Delete
              </button>
            </>
          )}
        </>
      )}
    </div>
  );

  return createPortal(menu, document.body);
}

export default ContextMenu;
