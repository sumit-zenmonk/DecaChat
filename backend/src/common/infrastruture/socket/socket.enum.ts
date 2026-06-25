export enum SocketEventNameEnum {
    ROOM_CREATED = 'room.created',
    ROOM_DELETED = 'room.deleted',
    ROOM_MEMBER_CREATED = 'room.member.created',
    ROOM_MEMBER_DELETED = 'room.member.deleted',
    ROOM_CHAT_CREATED = 'room.chat.created',
    ROOM_CHAT_DELETED = 'room.chat.deleted',
    ROOM_VIEWER_COUNT = 'room.viewer.count',
    USER_STATUS = 'user.status',
}

export enum SocketEventGroupRoomEnum {
    GROUP_ROOM_CONNECT = 'group.room.connect',
    GROUP_ROOM_CHAT_CREATED = 'group.room.chat.created',
    GROUP_ROOM_CHAT_DELETED = 'group.room.chat.deleted',
}