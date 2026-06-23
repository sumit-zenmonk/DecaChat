"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { connectAuthSocket, connectUnAuthSocket, disconnectAuthSocket } from "@/service/socket/socket";
import { SocketEventNameEnum } from "@/service/socket/socket-event.enum";

import { addJoinedRoom, addMyRoom, removeJoinedRoom, removeMyRoom, updateRoomViewerCount } from "@/redux/feature/room/room-slice";
import { addChat, removeChat } from "@/redux/feature/chat/chat-slice";

export const LayoutSocketListener = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.authReducer);
    const unauth_socket = connectUnAuthSocket();

    useEffect(() => {
        if (token) {
            const auth_socket = connectAuthSocket(token);

            auth_socket.on(SocketEventNameEnum.ROOM_CREATED, (data) => {
                console.log(SocketEventNameEnum.ROOM_CREATED, data);
                dispatch(addMyRoom(data));
            });

            auth_socket.on(SocketEventNameEnum.ROOM_DELETED, (data) => {
                console.log(SocketEventNameEnum.ROOM_DELETED, data);
                dispatch(removeMyRoom(data.uuid));
            });

            auth_socket.on(SocketEventNameEnum.ROOM_MEMBER_CREATED, (data) => {
                console.log(SocketEventNameEnum.ROOM_MEMBER_CREATED, data);
                dispatch(addJoinedRoom(data));
            });

            auth_socket.on(SocketEventNameEnum.ROOM_MEMBER_DELETED, (data) => {
                console.log(SocketEventNameEnum.ROOM_MEMBER_DELETED, data);
                dispatch(removeJoinedRoom(data.room_uuid));
            });

            auth_socket.on(SocketEventNameEnum.ROOM_CHAT_CREATED, (data) => {
                console.log(SocketEventNameEnum.ROOM_CHAT_CREATED, data);
                dispatch(addChat(data));
            });

            auth_socket.on(SocketEventNameEnum.ROOM_CHAT_DELETED, (data) => {
                console.log(SocketEventNameEnum.ROOM_CHAT_DELETED, data);
                dispatch(removeChat(data));
            });

            auth_socket.on(SocketEventNameEnum.ROOM_VIEWER_COUNT, (data: { room_uuid: string; count: number }) => {
                console.log(SocketEventNameEnum.ROOM_VIEWER_COUNT, data);
                dispatch(updateRoomViewerCount(data));
            });

            return () => {
                auth_socket.off(SocketEventNameEnum.ROOM_CREATED);
                auth_socket.off(SocketEventNameEnum.ROOM_DELETED);
                auth_socket.off(SocketEventNameEnum.ROOM_MEMBER_CREATED);
                auth_socket.off(SocketEventNameEnum.ROOM_MEMBER_DELETED);
                auth_socket.off(SocketEventNameEnum.ROOM_CHAT_CREATED);
                auth_socket.off(SocketEventNameEnum.ROOM_CHAT_DELETED);
                auth_socket.off(SocketEventNameEnum.ROOM_VIEWER_COUNT);
            };
        }

        if (unauth_socket) {
            unauth_socket.on(SocketEventNameEnum.ROOM_VIEWER_COUNT, (data: { room_uuid: string; count: number }) => {
                console.log(SocketEventNameEnum.ROOM_VIEWER_COUNT, data);
                dispatch(updateRoomViewerCount(data));
            });

            return () => {
                unauth_socket.off(SocketEventNameEnum.ROOM_VIEWER_COUNT);
            };
        }
    }, [dispatch]);

    return null;
};