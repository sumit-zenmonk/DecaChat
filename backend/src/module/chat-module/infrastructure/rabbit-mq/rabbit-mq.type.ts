import { RoomMemberRole } from "../../domain/room-member/room-member.enum";

// Payload Types for Chat Module
export interface UserRegisteredMQEventPayload {
    uuid: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface RoomCreatedMQEventPayload {
    uuid: string;
    name: string;
    description: string;
    creator_uuid: string;
    creator: User;
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
}

export interface RoomDeletedMQEventPayload {
    room_uuid: string;
}

export interface RoomMemberDeletedMQEventPayload {
    room_member_uuid: string;
}

export interface User {
    uuid: string;
    email: string;
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
}

export interface RoomMemberCreatedMQEventPayload {
    role: RoomMemberRole,
    room: {
        name: string,
        uuid: string,
        created_at: Date,
        deleted_at: null,
        updated_at: Date,
        description: string,
        creator_uuid: string,
    },
    uuid: string,
    room_uuid: string,
    user_uuid: string,
    created_at: Date,
    deleted_at: Date,
    updated_at: Date,
}

export type ChatEventPayloadMap = {
    'user.registered': UserRegisteredMQEventPayload,
    'room.created': RoomCreatedMQEventPayload,
    'room.deleted': RoomDeletedMQEventPayload,
    'room.member.created': RoomMemberCreatedMQEventPayload,
    'room.member.deleted': RoomMemberDeletedMQEventPayload,
};

// Generic union type
export type ChatEventPayload = ChatEventPayloadMap[keyof ChatEventPayloadMap];

// 1. Define the Handler Function Type
export type EventHandlerFunction<K extends keyof ChatEventPayloadMap> =
    (payload: ChatEventPayloadMap[K], outbox_uuid: string, event_name: string) => Promise<void>;

// 2. Map of exact handler signatures
export type ChatEventHandlerMap = {
    [K in keyof ChatEventPayloadMap]?: EventHandlerFunction<K>[];
};