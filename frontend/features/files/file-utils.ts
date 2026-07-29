import type { DriveFile } from "./file.types";

export function bytesToSize(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formattedDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function fileKind(file: DriveFile) {
  if (file.mimeType.startsWith("image/")) return "image";
  if (file.mimeType === "application/pdf") return "pdf";
  if (file.mimeType.includes("spreadsheet") || file.mimeType === "text/csv")
    return "sheet";
  return "document";
}
