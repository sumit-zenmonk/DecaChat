import styles from "./main.module.css";
import { Box } from "@mui/material";
import HeaderComp from '@/component/header-comp/header-comp';
import DashboardComp from '@/component/dashboard-comp/dashboard-comp';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box className={styles.layout}>
      <HeaderComp />

      <Box className={styles.mainContent}>
        <Box className={styles.leftContent}>
          <DashboardComp />
        </Box>

        <Box className={styles.rightContent}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
