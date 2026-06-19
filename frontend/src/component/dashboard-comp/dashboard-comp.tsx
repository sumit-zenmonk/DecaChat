"use client";

import { useState } from "react";
import styles from "./dashboard-comp.module.css";
import { Box, Button, Typography } from "@mui/material";
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';

export default function DashboardComp() {
  const [activeTab, setActiveTab] = useState("dashboard/overview");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard/overview":
        return <></>;
      default:
        return <></>;
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.sidebar}>
        <Box
          className={`${styles.menuItem} ${activeTab === "dashboard/overview" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("dashboard/overview")}
        >
          <AutoAwesomeMosaicOutlinedIcon />
          <Typography>Overview</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activeTab === "dashboard/members" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("dashboard/members")}
        >
          <EditNoteOutlinedIcon />
          <Typography>Members</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activeTab === "dashboard/settings" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("dashboard/settings")}
        >
          <SettingsOutlinedIcon />
          <Typography>Settings</Typography>
        </Box>

        <Box
          className={`${styles.menuItem} ${activeTab === "dashboard/logs" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("dashboard/logs")}
        >
          <RestoreOutlinedIcon />
          <Typography>Logs</Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className={styles.main}>
        {renderContent()}
      </Box>
    </Box>
  );
}