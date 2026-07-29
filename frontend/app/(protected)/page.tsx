import { serverApi } from "@/lib/server.api";
import { Box } from "@mui/material";

export default async function Page() {
  const api = await serverApi();
  const { data } = await api.get("/files");
  return <Box>Simple page</Box>;
}
