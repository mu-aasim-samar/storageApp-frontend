import { X, Download, Trash2, CheckSquare, Square } from "lucide-react";

export default function BulkActionBar({
  selectedCount,
  totalCount,
  isAllSelected,
  onToggleSelectAll,
  onClearSelection,
  onBulkDownload,
  onBulkDelete,
  hasFiles,
  isReadOnly,
}) {
  if (!selectedCount) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up max-w-[95vw]">
      <div className="relative rounded-2xl backdrop-blur-2xl bg-[#090b10]/95 border border-cyan-400/35 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_24px_rgba(6,182,212,0.2)] ring-1 ring-white/10 p-2 sm:px-4 sm:py-2.5 flex items-center gap-2.5 sm:gap-3.5">
        {/* Top specular glint */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-full pointer-events-none" />

        {/* Clear / Close selection */}
        <button
          onClick={onClearSelection}
          type="button"
          title="Clear selection"
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer group"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
        </button>

        {/* Selected count badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.2)] whitespace-nowrap select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
          <span>{selectedCount} selected</span>
        </div>

        {/* Select All Toggle */}
        {totalCount > 0 && (
          <button
            onClick={onToggleSelectAll}
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer select-none"
          >
            {isAllSelected ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 text-slate-400" />
                <span>Select All ({totalCount})</span>
              </>
            )}
          </button>
        )}

        {/* Vertical divider */}
        <div className="h-6 w-[1px] bg-white/15 hidden sm:block" />

        {/* Download action (if selection has files) */}
        {hasFiles && (
          <button
            onClick={onBulkDownload}
            type="button"
            title="Download selected files"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Download</span>
          </button>
        )}

        {/* Delete action (disabled in read-only mode) */}
        {!isReadOnly && (
          <button
            onClick={onBulkDelete}
            type="button"
            title="Delete selected items"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}
