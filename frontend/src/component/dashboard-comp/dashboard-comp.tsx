"use client";

import { useState } from "react";
import styles from "./dashboard-comp.module.css";
import { Box, Button, Typography } from "@mui/material";
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DashboardComp() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shareUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const [activePath, setActivePath] = useState(shareUrl);
  const router = useRouter();
    console.log(pathname,searchParams,shareUrl);

  const handleActivePath = (path: string) => {
    setActivePath(path);
    router.push(path);
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.sidebar}>
        <Box
          className={`${styles.menuItem} ${activePath === "/" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/")}
        >
          <AutoAwesomeMosaicOutlinedIcon />
          <Typography>Overview</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activePath === "/members" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/members")}
        >
          <EditNoteOutlinedIcon />
          <Typography>Members</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activePath === "/settings" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/settings")}
        >
          <SettingsOutlinedIcon />
          <Typography>Settings</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activePath === "/logs" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/logs")}
        >
          <RestoreOutlinedIcon />
          <Typography>Logs</Typography>
        </Box>
      </Box>
    </Box>
  );
}