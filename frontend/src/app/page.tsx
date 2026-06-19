"use client";

import { Box } from "@mui/material";
import styles from "./home.module.css";
import HeaderComp from "@/component/header-comp/header-comp";
import DashboardComp from "@/component/dashboard-comp/dashboard-comp";

export default function Home() {
  return (
    <Box className={styles.container}>
      <HeaderComp />
      <DashboardComp />
    </Box>
  );
}