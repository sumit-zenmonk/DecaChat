export enum SocketEventNameEnum {
    ROOM_CREATED = 'room.created',
    ROOM_DELETED = 'room.deleted',
    ROOM_MEMBER_CREATED = 'room.member.created',
    ROOM_MEMBER_DELETED = 'room.member.deleted',
    ROOM_CHAT_CREATED = 'room.chat.created',
    ROOM_CHAT_DELETED = 'room.chat.deleted',
    ROOM_VIEWER_COUNT = 'room.viewer.count',
}

export enum SocketEventSubscribeEnum {
    SUBSCRIBE_ROOM_CONNECT = 'subscribe.room.connect',
    SUBSCRIBE_ROOM_CHAT_CREATED = 'subscribe.room.chat.created',
    SUBSCRIBE_ROOM_CHAT_DELETED = 'subscribe.room.chat.deleted',
}