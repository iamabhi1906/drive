"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { logout } from "@/features/auth/auth.action";
import styles from "./app-bar.module.css";
import { FolderRounded } from "@mui/icons-material";

export default function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<HTMLElement | null>(
    null,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  async function handleMenuAction(action: "profile" | "logout") {
    if (action === "logout") {
      const result = await dispatch(logout(null));
      if (result.meta.requestStatus === "fulfilled") router.replace("/login");
    }
    if (action === "profile") router.push("/profile");
    setAnchorElUser(null);
  }

  if (!user) return null;

  return (
    <AppBar position="static" elevation={0} className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.brand}>
          <FolderRounded className={styles.brandIcon} />
          <Typography
            component="span"
            variant="h6"
            className={styles.brandName}
          >
            Drive
          </Typography>
        </Box>
        <Box className={styles.userArea}>
          <Box className={styles.userCopy}>
            <Typography className={styles.userName}>{user.name}</Typography>
          </Box>
          <Tooltip title="Account settings">
            <IconButton
              onClick={(event) => setAnchorElUser(event.currentTarget)}
              aria-label="Open account menu"
            >
              <Avatar alt={user.name} src={user.avatar || ""}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            <MenuItem onClick={() => handleMenuAction("profile")}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction("logout")}>
              Log out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
