"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Button, IconButton, Typography } from "@mui/material"
import { RootState } from "@/redux/store"
import styles from "./header-comp.module.css"
import { logoutUser } from "@/redux/feature/auth/auth-action"
import { enqueueSnackbar } from "notistack"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import { useState } from "react"
import CreateRoomModal from "../create-room-modal/create-room-modal"
import CircleIcon from '@mui/icons-material/Circle';
import { togglechatDrawerState } from "@/redux/feature/common/common-slice"

export default function HeaderComp() {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: RootState) => state.authReducer);
    const { viewerCounts } = useAppSelector((state: RootState) => state.roomReducer);
    const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);

    const pathname = usePathname();
    const segments = pathname.split('/');
    const uuid = segments[2];
    const chat = segments[3];

    const handleLogOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            localStorage.clear()
            router.replace("/")
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    const handleAddRoomClose = () => {
        setOpenCreateRoomModal(false);
    };

    const handleAddRoomOpen = () => {
        if (!user) {
            enqueueSnackbar("Need Login", { variant: "error" });
            return;
        }
        setOpenCreateRoomModal(true);
    };

    const handleDrawerToggle = () => {
        dispatch(togglechatDrawerState());
    }

    return (
        <Box className={styles.container}>
            <Box className={styles.leftContainer}>
                <Typography onClick={() => { router.push("/") }} className={styles.title}>Deca Chat</Typography>
            </Box>

            <Box className={styles.rightContainer}>
                {chat &&
                    <Box className={styles.viewerCountBox}>
                        <CircleIcon className={styles.viewerCountIcon} />
                        <Typography variant="h4" className={styles.viewerCount}>
                            Live Viewers: {viewerCounts[uuid] || 0}
                        </Typography>
                    </Box>
                }
                {!chat &&
                    <Button className={styles.createRoomButton} onClick={handleAddRoomOpen}>Create New Room</Button>
                }

                <IconButton className={styles.iconButton} onClick={handleDrawerToggle}><PeopleOutlineOutlinedIcon /></IconButton>
                <IconButton className={styles.iconButton}><NotificationsNoneOutlinedIcon /></IconButton>

                {user ? (
                    <>
                        <Button
                            className={styles.logoutbtn}
                            onClick={async () => { await handleLogOut() }}
                        >
                            Log Out
                        </Button>
                    </>
                ) : (
                    <Button
                        className={styles.loginButton}
                        onClick={() => {
                            router.push("/login")
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </Box>

            <CreateRoomModal isOpen={openCreateRoomModal} onClose={handleAddRoomClose} />
        </Box >
    )
}