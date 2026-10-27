import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import CreateDirectoryModal from "./components/CreateDirectoryModal";
import RenameModal from "./components/RenameModal";
import DirectoryList from "./components/DirectoryList";
import { DirectoryContext } from "./context/DirectoryContext";

import {
  getDirectoryItems,
  createDirectory,
  deleteDirectory,
  renameDirectory,
} from "./api/directoryApi";

import {
  deleteFile,
  renameFile,
  uploadComplete,
  uploadInitiate,
} from "./api/fileApi";
import { axiosWithCreds } from "./api/axiosInstances";
import { fetchUser } from "./api/userApi";
import DetailsPopup from "./components/DetailsPopup";
import ConfirmDeleteModal from "./components/ConfirmDeleteModel";
import BulkActionBar from "./components/BulkActionBar";
import FileFolderIcon from "./components/icons/FileFolderIcon";

import {
  FolderOpen,
  Upload,
  AlertCircle,
  Search,
  HardDrive,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "./context/AuthContext";

function DirectoryView() {
  const { dirId, userId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdmin = role === "Admin" || role === "Owner";
  const isReadOnly = Boolean(userId) && !isAdmin;

  const [currentDirId, setCurrentDirId] = useState(null);
  const [directoryName, setDirectoryName] = useState("My Drive");
  const [currentPath, setCurrentPath] = useState([]);
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [newDirname, setNewDirname] = useState("New Folder");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("mydrive-viewmode") || "grid",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fileInputRef = useRef(null);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadXhrMap, setUploadXhrMap] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [detailsItem, setDetailsItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [loading, setLoading] = useState(true);
  // Bulk operations / item multi-selection (currently paused)
  const [selectedItems, setSelectedItems] = useState([]);

  const openDetailsPopup = (item) => setDetailsItem(item);
  const closeDetailsPopup = () => setDetailsItem(null);

  const toggleSelectItem = (item) => {
    if (item.isDirectory) return;
    setSelectedItems((prev) => {
      // If already in list -> uncheck/remove it
      if (prev.some((i) => i.id === item.id)) {
        return prev.filter((i) => i.id !== item.id);
      }
      // If not in list -> add it
      return [
        ...prev,
        { id: item.id, isDirectory: false, name: item.name },
      ];
    });
  };

  const clearSelection = () => setSelectedItems([]);

  const loadDirectory = async () => {
    setLoading(true);
    try {
      const data = await getDirectoryItems(dirId, userId);
      setCurrentDirId(data._id);
      setDirectoryName(
        dirId
          ? data.name
          : userId
            ? `${data.owner?.name || "User"}'s Drive`
            : "My Drive",
      );
      setCurrentPath(data.path || []);
      setDirectoriesList([...data.directories].reverse());
      setFilesList([...data.files].reverse());
      setErrorMessage("");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else setErrorMessage(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirectory();
    setActiveContextMenu(null);
    setSearchQuery(""); // clear search when navigating
    setSelectedItems([]);
  }, [dirId, userId]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("mydrive-viewmode", mode);
  };

  function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "pdf";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
      case "svg":
        return "image";
      case "mp4":
      case "mov":
      case "avi":
      case "mkv":
      case "webm":
        return "video";
      case "zip":
      case "rar":
      case "tar":
      case "gz":
      case "7z":
        return "archive";
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "html":
      case "css":
      case "py":
      case "java":
      case "go":
      case "rs":
      case "cpp":
      case "c":
        return "code";
      default:
        return "alt";
    }
  }

  async function handleRowClick(type, id) {
    if (type === "directory") {
      navigate(userId ? `/users/${userId}/drive/${id}` : `/directory/${id}`);
    } else {
      try {
        const { data } = await axiosWithCreds.get(`/file/${id}?json=true`);
        if (data.url) {
          window.open(data.url, "_blank");
        }
      } catch (err) {
        console.error("Open file error:", err);
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/file/${id}`;
      }
    }
  }

  async function handleFileSelect(e) {
    const file = e.target.files[0];

    // If the user cancelled the file picker, exit early
    if (!file) return;

    setErrorMessage("");
    const MAX_FILE_SIZE = 900 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(
        "File exceeds the size limit. Please choose a smaller file.",
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 7000);
      e.target.value = "";
      return;
    }

    try {
      const user = await fetchUser();
      if (user) {
        const remainingSpace = user.maxStorageInBytes - user.usedStorageInBytes;
        if (file.size > remainingSpace) {
          setErrorMessage(
            "You do not have enough storage space left for this file.",
          );
          setTimeout(() => {
            setErrorMessage("");
          }, 7000);
          e.target.value = "";
          return;
        }
      }
    } catch (err) {
      console.error("Failed to check storage limits", err);
    }

    const contentType = file.type || "application/octet-stream";
    const data = await uploadInitiate({
      name: file.name,
      size: file.size,
      contentType: contentType,
      parentDirId: dirId || currentDirId,
    });

    const { uploadSignedUrl, fileId } = data;

    const newItem = {
      file,
      name: file.name,
      size: file.size,
      id: fileId,
      uploadUrl: uploadSignedUrl,
      contentType: contentType,
      isUploading: true,
    };

    setFilesList((prev) => [newItem, ...prev]);
    setProgressMap((prev) => ({ ...prev, [newItem.id]: 0 }));
    setUploadQueue((prev) => [...prev, newItem]);

    e.target.value = "";

    if (!isUploading) {
      setIsUploading(true);
      processUploadQueue([...uploadQueue, newItem]);
    }
  }

  function processUploadQueue(queue) {
    if (!queue.length) {
      setIsUploading(false);
      setUploadQueue([]);
      setProgressMap({});
      setTimeout(() => {
        window.dispatchEvent(new Event("storageUpdated"));
        loadDirectory();
      }, 500);
      return;
    }

    const [currentItem, ...restQueue] = queue;
    setFilesList((prev) =>
      prev.map((f) =>
        f.id === currentItem.id ? { ...f, isUploading: true } : f,
      ),
    );

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", currentItem.uploadUrl);

    // must match what was signed
    xhr.setRequestHeader(
      "Content-Type",
      currentItem.contentType ||
        currentItem.file.type ||
        "application/octet-stream",
    );

    xhr.upload.addEventListener("progress", (evt) => {
      if (evt.lengthComputable) {
        const progress = (evt.loaded / evt.total) * 100;
        setProgressMap((prev) => ({ ...prev, [currentItem.id]: progress }));
      }
    });

    xhr.onload = async () => {
      try {
        if (xhr.status === 200) {
          await uploadComplete(currentItem.id);
          setFilesList((prev) =>
            prev.map((f) =>
              f.id === currentItem.id ? { ...f, isUploading: false } : f,
            ),
          );
        } else {
          console.error("S3 upload failed with status:", xhr.status);
          deleteFile(currentItem.id).catch(() => {});
          setFilesList((prev) => prev.filter((f) => f.id !== currentItem.id));
          setErrorMessage("Upload failed. S3 rejected the file.");
        }
      } catch (err) {
        console.error("Error finalizing upload:", err);
        setErrorMessage("Failed to finalize upload on server.");
      } finally {
        setProgressMap((prev) => {
          const next = { ...prev };
          delete next[currentItem.id];
          return next;
        });
        setUploadXhrMap((prev) => {
          const next = { ...prev };
          delete next[currentItem.id];
          return next;
        });
        processUploadQueue(restQueue);
      }
    };

    xhr.onerror = () => {
      console.error("Network or CORS error uploading to S3");
      deleteFile(currentItem.id).catch(() => {});
      setFilesList((prev) => prev.filter((f) => f.id !== currentItem.id));
      setProgressMap((prev) => {
        const next = { ...prev };
        delete next[currentItem.id];
        return next;
      });
      setUploadXhrMap((prev) => {
        const next = { ...prev };
        delete next[currentItem.id];
        return next;
      });
      setErrorMessage("Network error uploading file.");
      processUploadQueue(restQueue);
    };

    setUploadXhrMap((prev) => ({ ...prev, [currentItem.id]: xhr }));
    xhr.send(currentItem.file);
  }

  function handleCancelUpload(tempId) {
    const xhr = uploadXhrMap[tempId];
    if (xhr) xhr.abort();
    deleteFile(tempId).catch(() => {});
    setUploadQueue((prev) => prev.filter((item) => item.id !== tempId));
    setFilesList((prev) => prev.filter((f) => f.id !== tempId));
    setProgressMap((prev) => {
      const { [tempId]: _, ...rest } = prev;
      return rest;
    });
    setUploadXhrMap((prev) => {
      const copy = { ...prev };
      delete copy[tempId];
      return copy;
    });
  }

  async function confirmDelete(item) {
    try {
      if (item.isDirectory) await deleteDirectory(item.id);
      else await deleteFile(item.id);
      setDeleteItem(null);
      window.dispatchEvent(new Event("storageUpdated"));
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
    }
  }

  async function handleCreateDirectory(e) {
    e.preventDefault();
    try {
      await createDirectory(dirId || currentDirId, newDirname);
      setNewDirname("New Folder");
      setShowCreateDirModal(false);
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
    }
  }

  function openRenameModal(type, id, currentName) {
    setRenameType(type);
    setRenameId(id);
    setRenameValue(currentName);
    setShowRenameModal(true);
  }

  async function handleRenameSubmit(e) {
    e.preventDefault();
    try {
      if (renameType === "file") await renameFile(renameId, renameValue);
      else await renameDirectory(renameId, renameValue);
      setShowRenameModal(false);
      setRenameValue("");
      setRenameType(null);
      setRenameId(null);
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
    }
  }

  useEffect(() => {
    const handleDocumentClick = () => setActiveContextMenu(null);
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const combinedItems = [
    ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
    ...filesList.map((f) => ({ ...f, isDirectory: false })),
  ].filter((item) =>
    searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );

  const availableFiles = combinedItems.filter((item) => !item.isDirectory);

  const isAllSelected =
    availableFiles.length > 0 &&
    availableFiles.every((item) => selectedItems.some((s) => s.id === item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        availableFiles.map((item) => ({
          id: item.id,
          isDirectory: false,
          name: item.name,
        })),
      );
    }
  };

  const handleBulkDownload = () => {
    const filesToDownload = selectedItems.filter((i) => !i.isDirectory);
    if (filesToDownload.length === 0) return;

    const BASE = import.meta.env.VITE_SERVER_URL;

    // Single file download: direct navigation triggers native download
    if (filesToDownload.length === 1) {
      window.location.href = `${BASE}/file/${filesToDownload[0].id}?action=download`;
      return;
    }

    // Multiple files download: use hidden iframes with ?action=download staggered by 600ms
    filesToDownload.forEach((f, idx) => {
      setTimeout(() => {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = `${BASE}/file/${f.id}?action=download`;
        document.body.appendChild(iframe);
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (_) {}
        }, 60000);
      }, idx * 600);
    });
  };

  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const confirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      await Promise.allSettled(
        selectedItems.map((item) =>
          item.isDirectory ? deleteDirectory(item.id) : deleteFile(item.id),
        ),
      );
      setSelectedItems([]);
      setShowBulkDeleteModal(false);
      window.dispatchEvent(new Event("storageUpdated"));
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const isAccessDenied =
    errorMessage === "Directory not found or you do not have access to it!";

  return (
    <DirectoryContext.Provider
      value={{
        handleRowClick,
        activeContextMenu,
        handleContextMenu: (e, id) => {
          e.stopPropagation();
          e.preventDefault();
          setContextMenuPos({ x: e.clientX, y: e.clientY });
          setActiveContextMenu((prev) => (prev === id ? null : id));
        },
        getFileIcon,
        isUploading,
        progressMap,
        handleCancelUpload,
        setDeleteItem,
        openRenameModal,
        openDetailsPopup,
        BASE_URL: import.meta.env.VITE_SERVER_URL,
        contextMenuPos,
        closeContextMenu: () => setActiveContextMenu(null),
        isReadOnly,
        selectedItems,
        toggleSelectItem,
        clearSelection,
      }}
    >
      <AppLayout
        directoryName={directoryName}
        currentPath={currentPath}
        onCreateFolderClick={() => setShowCreateDirModal(true)}
        onUploadFilesClick={() => fileInputRef.current?.click()}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        disabled={isAccessDenied || isReadOnly}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        {/* ── Inspection Banner ── */}
        {userId && (
          <div
            className={`flex items-center justify-between p-3.5 mb-5 rounded-2xl border text-sm backdrop-blur-xl animate-fade-up ${
              isReadOnly
                ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400 shadow-lg shadow-amber-500/5"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400 shadow-lg shadow-indigo-500/5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isReadOnly ? "bg-amber-400" : "bg-indigo-400"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isReadOnly ? "bg-amber-500" : "bg-indigo-500"
                  }`}
                ></span>
              </span>
              <span className="font-semibold text-xs sm:text-sm">
                {isReadOnly
                  ? "Inspecting User Drive (Read-Only Mode)"
                  : "Admin Drive Inspection (Full Management Access)"}
              </span>
            </div>
            <button
              onClick={() => navigate("/users")}
              className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-colors backdrop-blur-md border ${
                isReadOnly
                  ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 border-amber-500/30"
                  : "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-800 dark:text-indigo-200 border-indigo-500/30"
              }`}
            >
              Back to Users
            </button>
          </div>
        )}

        {/* ── Breadcrumb ── */}
        <div className="flex items-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-sm overflow-x-auto no-scrollbar px-3.5 py-1.5 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200/70 dark:border-white/[0.08] shadow-sm max-w-full">
            <button
              onClick={() => navigate(userId ? `/users/${userId}/drive` : "/")}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium shrink-0"
            >
              <div className="w-5 h-5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <HardDrive className="w-3.5 h-3.5 shrink-0" />
              </div>
              <span className="text-[13px] font-semibold hidden sm:inline">
                {userId ? "Root" : "My Drive"}
              </span>
            </button>

            {currentPath.map((folder) => {
              if (folder.name.startsWith("root-")) return null;
              return (
                <div
                  key={folder._id}
                  className="flex items-center gap-1.5 shrink-0"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                  <button
                    onClick={() =>
                      navigate(
                        userId
                          ? `/users/${userId}/drive/${folder._id}`
                          : `/directory/${folder._id}`,
                      )
                    }
                    title={folder.name}
                    className="text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[140px] md:max-w-[200px]"
                  >
                    {folder.name}
                  </button>
                </div>
              );
            })}

            {!(!directoryName || directoryName === "My Drive") && (
              <div className="flex items-center gap-1.5 shrink-0">
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                <span
                  title={directoryName}
                  className="text-slate-900 dark:text-white font-bold truncate max-w-[180px] md:max-w-[300px] text-[13px] px-2 py-0.5 rounded-lg bg-slate-200/50 dark:bg-white/[0.08]"
                >
                  {directoryName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Error banner ── */}
        {errorMessage && !isAccessDenied && (
          <div className="flex items-center gap-2.5 p-3 mb-5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm animate-fade-up">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* ── Skeleton Loading ── */}
        {loading && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="h-[116px] rounded-2xl bg-slate-100 dark:bg-slate-800/60 shimmer"
                  style={{ animationDelay: `${i * 0.04}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Access denied ── */}
        {!loading && isAccessDenied && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Access denied
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              This folder doesn't exist or you don't have permission.
            </p>
          </div>
        )}

        {/* ── No search results ── */}
        {!loading &&
          !isAccessDenied &&
          combinedItems.length === 0 &&
          searchQuery && (
            <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-up">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
                No results for "{searchQuery}"
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
                Try a different name or check spelling.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}

        {/* ── Empty folder state ── */}
        {!loading &&
          !isAccessDenied &&
          combinedItems.length === 0 &&
          !searchQuery && (
            <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-up">
              <div className="relative flex items-center justify-center mb-5 group">
                <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/30 blur-2xl rounded-full scale-125 pointer-events-none" />
                <FileFolderIcon isDirectory={true} name="Drive" size="lg" className="scale-125 transition-transform duration-300 group-hover:scale-135" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
                This folder is empty
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed mb-6">
                {userId
                  ? "This user has not uploaded any files or folders yet."
                  : "Upload files or create a new folder to get started."}
              </p>
              {!userId && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCreateDirModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                  >
                    New folder
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-500/20 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Upload files
                  </button>
                </div>
              )}
            </div>
          )}

        {/* ── File/Folder Grid ── */}
        {!loading && !isAccessDenied && combinedItems.length > 0 && (
          <div className="animate-fade-up">
            <DirectoryList items={combinedItems} viewMode={viewMode} />
          </div>
        )}

        {/* ── Modals ── */}
        {showCreateDirModal && (
          <CreateDirectoryModal
            newDirname={newDirname}
            setNewDirname={setNewDirname}
            onClose={() => setShowCreateDirModal(false)}
            onCreateDirectory={handleCreateDirectory}
          />
        )}
        {showRenameModal && (
          <RenameModal
            renameType={renameType}
            renameValue={renameValue}
            setRenameValue={setRenameValue}
            onClose={() => setShowRenameModal(false)}
            onRenameSubmit={handleRenameSubmit}
          />
        )}
        {detailsItem && (
          <DetailsPopup
            item={detailsItem}
            currentPath={currentPath}
            currentDirName={directoryName}
            onClose={closeDetailsPopup}
          />
        )}
        {deleteItem && (
          <ConfirmDeleteModal
            item={deleteItem}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteItem(null)}
          />
        )}
        {showBulkDeleteModal && (
          <ConfirmDeleteModal
            items={selectedItems}
            onConfirm={confirmBulkDelete}
            onCancel={() => setShowBulkDeleteModal(false)}
            isDeleting={isBulkDeleting}
          />
        )}
        <BulkActionBar
          selectedCount={selectedItems.length}
          totalCount={availableFiles.length}
          isAllSelected={isAllSelected}
          onToggleSelectAll={toggleSelectAll}
          onClearSelection={clearSelection}
          onBulkDownload={handleBulkDownload}
          onBulkDelete={() => setShowBulkDeleteModal(true)}
          hasFiles={selectedItems.some((i) => !i.isDirectory)}
          isReadOnly={isReadOnly}
        />
      </AppLayout>
    </DirectoryContext.Provider>
  );
}

export default DirectoryView;
