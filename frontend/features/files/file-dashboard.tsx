"use client";

import {
  Alert,
  Box,
  Button,
  Pagination,
  Snackbar,
  Typography,
} from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import DeleteFileDialog from "./delete-file-dialog";
import FileDashboardHeader from "./file-dashboard-header";
import FileCard from "./file-card";
import FileFilters from "./file-filters";
import type { DriveFile, FileListResponse, FileTag } from "./file.types";
import UploadFileDialog from "./upload-file-dialog";
import styles from "./file-dashboard.module.css";

type Props = { initialData: FileListResponse | null };

export default function FileDashboard({ initialData }: Props) {
  const [files, setFiles] = useState<DriveFile[]>(initialData?.files ?? []);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [filterTagIds, setFilterTagIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState(
    initialData?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
  );
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [tags, setTags] = useState<FileTag[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DriveFile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get<FileListResponse>("/files", {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            search: search || undefined,
            types: types.length ? types.join(",") : undefined,
            tagIds: filterTagIds.length ? filterTagIds.join(",") : undefined,
          },
        });
        setFiles(data.files);
        setPagination(data.pagination);
      } catch {
        setNotice({
          severity: "error",
          message: "Could not load files. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search, types, filterTagIds, pagination.page, pagination.limit]);

  async function openUpload() {
    setUploadOpen(true);
    try {
      const { data } = await api.get<FileTag[] | { tags: FileTag[] }>("/tags", {
        params: { limit: 100 },
      });
      setTags(Array.isArray(data) ? data : (data.tags ?? []));
    } catch {
      setTags([]);
    }
  }

  useEffect(() => {
    async function loadTags() {
      try {
        const { data } = await api.get<FileTag[] | { tags: FileTag[] }>(
          "/tags",
          { params: { limit: 100 } },
        );
        setTags(Array.isArray(data) ? data : (data.tags ?? []));
      } catch {
        setTags([]);
      }
    }
    void loadTags();
  }, []);

  function closeUpload() {
    if (!uploading) {
      setUploadOpen(false);
      setPendingFile(null);
      setTagIds([]);
    }
  }
  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    setPendingFile(event.target.files?.[0] ?? null);
  }

  async function uploadFile() {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", pendingFile);
      formData.append("tagIds", JSON.stringify(tagIds.map(Number)));
      const { data } = await api.post<{ file: DriveFile }>("/files", formData);
      setFiles((current) => [data.file, ...current]);
      setPagination((current) => ({ ...current, total: current.total + 1 }));
      setUploadOpen(false);
      setPendingFile(null);
      setTagIds([]);
      setNotice({
        severity: "success",
        message: "File uploaded successfully.",
      });
    } catch {
      setNotice({
        severity: "error",
        message:
          "Could not upload this file. Check its type and size, then try again.",
      });
    } finally {
      setUploading(false);
    }
  }

  async function deleteFile() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/files/${deleteTarget.id}`);
      setFiles((current) =>
        current.filter((file) => file.id !== deleteTarget.id),
      );
      setPagination((current) => ({
        ...current,
        total: Math.max(0, current.total - 1),
      }));
      setNotice({ severity: "success", message: "File deleted." });
      setDeleteTarget(null);
    } catch {
      setNotice({
        severity: "error",
        message: "Could not delete this file. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box component="main" className={styles.dashboard}>
      <FileDashboardHeader total={pagination.total} onUpload={openUpload} />
      <FileFilters
        tags={tags}
        query={search}
        types={types}
        tagIds={filterTagIds}
        onQuery={(value) => {
          setSearch(value);
          setPagination((current) => ({ ...current, page: 1 }));
        }}
        onTypes={(value) => {
          setTypes(value);
          setPagination((current) => ({ ...current, page: 1 }));
        }}
        onTagIds={(value) => {
          setFilterTagIds(value);
          setPagination((current) => ({ ...current, page: 1 }));
        }}
        onClear={() => {
          setSearch("");
          setTypes([]);
          setFilterTagIds([]);
          setPagination((current) => ({ ...current, page: 1 }));
        }}
      />
      {loading && (
        <Box className={styles.loadingState}>
          <Typography color="text.secondary">Loading files…</Typography>
        </Box>
      )}
      {!loading && Boolean(files.length) && (
        <Box className={styles.fileGrid}>
          {files.map((file) => (
            <FileCard key={file.id} file={file} onDelete={setDeleteTarget} />
          ))}
        </Box>
      )}
      {!loading && !files.length && (
        <Box className={styles.emptyState}>
          <InsertDriveFileOutlinedIcon className={styles.emptyIcon} />
          <Typography variant="h6">No files found</Typography>
          <Typography color="text.secondary">
            Try a different search or filter, or upload a new file.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<UploadFileRoundedIcon />}
            onClick={openUpload}
          >
            Upload a file
          </Button>
        </Box>
      )}
      {pagination.totalPages > 1 && (
        <Box className={styles.pagination}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, page) =>
              setPagination((current) => ({ ...current, page }))
            }
            color="primary"
          />
        </Box>
      )}
      <UploadFileDialog
        open={uploadOpen}
        file={pendingFile}
        tags={tags}
        tagIds={tagIds}
        uploading={uploading}
        inputRef={inputRef}
        onClose={closeUpload}
        onFileChange={selectFile}
        onTagChange={setTagIds}
        onUpload={uploadFile}
      />
      <DeleteFileDialog
        file={deleteTarget}
        deleting={deleting}
        onClose={() => !deleting && setDeleteTarget(null)}
        onDelete={deleteFile}
      />
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4000}
        onClose={() => setNotice(null)}
      >
        <Alert severity={notice?.severity} onClose={() => setNotice(null)}>
          {notice?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
