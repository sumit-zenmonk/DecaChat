export interface RoomChat {
    uuid: string;
    member_uuid: string;
    room_uuid: string;
    parent_uuid: string | null;
    message: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    member: {
        uuid: string;
        user_uuid: string;
        room_uuid: string;
        role: string;
    };
    room: {
        uuid: string;
        name: string;
        description: string;
    };
}

export interface RoomChatCreatePayload {
    member_uuid: string;
    room_uuid: string;
    parent_uuid?: string;
    message: string;
}

export interface RoomChatState {
    roomChats: Record<string, RoomChat[]>;
    roomChatsTotalDocuments: Record<string, number>;
    loading: boolean;
    error: string | null;
}