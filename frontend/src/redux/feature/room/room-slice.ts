"use client";

import { createSlice } from "@reduxjs/toolkit";
import { createRoom, deleteRoom, getJoinedRooms, getMyRooms, getPublicRooms } from "./room-action";
import { Room, RoomState } from "./room-type";
import { deleteRoomMember } from "../member/member-action";

const initialState: RoomState = {
    myrooms: [],
    myRoomsTotalDocuments: 0,
    publicRooms: [],
    publicRoomsTotalDocuments: 0,
    joinedRooms: [],
    joinedRoomsTotalDocuments: 0,
    viewerCounts: {},
    loading: false,
    error: null,
};

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        updateRoomViewerCount: (state, action: { payload: { room_uuid: string; count: number } }) => {
            state.viewerCounts[action.payload.room_uuid] = action.payload.count;
        },
        resetRoomError: (state) => {
            state.error = null;
        },
        addMyRoom: (state, action) => {
            state.myrooms.unshift(action.payload as Room);
            state.myRoomsTotalDocuments += 1;

            state.publicRooms.unshift(action.payload as Room);
            state.publicRoomsTotalDocuments += 1;
        },
        removeMyRoom: (state, action) => {
            state.myrooms = state.myrooms.filter((room) => room.uuid !== action.payload);
            state.myRoomsTotalDocuments -= 1;

            state.joinedRooms = state.joinedRooms.filter((room) => room.uuid !== action.payload);
            state.joinedRoomsTotalDocuments -= 1;

            state.publicRooms = state.publicRooms.filter((room) => room.uuid !== action.payload);
            state.publicRoomsTotalDocuments -= 1;
        },
        addJoinedRoom: (state, action) => {
            state.joinedRooms.unshift(action.payload as Room);
            state.joinedRoomsTotalDocuments += 1;
        },
        removeJoinedRoom: (state, action) => {
            state.joinedRooms = state.joinedRooms.filter((room) => room.uuid !== action.payload);
            state.joinedRoomsTotalDocuments -= 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRoom.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.myrooms = state.myrooms.filter((room) => room.uuid !== action.payload.uuid);
                state.myRoomsTotalDocuments -= 1;

                state.publicRooms = state.publicRooms.filter((room) => room.uuid !== action.payload.uuid);
                state.publicRoomsTotalDocuments -= 1;

                state.joinedRooms = state.joinedRooms.filter((room) => room.uuid !== action.payload.uuid);
                state.joinedRoomsTotalDocuments -= 1;

                if (state.viewerCounts) {
                    delete state.viewerCounts[action.payload.uuid];
                }
            })
            .addCase(deleteRoomMember.fulfilled, (state, action) => {
                state.joinedRooms = state.joinedRooms.filter((room) => room.uuid !== action.payload.room_uuid);
                state.joinedRoomsTotalDocuments -= 1;
            })
            .addCase(getMyRooms.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyRooms.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.offset === 0) {
                    state.myrooms = action.payload.data;
                } else {
                    const mergedRooms = [
                        ...state.myrooms,
                        ...action.payload.data,
                    ];
                    state.myrooms = Array.from(new Map(mergedRooms.map((room) => [room.uuid, room])).values());
                }

                state.myRoomsTotalDocuments = action.payload.totalDocuments;
                state.error = null;
            })
            .addCase(getMyRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getPublicRooms.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPublicRooms.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.offset === 0) {
                    state.publicRooms = action.payload.data;
                } else {
                    const mergedRooms = [
                        ...state.publicRooms,
                        ...action.payload.data,
                    ];
                    state.publicRooms = Array.from(new Map(mergedRooms.map((room) => [room.uuid, room])).values());
                }

                state.publicRoomsTotalDocuments = action.payload.totalDocuments;
                state.error = null;
            })
            .addCase(getPublicRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getJoinedRooms.pending, (state) => {
                state.loading = true;
            })
            .addCase(getJoinedRooms.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.offset === 0) {
                    state.joinedRooms = action.payload.data;
                } else {
                    const mergedRooms = [
                        ...state.joinedRooms,
                        ...action.payload.data,
                    ];
                    state.joinedRooms = Array.from(new Map(mergedRooms.map((room) => [room.uuid, room])).values());
                }

                state.joinedRoomsTotalDocuments = action.payload.totalDocuments;
                state.error = null;
            })
            .addCase(getJoinedRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { resetRoomError, addMyRoom, removeMyRoom, addJoinedRoom, removeJoinedRoom, updateRoomViewerCount } = roomSlice.actions;
export default roomSlice.reducer;