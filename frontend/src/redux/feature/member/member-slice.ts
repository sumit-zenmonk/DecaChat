"use client";

import { createSlice } from "@reduxjs/toolkit";
import { RoomMemberState } from "./member-type";
import { createRoomMember, deleteRoomMember, getRoomMembers } from "./member-action";
import { deleteRoom } from "../room/room-action";

const initialState: RoomMemberState = {
    roomMembers: {},
    roomMembersTotalDocuments: {},
    loading: false,
    error: null,
};

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        resetRoomError: (state) => {
            state.error = null;
        },
        updateMemberOnlineStatus: (state, action: { payload: { user_uuid: string; is_online: boolean } }) => {
            const { user_uuid, is_online } = action.payload;
            if (state.roomMembers) {
                Object.keys(state.roomMembers).forEach((room_uuid) => {
                    if (state.roomMembers[room_uuid]) {
                        state.roomMembers[room_uuid] = state.roomMembers[room_uuid].map((member) => {
                            if (member.user_uuid === user_uuid) {
                                return {
                                    ...member,
                                    user: {
                                        ...member.user,
                                        is_online,
                                    },
                                };
                            }
                            return member;
                        });
                    }
                });
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRoomMember.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRoomMember.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createRoomMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteRoomMember.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteRoomMember.fulfilled, (state, action) => {
                state.roomMembers[action.payload.room_uuid] = state.roomMembers[action.payload.room_uuid].filter((member) => member.user_uuid !== action.payload.user_uuid);
            })
            .addCase(deleteRoomMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getRoomMembers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRoomMembers.fulfilled, (state, action) => {
                const { data, totalDocuments, room_uuid } = action.payload;
                state.loading = false;
                if (!state.roomMembers) {
                    state.roomMembers = {};
                }
                if (!state.roomMembersTotalDocuments) {
                    state.roomMembersTotalDocuments = {};
                }
                state.roomMembers[room_uuid] = data;
                state.roomMembersTotalDocuments[room_uuid] = totalDocuments;
            })
            .addCase(getRoomMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                const room_uuid = action.payload.uuid;
                if (state.roomMembers) {
                    delete state.roomMembers[room_uuid];
                }
                if (state.roomMembersTotalDocuments) {
                    delete state.roomMembersTotalDocuments[room_uuid];
                }
            })
    },
});

export const { resetRoomError, updateMemberOnlineStatus } = roomSlice.actions;
export default roomSlice.reducer;