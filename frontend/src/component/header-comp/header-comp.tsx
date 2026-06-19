"use client"

import { useRouter } from "next/navigation"
import { Box, Button, IconButton, Typography } from "@mui/material"
import { RootState } from "@/redux/store"
import styles from "./header-comp.module.css"
import { logoutUser } from "@/redux/feature/auth/auth-action"
import { enqueueSnackbar } from "notistack"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';

export default function HeaderComp() {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: RootState) => state.authReducer);

    const handleLogOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            localStorage.clear()
            router.replace("/")
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }

    return (
        <Box className={styles.container}>
            <Box className={styles.leftContainer}>
                <Typography onClick={() => { router.push("/") }} className={styles.title}>Deca Chat</Typography>
            </Box>

            <Box className={styles.rightContainer}>
                <Button>Create New Room</Button>
                <IconButton className={styles.iconButton}><PeopleOutlineOutlinedIcon /></IconButton>
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
        </Box >
    )
}