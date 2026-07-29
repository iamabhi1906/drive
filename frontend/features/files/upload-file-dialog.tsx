import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { ChangeEvent, RefObject } from "react";
import type { FileTag } from "./file.types";
import styles from "./file-dashboard.module.css";

type Props = {
  open: boolean;
  file: File | null;
  tags: FileTag[];
  tagIds: string[];
  uploading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTagChange: (ids: string[]) => void;
  onUpload: () => void;
};

export default function UploadFileDialog({
  open,
  file,
  tags,
  tagIds,
  uploading,
  inputRef,
  onClose,
  onFileChange,
  onTagChange,
  onUpload,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Upload a file</DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <input
          ref={inputRef}
          type="file"
          onChange={onFileChange}
          className={styles.hiddenInput}
        />
        <Button
          variant="outlined"
          startIcon={<UploadFileRoundedIcon />}
          onClick={() => inputRef.current?.click()}
          className={styles.filePicker}
        >
          {file ? file.name : "Choose a file"}
        </Button>
        <Typography color="text.secondary" variant="body2">
          PDF, image, spreadsheet, ZIP, CSV, or text — up to 5 MB.
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="tag-label">Tags</InputLabel>
          <Select
            labelId="tag-label"
            label="Tags"
            multiple
            value={tagIds}
            onChange={(event) => onTagChange(event.target.value as string[])}
            renderValue={(selected) =>
              selected
                .map((id) => tags.find((tag) => String(tag.id) === id)?.name)
                .filter(Boolean)
                .join(", ")
            }
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={String(tag.id)}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onUpload}
          disabled={!file || uploading}
        >
          {uploading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Upload"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
