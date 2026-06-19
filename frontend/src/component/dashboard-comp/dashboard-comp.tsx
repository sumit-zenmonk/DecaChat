"use client";

import { useState } from "react";
import styles from "./dashboard-comp.module.css";
import { Box, Button, Typography } from "@mui/material";
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DashboardComp() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shareUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const [activePath, setActivePath] = useState(shareUrl);
  const router = useRouter();

  const handleActivePath = (path: string) => {
    setActivePath(path);
    router.push(path);
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.topContainer}>
        <Box
          className={`${styles.menuItem} ${activePath === "/" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/")}
        >
          <AutoAwesomeMosaicOutlinedIcon />
          <Typography>Overview</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activePath === "/rooms" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/rooms")}
        >
          <RoomPreferencesIcon />
          <Typography>Your Rooms</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activePath === "/rooms/join" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/rooms/join")}
        >
          <GroupsIcon />
          <Typography>Joined Rooms</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activePath === "/setting" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/setting")}
        >
          <SettingsOutlinedIcon />
          <Typography>Settings</Typography>
        </Box>
      </Box>

      <Box className={styles.bottomContainer}>
        <Box className={styles.menuItem}>
          <HelpOutlineOutlinedIcon />
          <Typography>Help</Typography>
        </Box>
      </Box>
    </Box>
  );
}