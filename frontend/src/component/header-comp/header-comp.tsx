"use client"

import { useRouter } from "next/navigation"
import { Box, Button } from "@mui/material"
import { RootState } from "@/redux/store"
import styles from "./header-comp.module.css"
import { logoutUser } from "@/redux/feature/auth/auth-action"
import { enqueueSnackbar } from "notistack"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"

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
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    return (
        <header className={styles.header}>
            <Box className={styles.leftContainer}>
                <p onClick={() => { router.push("/") }}>Deca Chat</p>
            </Box>

            <Box className={styles.rightContainer}>
                <Button
                    onClick={() => {
                        router.push("/")
                    }}
                >
                    Public Room
                </Button>

                {user ? (
                    <>
                        <Button
                            onClick={() => {
                                router.push("/dashboard")
                            }}
                        >
                            Dashboard
                        </Button>

                        <Button
                            className={styles.logoutbtn}
                            onClick={async () => { await handleLogOut() }}
                        >
                            Log Out
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={() => {
                            router.push("/login")
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </Box>
        </header >
    )
}