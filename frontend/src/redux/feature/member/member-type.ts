import { RoomMemberRole } from "./room-member.enum";

export interface Room {
    uuid: string;
    name: string;
    description: string;
    creator_uuid: string;
    creator: User;
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
}

export interface User {
    uuid: string;
    email: string;
    name: string | null;
    is_online: boolean;
    profile_image: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface RoomMember {
    uuid: string;
    room_uuid: string;
    user_uuid: string;
    room: Room;
    role: RoomMemberRole,
    user: User;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface RoomMemberState {
    roomMembers: Record<string, RoomMember[]>;
    roomMembersTotalDocuments: Record<string, number>;
    loading: boolean;
    error: string | null;
}

export interface CreateRoomMemberPayload {
    room_uuid: string
}