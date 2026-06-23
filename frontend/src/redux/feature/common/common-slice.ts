"use client";

import { createSlice } from "@reduxjs/toolkit";
import { CommonState } from "./common-type";

const initialState: CommonState = {
    chatDrawerState: false,
};

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        togglechatDrawerState: (state) => {
            state.chatDrawerState = !state.chatDrawerState;
        },
    },
});

export const { togglechatDrawerState } = commonSlice.actions;
export default commonSlice.reducer;