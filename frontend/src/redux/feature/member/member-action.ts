"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { CreateRoomMemberPayload, RoomMember } from "./member-type";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8090";
const LIMIT = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
const OFFSET = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0;

export const createRoomMember = createAsyncThunk<
    { message: string },
    CreateRoomMemberPayload,
    { state: RootState }
>(
    "room/member/create",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${BACKEND_URL}/api/v1/room/member`, {
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

export const deleteRoomMember = createAsyncThunk<
    { message: string; room_uuid: string, user_uuid: string },
    { room_uuid: string },
    { state: RootState }
>("delete/room/member", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";
        const user_uuid = getState().authReducer.user?.uuid || "";

        const res = await fetch(`${BACKEND_URL}/api/v1/room/member/${payload.room_uuid}`, {
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

        return { message: result.message, room_uuid: payload.room_uuid, user_uuid: user_uuid };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const getRoomMembers = createAsyncThunk<
    { data: RoomMember[], totalDocuments: number, room_uuid: string },
    { room_uuid: string, limit?: number; offset?: number },
    { state: RootState }
>(
    "room/member",
    async (
        {
            room_uuid,
            limit = LIMIT,
            offset = OFFSET,
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${BACKEND_URL}/api/v1/room/member/${room_uuid}?limit=${limit}&offset=${offset}`,
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
            return { ...result, room_uuid };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);