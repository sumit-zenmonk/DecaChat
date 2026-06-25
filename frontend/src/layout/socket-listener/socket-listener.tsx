"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { connectAuthSocket, connectUnAuthSocket } from "@/service/socket/socket";
import { SocketEventBroadcastEnum, SocketEventGroupRoomEnum, SocketEventUserEnum } from "@/service/socket/socket-event.enum";

import { addJoinedRoom, addMyRoom, removeJoinedRoom, removeMyRoom, updateRoomViewerCount } from "@/redux/feature/room/room-slice";
import { addChat, removeChat } from "@/redux/feature/chat/chat-slice";
import { updateMemberOnlineStatus } from "@/redux/feature/member/member-slice";

export const LayoutSocketListener = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.authReducer);
    const unauth_socket = connectUnAuthSocket();

    useEffect(() => {
        if (token) {
            const auth_socket = connectAuthSocket(token);

            auth_socket.on(SocketEventUserEnum.ROOM_CREATED, (data) => {
                console.log(SocketEventUserEnum.ROOM_CREATED, data);
                dispatch(addMyRoom(data));
            });

            auth_socket.on(SocketEventUserEnum.ROOM_DELETED, (data) => {
                console.log(SocketEventUserEnum.ROOM_DELETED, data);
                dispatch(removeMyRoom(data.uuid));
            });

            auth_socket.on(SocketEventUserEnum.ROOM_MEMBER_CREATED, (data) => {
                console.log(SocketEventUserEnum.ROOM_MEMBER_CREATED, data);
                dispatch(addJoinedRoom(data));
            });

            auth_socket.on(SocketEventUserEnum.ROOM_MEMBER_DELETED, (data) => {
                console.log(SocketEventUserEnum.ROOM_MEMBER_DELETED, data);
                dispatch(removeJoinedRoom(data.room_uuid));
            });

            auth_socket.on(SocketEventUserEnum.ROOM_CHAT_CREATED, (data) => {
                console.log(SocketEventUserEnum.ROOM_CHAT_CREATED, data);
                dispatch(addChat(data));
            });

            auth_socket.on(SocketEventUserEnum.ROOM_CHAT_DELETED, (data) => {
                console.log(SocketEventUserEnum.ROOM_CHAT_DELETED, data);
                dispatch(removeChat(data));
            });

            auth_socket.on(SocketEventGroupRoomEnum.GROUP_ROOM_VIEWER_COUNT, (data: { room_uuid: string; count: number }) => {
                console.log(SocketEventGroupRoomEnum.GROUP_ROOM_VIEWER_COUNT, data);
                dispatch(updateRoomViewerCount(data));
            });

            auth_socket.on(SocketEventBroadcastEnum.USER_ONLINE_STATUS, (data: { user_uuid: string; is_online: boolean }) => {
                console.log(SocketEventBroadcastEnum.USER_ONLINE_STATUS, data);
                dispatch(updateMemberOnlineStatus(data));
            });

            return () => {
                auth_socket.off(SocketEventUserEnum.ROOM_CREATED);
                auth_socket.off(SocketEventUserEnum.ROOM_DELETED);
                auth_socket.off(SocketEventUserEnum.ROOM_MEMBER_CREATED);
                auth_socket.off(SocketEventUserEnum.ROOM_MEMBER_DELETED);
                auth_socket.off(SocketEventUserEnum.ROOM_CHAT_CREATED);
                auth_socket.off(SocketEventUserEnum.ROOM_CHAT_DELETED);
                auth_socket.off(SocketEventGroupRoomEnum.GROUP_ROOM_VIEWER_COUNT);
                auth_socket.off(SocketEventBroadcastEnum.USER_ONLINE_STATUS);
            };
        }

        if (unauth_socket) {
            unauth_socket.on(SocketEventGroupRoomEnum.GROUP_ROOM_VIEWER_COUNT, (data: { room_uuid: string; count: number }) => {
                console.log(SocketEventGroupRoomEnum.GROUP_ROOM_VIEWER_COUNT, data);
                dispatch(updateRoomViewerCount(data));
            });

            unauth_socket.on(SocketEventBroadcastEnum.USER_ONLINE_STATUS, (data: { user_uuid: string; is_online: boolean }) => {
                console.log(SocketEventBroadcastEnum.USER_ONLINE_STATUS, data);
                dispatch(updateMemberOnlineStatus(data));
            });
            return () => {
                unauth_socket.off(SocketEventGroupRoomEnum.GROUP_ROOM_VIEWER_COUNT);
                unauth_socket.off(SocketEventBroadcastEnum.USER_ONLINE_STATUS);
            };
        }
    }, [dispatch, token]);

    return null;
};