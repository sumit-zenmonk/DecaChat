"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard-comp.module.css";
import { Box, Button, Typography } from "@mui/material";
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useRoomRouteCheck from "@/utils/dyanmic-route.regex";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { deleteRoom } from "@/redux/feature/room/room-action";
import { RootState } from "@/redux/store";

export default function DashboardComp() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shareUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const [activePath, setActivePath] = useState(shareUrl);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { myrooms } = useAppSelector((state: RootState) => state.roomReducer);
  const { user } = useAppSelector((state: RootState) => state.authReducer);

  const handleActivePath = (path: string) => {
    setActivePath(path);
    router.push(path);
  }

  const handleRoomDelete = async (uuid: string) => {
    try {
      await dispatch(deleteRoom({ uuid })).unwrap();
      router.replace('/');
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
      console.log(error);
    }
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
        {
          useRoomRouteCheck(activePath).uuid && myrooms.filter((room) => room.creator_uuid == user?.uuid) &&
          <Box className={styles.deleteRoom} onClick={() => handleRoomDelete(useRoomRouteCheck(activePath)?.uuid || '')}>
            <HighlightOffIcon />
            <Typography className={styles.deleteRoom}>Close Room</Typography>
          </Box>
        }

        <Box className={styles.menuItem}>
          <HelpOutlineOutlinedIcon />
          <Typography>Help</Typography>
        </Box>
      </Box>
    </Box>
  );
}