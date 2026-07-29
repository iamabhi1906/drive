import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { FileTag } from "./file.types";
import styles from "./file-dashboard.module.css";

type Props = {
  tags: FileTag[];
  query: string;
  types: string[];
  tagIds: string[];
  onQuery: (value: string) => void;
  onTypes: (value: string[]) => void;
  onTagIds: (value: string[]) => void;
  onClear: () => void;
};

const typeOptions = [
  ["image", "Images"],
  ["pdf", "PDFs"],
  ["spreadsheet", "Spreadsheets"],
  ["presentation", "Presentations"],
  ["archive", "Archives"],
  ["text", "Text files"],
];

export default function FileFilters({
  tags,
  query,
  types,
  tagIds,
  onQuery,
  onTypes,
  onTagIds,
  onClear,
}: Props) {
  const hasFilters = Boolean(query || types.length || tagIds.length);
  return (
    <Paper className={styles.filterBar} elevation={0}>
      <TextField
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Search files or tags"
        className={styles.searchField}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      <FormControl className={styles.filterSelect} size="small">
        <InputLabel id="type-filter-label">File type</InputLabel>
        <Select
          labelId="type-filter-label"
          label="File type"
          multiple
          value={types}
          onChange={(event) => onTypes(event.target.value as string[])}
          renderValue={(selected) =>
            selected.length
              ? `${selected.length} type${selected.length > 1 ? "s" : ""}`
              : "All types"
          }
        >
          {typeOptions.map(([value, label]) => (
            <MenuItem key={value} value={value}>
              <ListItemIcon className={styles.checkIcon}>
                {types.includes(value) && <CheckRoundedIcon fontSize="small" />}
              </ListItemIcon>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={styles.filterSelect} size="small">
        <InputLabel id="tag-filter-label">Tags</InputLabel>
        <Select
          labelId="tag-filter-label"
          label="Tags"
          multiple
          value={tagIds}
          onChange={(event) => onTagIds(event.target.value as string[])}
          renderValue={(selected) =>
            selected.length
              ? `${selected.length} tag${selected.length > 1 ? "s" : ""}`
              : "All tags"
          }
        >
          {tags.map((tag) => (
            <MenuItem key={tag.id} value={String(tag.id)}>
              <ListItemIcon className={styles.checkIcon}>
                {tagIds.includes(String(tag.id)) && (
                  <CheckRoundedIcon fontSize="small" />
                )}
              </ListItemIcon>
              {tag.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {hasFilters && (
        <Button onClick={onClear} className={styles.clearButton}>
          Clear filters
        </Button>
      )}
    </Paper>
  );
}
