import { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import UploadFAB from "./UploadFAB";
import { Upload } from "lucide-react";

function AppLayout({
  children,
  directoryName,
  currentPath,
  onCreateFolderClick,
  onUploadFilesClick,
  disabled,
  fileInputRef,
  handleFileSelect,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (disabled) return;
    dragCounter.current += 1;
    if (e.dataTransfer.types.includes("Files")) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files?.length && handleFileSelect) {
      // Pass only the first dropped file
      handleFileSelect({ target: { files: [files[0]] } });
    }
  };

  return (
    <div
      className="relative flex h-screen bg-slate-100/70 dark:bg-[#050608] text-slate-800 dark:text-slate-100 overflow-hidden font-sans"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* ── Background Cybernetic Glass Mesh (Deep Obsidian Contrast, Zero Purple Haze) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-slate-800/20 dark:bg-slate-800/[0.08] rounded-full blur-[140px]" />
        <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] bg-cyan-400/20 dark:bg-cyan-500/[0.04] rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-slate-800/20 dark:bg-slate-900/[0.12] rounded-full blur-[160px]" />
      </div>
      {/* ── Drag & drop overlay ── */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-md" />
          {/* Dashed border */}
          <div className="absolute inset-4 rounded-3xl border-2 border-dashed border-cyan-400 dark:border-cyan-400/60 animate-pulse" />
          {/* Center card */}
          <div className="relative flex flex-col items-center gap-4 px-10 py-8 rounded-3xl bg-white dark:bg-[#0b0d14] shadow-2xl shadow-cyan-500/10 border border-slate-200 dark:border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800 dark:text-white">
                Drop files to upload
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-400 mt-1">
                Release to start uploading
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          directoryName={directoryName}
          currentPath={currentPath}
          onCreateFolderClick={onCreateFolderClick}
          onUploadFilesClick={onUploadFilesClick}
          disabled={disabled}
          onMenuToggle={() => setSidebarOpen((p) => !p)}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Floating Action Button */}
      <UploadFAB
        onUpload={onUploadFilesClick}
        onNewFolder={onCreateFolderClick}
        disabled={disabled}
      />
    </div>
  );
}

export default AppLayout;
