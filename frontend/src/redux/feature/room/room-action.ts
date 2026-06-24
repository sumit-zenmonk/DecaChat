"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { CreateRoomPayload, Room } from "./room-type";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8090";
const LIMIT = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
const OFFSET = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0;

export const createRoom = createAsyncThunk<
    void,
    CreateRoomPayload,
    { state: RootState }
>(
    "room/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${BACKEND_URL}/api/v1/room`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const getMyRooms = createAsyncThunk<
    { data: Room[], totalDocuments: number, message: string, limit: number, offset: number },
    { limit?: number; offset?: number; search?: string },
    { state: RootState }
>(
    "room/your",
    async (
        {
            limit = LIMIT,
            offset = OFFSET,
            search = "",
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${BACKEND_URL}/api/v1/room?limit=${limit}&offset=${offset}&search=${encodeURIComponent(search)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const getPublicRooms = createAsyncThunk<
    { data: Room[], totalDocuments: number, message: string, limit: number, offset: number },
    { limit?: number; offset?: number; search?: string },
    { state: RootState }
>(
    "room/public",
    async (
        {
            limit = LIMIT,
            offset = OFFSET,
            search = "",
        },
        { rejectWithValue }
    ) => {
        try {

            const res = await fetch(
                `${BACKEND_URL}/api/v1/room/public?limit=${limit}&offset=${offset}&search=${encodeURIComponent(search)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const getJoinedRooms = createAsyncThunk<
    { data: Room[], totalDocuments: number, message: string, limit: number, offset: number },
    { limit?: number; offset?: number; search?: string },
    { state: RootState }
>(
    "room/joined",
    async (
        {
            limit = LIMIT,
            offset = OFFSET,
            search = "",
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${BACKEND_URL}/api/v1/room/join?limit=${limit}&offset=${offset}&search=${encodeURIComponent(search)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteRoom = createAsyncThunk<
    { message: string; uuid: string },
    { uuid: string },
    { state: RootState }
>("delete/room", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";

        const res = await fetch(`${BACKEND_URL}/api/v1/room/${payload.uuid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message);
        }

        return { message: result.message, uuid: payload.uuid };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});