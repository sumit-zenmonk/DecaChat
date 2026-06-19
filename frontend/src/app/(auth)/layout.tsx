"use client"

import { Box } from "@mui/material";
import styles from "./auth.module.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box className={styles.layout}>
            {children}
        </Box>
    );
}
