"use client";
import { Box } from "@mui/material";
import styles from "./auth-layout.module.css";
import { useAppSelector } from "../store";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  if (user) {
    // router.replace("/");
    return;
  }
  return <Box className={styles.layout}>{children}</Box>;
}
