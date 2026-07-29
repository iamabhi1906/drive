import FileDashboard from "@/features/files/file-dashboard";
import type { FileListResponse } from "@/features/files/file.types";
import { serverApi } from "@/lib/server.api";

export default async function Page() {
  const api = await serverApi();
  const response = await api.get<FileListResponse>("/files");

  return <FileDashboard initialData={response.data ?? null} />;
}
