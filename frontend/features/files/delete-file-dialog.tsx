import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { DriveFile } from "./file.types";

type Props = {
  file: DriveFile | null;
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteFileDialog({
  file,
  deleting,
  onClose,
  onDelete,
}: Props) {
  return (
    <Dialog open={Boolean(file)} onClose={onClose}>
      <DialogTitle>Delete file?</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          This will permanently delete {file?.originalName}. This action
          can&apos;t be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
