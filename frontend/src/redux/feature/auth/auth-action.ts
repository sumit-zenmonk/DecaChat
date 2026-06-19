"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { persistor } from "@/redux/store"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8090";

export const loginUser = createAsyncThunk(
    "auth/login",
    async (
        { email }: { email: string; },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email })
            })

            const result = await res.json()

            if (!res.ok) throw new Error(result.message)

            return result
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await persistor.purge();
            return null
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)