"use client"

import './globals.css'

import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { LayoutSocketListener } from '@/layout/socket-listener/socket-listener';
import { SnackbarProvider } from 'notistack';
import { PersistGate } from "redux-persist/lib/integration/react";
import { StyledEngineProvider } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <StyledEngineProvider injectFirst>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <LayoutSocketListener />
                {children}
              </SnackbarProvider>
            </PersistGate>
          </Provider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
