"use client"

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

//common reducer
import authReducer from "../feature/auth/auth-slice";
import roomReducer from "../feature/room/room-slice";
import roomMemberReducer from "../feature/member/member-slice";
import chatReducer from "../feature/chat/chat-slice";
import commonReducer from "../feature/common/common-slice";

const persistConfig = {
    key: "root",
    storage,
};

const appReducer = combineReducers({
    authReducer: authReducer,
    roomReducer: roomReducer,
    roomMemberReducer: roomMemberReducer,
    chatReducer: chatReducer,
    commonReducer: commonReducer,
});

const rootReducer = (state: any, action: any) => {
    if (action.type.includes("auth/logout/fulfilled")) {
        // storage.removeItem("persist:root");
        state = undefined;
    }
    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;