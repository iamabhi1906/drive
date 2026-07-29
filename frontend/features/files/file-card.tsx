import {
  Box,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FolderZipOutlinedIcon from "@mui/icons-material/FolderZipOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import type { DriveFile } from "./file.types";
import { bytesToSize, fileKind, formattedDate } from "./file-utils";
import styles from "./file-dashboard.module.css";

type Props = { file: DriveFile; onDelete: (file: DriveFile) => void };
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

function MimeIcon({ file }: { file: DriveFile }) {
  const iconClass = `${styles.mimeIcon} ${styles[`mime${fileKind(file).charAt(0).toUpperCase()}${fileKind(file).slice(1)}`]}`;
  if (file.mimeType === "application/pdf")
    return <PictureAsPdfOutlinedIcon className={iconClass} />;
  if (file.mimeType.includes("excel") || file.mimeType === "text/csv")
    return <TableChartOutlinedIcon className={iconClass} />;
  if (file.mimeType.includes("powerpoint"))
    return <SlideshowOutlinedIcon className={iconClass} />;
  if (file.mimeType === "application/zip")
    return <FolderZipOutlinedIcon className={iconClass} />;
  if (file.mimeType === "text/plain")
    return <TextSnippetOutlinedIcon className={iconClass} />;
  if (file.mimeType.startsWith("image/"))
    return <ImageOutlinedIcon className={iconClass} />;
  if (file.mimeType.includes("document"))
    return <ArticleOutlinedIcon className={iconClass} />;
  return <InsertDriveFileOutlinedIcon className={iconClass} />;
}

export default function FileCard({ file, onDelete }: Props) {
  return (
    <Paper className={styles.fileCard} elevation={0}>
      <Box className={styles.cardTop}>
        <MimeIcon file={file} />
        <Box className={styles.cardActions}>
          <Tooltip title="Download">
            <IconButton
              component="a"
              href={`${apiUrl}/${file.storagePath}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`Download ${file.originalName}`}
            >
              <DownloadRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => onDelete(file)}
              aria-label={`Delete ${file.originalName}`}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Typography className={styles.cardName}>{file.originalName}</Typography>
      <Typography className={styles.cardInfo} color="text.secondary">
        {bytesToSize(file.size)} · {formattedDate(file.createdAt)}
      </Typography>
      <Box className={styles.cardTags}>
        {file.tags.map((tag) => (
          <Chip key={tag.id} label={tag.name} size="small" />
        ))}
      </Box>
    </Paper>
  );
}
