export enum SocketEventUserEnum {
    ROOM_CREATED = 'room.created',
    ROOM_DELETED = 'room.deleted',
    ROOM_MEMBER_CREATED = 'room.member.created',
    ROOM_MEMBER_DELETED = 'room.member.deleted',
    ROOM_CHAT_CREATED = 'room.chat.created',
    ROOM_CHAT_DELETED = 'room.chat.deleted',
}

export enum SocketEventGroupRoomEnum {
    GROUP_ROOM_CONNECT = 'group.room.connect',
    GROUP_ROOM_DISCONNECT = 'group.room.disconnect',
    GROUP_ROOM_VIEWER_COUNT = 'group.room.viewer.count',
    GROUP_ROOM_CHAT_CREATED = 'group.room.chat.created',
    GROUP_ROOM_CHAT_DELETED = 'group.room.chat.deleted',
}

export enum SocketEventBroadcastEnum {
    USER_ONLINE_STATUS = 'user.online.status',
}