"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { RoomChatCreatePayload } from "./chat-type";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8090";
const LIMIT = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
const OFFSET = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0;

export const createRoomChat = createAsyncThunk<
    { message: string },
    RoomChatCreatePayload,
    { state: RootState }
>(
    "room/chat/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${BACKEND_URL}/api/v1/room/chat`, {
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

export const getRoomChats = createAsyncThunk<
    { data: any, totalDocuments: number, room_uuid: string, message: string, limit: number, offset: number },
    { room_uuid: string, limit?: number; offset?: number },
    { state: RootState }
>(
    "room/chats",
    async (
        {
            room_uuid,
            limit = LIMIT,
            offset = OFFSET,
        },
        { rejectWithValue }
    ) => {
        try {

            const res = await fetch(
                `${BACKEND_URL}/api/v1/room/chat/${room_uuid}?limit=${limit}&offset=${offset}`,
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

            return { ...result, room_uuid: room_uuid };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const getRoomChatsAnalytics = createAsyncThunk<
    { data: any, room_uuid: string, message: string },
    { room_uuid: string },
    { state: RootState }
>(
    "room/chats/analytics",
    async (
        {
            room_uuid,
        },
        { rejectWithValue }
    ) => {
        try {

            const res = await fetch(
                `${BACKEND_URL}/api/v1/room/chat/analytics/${room_uuid}`,
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

            return { ...result, room_uuid: room_uuid };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteRoomChat = createAsyncThunk<
    { message: string, room_uuid: string, chat_uuid: string, user_uuid: string },
    { chat_uuid: string, room_uuid: string },
    { state: RootState }
>("delete/room/chat", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";
        const user_uuid = getState().authReducer.user?.uuid || "";

        const res = await fetch(`${BACKEND_URL}/api/v1/room/chat/${payload.chat_uuid}`, {
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

        return { message: result.message, room_uuid: payload.room_uuid, chat_uuid: payload.chat_uuid, user_uuid: user_uuid };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});