"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard-comp.module.css";
import { Box, Button, Typography } from "@mui/material";
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import getDynamicRoute from "@/utils/dyanmic-route";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { deleteRoom } from "@/redux/feature/room/room-action";
import { RootState } from "@/redux/store";

export default function DashboardComp() {
  const pathname = usePathname();
  const { room_uuid } = useParams();
  const curr_room_uuid = String(room_uuid);
  const searchParams = useSearchParams();
  const shareUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const [activePath, setActivePath] = useState(shareUrl);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { publicRooms, joinedRooms, myrooms } = useAppSelector((state: RootState) => state.roomReducer);
  const { user } = useAppSelector((state: RootState) => state.authReducer);
  const [creatorUuid, setCreatorUuid] = useState<string>();

  useEffect(() => {
    setCreatorUuid(
      publicRooms.find((room) => room.uuid === curr_room_uuid)?.creator_uuid ??
      myrooms.find((room) => room.uuid === curr_room_uuid)?.creator_uuid ??
      joinedRooms.find((room) => room.uuid === curr_room_uuid)?.creator_uuid
    );
  }, [curr_room_uuid]);

  const handleActivePath = (path: string) => {
    if ((path == "/room" || path == "/room/join") && !user) {
      enqueueSnackbar("Login First", { variant: "warning" });
      return;
    }

    setActivePath(path);
    router.replace(path);
  }

  const handleRoomDelete = async (uuid: string) => {
    try {
      if (!user) {
        enqueueSnackbar("Login First", { variant: "warning" });
        return;
      }

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
          className={`${styles.menuItem} ${activePath === "/room" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/room")}
        >
          <RoomPreferencesIcon />
          <Typography>Your Rooms</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activePath === "/room/join" ? styles.active : ""
            }`}
          onClick={() => handleActivePath("/room/join")}
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
          getDynamicRoute(activePath).room_uuid &&
          (creatorUuid && creatorUuid == user?.uuid) &&
          < Box className={styles.deleteRoom} onClick={() => handleRoomDelete(getDynamicRoute(activePath)?.room_uuid || '')}>
            <HighlightOffIcon />
            <Typography className={styles.deleteRoom}>Close Room</Typography>
          </Box>
        }

        <Box className={styles.menuItem}>
          <HelpOutlineOutlinedIcon />
          <Typography>Help</Typography>
        </Box>
      </Box>
    </Box >
  );
}