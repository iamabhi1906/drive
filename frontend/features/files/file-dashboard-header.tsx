import { Box, Button, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import styles from "./file-dashboard.module.css";

type Props = { total: number; onUpload: () => void };

export default function FileDashboardHeader({ total, onUpload }: Props) {
  return (
    <Box className={styles.pageHeader}>
      <Box>
        <Typography component="h1" variant="h4" className={styles.title}>
          My files
        </Typography>
        <Typography color="text.secondary" className={styles.subtitle}>
          {total} {total === 1 ? "file" : "files"} in your workspace
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={onUpload}
        className={styles.uploadButton}
      >
        Upload file
      </Button>
    </Box>
  );
}
