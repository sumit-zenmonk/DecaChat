"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { connectSocket } from "@/service/socket/socket";
import { SocketEventBroadcastEnum, SocketEventGroupRoomEnum, SocketEventUserEnum } from "@/service/socket/socket-event.enum";

import { addJoinedRoom, addMyRoom, removeJoinedRoom, removeMyRoom, updateRoomViewerCount } from "@/redux/feature/room/room-slice";
import { addChat, removeChat } from "@/redux/feature/chat/chat-slice";
import { updateMemberOnlineStatus } from "@/redux/feature/member/member-slice";

export const LayoutSocketListener = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.authReducer);
    const socket = connectSocket(token || undefined);

    useEffect(() => {
        socket.on(SocketEventUserEnum.ROOM_CREATED, (data) => {
            console.log(SocketEventUserEnum.ROOM_CREATED, data);
            dispatch(addMyRoom(data));
        });

        socket.on(SocketEventUserEnum.ROOM_DELETED, (data) => {
            console.log(SocketEventUserEnum.ROOM_DELETED, data);
            dispatch(removeMyRoom(data.uuid));
        });

        socket.on(SocketEventUserEnum.ROOM_MEMBER_CREATED, (data) => {
            console.log(SocketEventUserEnum.ROOM_MEMBER_CREATED, data);
            dispatch(addJoinedRoom(data));
        });

        socket.on(SocketEventUserEnum.ROOM_MEMBER_DELETED, (data) => {
            console.log(SocketEventUserEnum.ROOM_MEMBER_DELETED, data);
            dispatch(removeJoinedRoom(data.room_uuid));
        });

        socket.on(SocketEventUserEnum.ROOM_CHAT_CREATED, (data) => {
            console.log(SocketEventUserEnum.ROOM_CHAT_CREATED, data);
            dispatch(addChat(data));
        });

        socket.on(SocketEventUserEnum.ROOM_CHAT_DELETED, (data) => {
            console.log(SocketEventUserEnum.ROOM_CHAT_DELETED, data);
            dispatch(removeChat(data));
        });

        socket.on(SocketEventBroadcastEnum.USER_ONLINE_STATUS, (data: { user_uuid: string; is_online: boolean }) => {
            console.log(SocketEventBroadcastEnum.USER_ONLINE_STATUS, data);
            dispatch(updateMemberOnlineStatus(data));
        });

        socket.on(SocketEventGroupRoomEnum.GROUP_ROOM_VIEWER_COUNT, (data: { room_uuid: string; count: number }) => {
            console.log(SocketEventGroupRoomEnum.GROUP_ROOM_VIEWER_COUNT, data);
            dispatch(updateRoomViewerCount(data));
        });

        socket.on(SocketEventGroupRoomEnum.GROUP_ROOM_CHAT_CREATED, (data: any) => {
            console.log(SocketEventGroupRoomEnum.GROUP_ROOM_CHAT_CREATED, data);
            dispatch(addChat(data));
        });
        socket.on(SocketEventGroupRoomEnum.GROUP_ROOM_CHAT_DELETED, (data: any) => {
            console.log(SocketEventGroupRoomEnum.GROUP_ROOM_CHAT_DELETED, data);
            dispatch(removeChat(data));
        });

        return () => {
            socket.off(SocketEventUserEnum.ROOM_CREATED);
            socket.off(SocketEventUserEnum.ROOM_DELETED);
            socket.off(SocketEventUserEnum.ROOM_MEMBER_CREATED);
            socket.off(SocketEventUserEnum.ROOM_MEMBER_DELETED);
            socket.off(SocketEventUserEnum.ROOM_CHAT_CREATED);
            socket.off(SocketEventUserEnum.ROOM_CHAT_DELETED);
            socket.off(SocketEventBroadcastEnum.USER_ONLINE_STATUS);
            socket.off(SocketEventGroupRoomEnum.GROUP_ROOM_VIEWER_COUNT);
            socket.off(SocketEventGroupRoomEnum.GROUP_ROOM_CHAT_CREATED);
            socket.off(SocketEventGroupRoomEnum.GROUP_ROOM_CHAT_DELETED);
        };

    }, [dispatch, token]);

    return null;
};