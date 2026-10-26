import { useState } from "react";
import { MoreVertical, Check } from "lucide-react";
import ContextMenu from "./ContextMenu";
import { useDirectoryContext } from "../context/DirectoryContext";
import FileFolderIcon from "./icons/FileFolderIcon";

// Feature toggle: Bulk operations / multi-selection functionality is active
const ENABLE_BULK_OPERATIONS = true;

function DirectoryItem({ item, uploadProgress, viewMode = "grid" }) {
  const {
    handleRowClick,
    activeContextMenu,
    handleContextMenu,
    getFileIcon,
    selectedItems = [],
    toggleSelectItem,
    isReadOnly,
    BASE_URL,
  } = useDirectoryContext();

  const BASE = BASE_URL || import.meta.env.VITE_SERVER_URL;
  const isSelected =
    !item.isDirectory &&
    ENABLE_BULK_OPERATIONS &&
    selectedItems.some((i) => i.id === item.id);

  const isUploadingItem =
    Boolean(item.isUploading) && uploadProgress !== undefined;
  const fileIconType = !item.isDirectory ? getFileIcon(item.name) : null;
  const [imgFailed, setImgFailed] = useState(false);
  const isImage = !item.isDirectory && fileIconType === "image" && !isUploadingItem && !imgFailed;

  const formattedSize = `${(item.size / 1024 / 1024).toFixed(2)} MB`;
  const formattedDate = new Date(item.createdAt).toLocaleDateString();
  const tooltipText = `Size: ${formattedSize}\nCreated: ${formattedDate}`;

  const handleClick = () => {
    if (!activeContextMenu && !isUploadingItem) {
      handleRowClick(item.isDirectory ? "directory" : "file", item.id);
    }
  };

  if (viewMode === "list") {
    return (
      <div
        className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 border backdrop-blur-md ${
          isSelected
            ? "bg-indigo-500/15 dark:bg-cyan-500/15 border-indigo-400/60 dark:border-cyan-400/60 shadow-sm shadow-cyan-500/10"
            : "bg-white/40 dark:bg-white/[0.03] hover:bg-white/70 dark:hover:bg-white/[0.07] border-slate-200/50 dark:border-white/[0.08] hover:border-slate-300/80 dark:hover:border-cyan-400/40"
        }`}
        onClick={handleClick}
        onContextMenu={(e) => handleContextMenu(e, item.id)}
        title={tooltipText}
      >
        {ENABLE_BULK_OPERATIONS && !item.isDirectory && !isUploadingItem && !isReadOnly && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleSelectItem(item);
            }}
            className="flex items-center justify-center shrink-0 cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded-md flex items-center justify-center transition-all duration-150 border ${
                isSelected
                  ? "bg-indigo-600 dark:bg-cyan-500 border-indigo-600 dark:border-cyan-500 text-white dark:text-slate-950 shadow-sm shadow-indigo-500/30 scale-105"
                  : "bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-white/20 hover:border-indigo-400 dark:hover:border-cyan-400 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
              }`}
            >
              {isSelected && (
                <Check className="w-3 h-3 text-white dark:text-slate-950 stroke-[3]" />
              )}
            </div>
          </div>
        )}

        {/* 3D Glassmorphic Icon or Live Photo Thumbnail */}
        <div className="shrink-0 flex items-center justify-center">
          {isImage ? (
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm shrink-0">
              <img
                src={`${BASE}/file/${item.id}`}
                crossOrigin="use-credentials"
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImgFailed(true)}
              />
            </div>
          ) : (
            <FileFolderIcon
              isDirectory={item.isDirectory}
              name={item.name}
              size="sm"
            />
          )}
        </div>

        {/* Name */}
        <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {item.name}
        </span>

        {/* Upload progress (list) */}
        {isUploadingItem && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${uploadProgress ?? 0}%`,
                  background: uploadProgress === 100 ? "#10b981" : "#6366f1",
                }}
              />
            </div>
            <span className="text-xs text-slate-400">
              {Math.floor(uploadProgress ?? 0)}%
            </span>
          </div>
        )}

        {/* Type badge */}
        {!item.isDirectory && !isUploadingItem && (
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-medium capitalize">
            {fileIconType}
          </span>
        )}

        {/* Three-dot menu */}
        <button
          className="shrink-0 p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all"
          onClick={(e) => handleContextMenu(e, item.id)}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {activeContextMenu === item.id && (
          <ContextMenu item={item} isUploadingItem={isUploadingItem} />
        )}
      </div>
    );
  }
  return (
    <div
      className={`group relative flex flex-col items-center justify-between gap-3 p-4 rounded-3xl cursor-pointer transition-all duration-300 border backdrop-blur-xl ${
        isSelected
          ? "bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-500/15 ring-2 ring-cyan-400/30 scale-[1.02]"
          : "bg-white/80 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/[0.08] hover:bg-white dark:hover:bg-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.18] shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:-translate-y-1"
      }`}
      onClick={handleClick}
      onContextMenu={(e) => handleContextMenu(e, item.id)}
      title={`Size: ${tooltipText}`}
    >
      {/* Selection Checkbox (Grid) - Only for files */}
      {ENABLE_BULK_OPERATIONS && !item.isDirectory && !isUploadingItem && !isReadOnly && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleSelectItem(item);
          }}
          className={`absolute top-2.5 left-2.5 z-10 flex items-center justify-center cursor-pointer transition-all duration-150 ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 border ${
              isSelected
                ? "bg-cyan-500 border-cyan-500 text-slate-950 font-bold shadow-sm scale-105"
                : "bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-white/20 hover:border-cyan-400 backdrop-blur-sm shadow-sm"
            }`}
          >
            {isSelected && (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            )}
          </div>
        </div>
      )}

      {/* 3D Glass Icon or Live Photo Preview */}
      <div className="w-full flex items-center justify-center my-0.5">
        {isImage ? (
          <div className="relative w-full h-28 rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-white/10 group-hover:shadow-md transition-all duration-300">
            <img
              src={`${BASE}/file/${item.id}`}
              crossOrigin="use-credentials"
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          </div>
        ) : (
          <div className="w-24 h-24 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <FileFolderIcon
              isDirectory={item.isDirectory}
              name={item.name}
              size="lg"
            />
          </div>
        )}
      </div>

      {/* Name */}
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 text-center line-clamp-2 w-full leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
        {item.name}
      </span>

      {/* Upload progress (grid) */}
      {isUploadingItem && (
        <div className="w-full px-1">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${uploadProgress ?? 0}%`,
                background: uploadProgress === 100 ? "#10b981" : "#06b6d4",
              }}
            />
          </div>
          <div className="text-center text-xs text-slate-400 mt-1">
            {Math.floor(uploadProgress ?? 0)}%
          </div>
        </div>
      )}

      {/* Three-dot button */}
      <button
        className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-500 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all"
        onClick={(e) => handleContextMenu(e, item.id)}
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {activeContextMenu === item.id && (
        <ContextMenu item={item} isUploadingItem={isUploadingItem} />
      )}
    </div>
  );
}

export default DirectoryItem;
