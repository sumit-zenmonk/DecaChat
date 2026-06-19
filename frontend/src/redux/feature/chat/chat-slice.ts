"use client";

import { createSlice } from "@reduxjs/toolkit";
import { RoomChatState } from "./chat-type";
import { createRoomChat, deleteRoomChat, getRoomChats } from "./chat-action";

const initialState: RoomChatState = {
    roomChats: {},
    roomChatsTotalDocuments: {},
    loading: false,
    error: null,
};

const roomSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        resetRoomError: (state) => {
            state.error = null;
        },
        addChat: (state, action) => {
            const chat = action.payload;
            if (!state.roomChats[chat.room_uuid]) {
                state.roomChats[chat.room_uuid] = [];
            }
            const exists = state.roomChats[chat.room_uuid].some(c => c.uuid === chat.uuid);
            if (!exists) {
                state.roomChats[chat.room_uuid].push(chat);
                state.roomChatsTotalDocuments[chat.room_uuid] = (state.roomChatsTotalDocuments[chat.room_uuid] || 0) + 1;
            }
        },
        removeChat: (state, action) => {
            const { chat_uuid, room_uuid } = action.payload;
            if (state.roomChats[room_uuid]) {
                state.roomChats[room_uuid] = state.roomChats[room_uuid].filter(c => c.uuid !== chat_uuid);
                state.roomChatsTotalDocuments[room_uuid] = Math.max(0, (state.roomChatsTotalDocuments[room_uuid] || 1) - 1);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRoomChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRoomChat.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createRoomChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getRoomChats.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRoomChats.fulfilled, (state, action) => {
                const { data, totalDocuments, room_uuid, offset } = action.payload;
                state.loading = false;
                state.error = null;
                if (!state.roomChats[room_uuid] || offset === 0) {
                    state.roomChats[room_uuid] = data;
                } else {
                    state.roomChats[room_uuid] = [...state.roomChats[room_uuid], ...data];
                }
                state.roomChatsTotalDocuments[room_uuid] = totalDocuments;
            })
            .addCase(getRoomChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteRoomChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRoomChat.fulfilled, (state, action) => {
                state.loading = false;
                const { chat_uuid, room_uuid, message, user_uuid } = action.payload;
                if (state.roomChats[room_uuid]) {
                    state.roomChats[room_uuid] = state.roomChats[room_uuid].filter(c => c.uuid !== chat_uuid);
                    state.roomChatsTotalDocuments[room_uuid] = Math.max(0, (state.roomChatsTotalDocuments[room_uuid] || 1) - 1);
                }
                state.error = null;
            })
            .addCase(deleteRoomChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { resetRoomError, addChat, removeChat } = roomSlice.actions;
export default roomSlice.reducer;