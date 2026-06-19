"use client"

import { Box } from "@mui/material";
import HeaderComp from '@/component/header-comp/header-comp';
import DashboardComp from '@/component/dashboard-comp/dashboard-comp';

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <HeaderComp />
      <DashboardComp />
      {children}
    </>
  );
}
