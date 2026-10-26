import DirectoryItem from "./DirectoryItem";
import { useDirectoryContext } from "../context/DirectoryContext";
import { FolderOpen } from "lucide-react";

function DirectoryList({ items, viewMode = "grid" }) {
  const { progressMap } = useDirectoryContext();

  if (items.length === 0) return null;

  const folders = items.filter((i) => i.isDirectory);
  const files = items.filter((i) => !i.isDirectory);

  return (
    <div className="space-y-6">
      {/* ── Folders ── */}
      {folders.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3.5">
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Folders
            </h2>
            <span className="text-[11px] font-bold text-slate-600 dark:text-cyan-400 bg-slate-200/60 dark:bg-white/[0.06] backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-300/50 dark:border-white/[0.08] shadow-sm">
              {folders.length}
            </span>
          </div>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {folders.map((item) => (
                <DirectoryItem
                  key={item.id}
                  item={item}
                  uploadProgress={progressMap?.[item.id]}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {folders.map((item) => (
                <DirectoryItem
                  key={item.id}
                  item={item}
                  uploadProgress={progressMap?.[item.id]}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Files ── */}
      {files.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3.5">
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Files
            </h2>
            <span className="text-[11px] font-bold text-slate-600 dark:text-indigo-400 bg-slate-200/60 dark:bg-white/[0.06] backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-300/50 dark:border-white/[0.08] shadow-sm">
              {files.length}
            </span>
          </div>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {files.map((item) => (
                <DirectoryItem
                  key={item.id}
                  item={item}
                  uploadProgress={progressMap?.[item.id]}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-0.5">
              {files.map((item) => (
                <DirectoryItem
                  key={item.id}
                  item={item}
                  uploadProgress={progressMap?.[item.id]}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default DirectoryList;
