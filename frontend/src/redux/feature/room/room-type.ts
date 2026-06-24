export interface Room {
    uuid: string;
    name: string;
    description: string;
    creator_uuid: string;
    creator: User;
    membersCount: number;
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
}

export interface User {
    uuid: string;
    email: string;
    name: string | null;
    profile_image: string | null;
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
}

export interface CreateRoomPayload {
    name: string,
    description?: string
}

export interface RoomState {
    myrooms: Room[];
    myRoomsTotalDocuments: number;
    publicRooms: Room[];
    publicRoomsTotalDocuments: number;
    joinedRooms: Room[];
    joinedRoomsTotalDocuments: number;
    viewerCounts: Record<string, number>;
    loading: boolean;
    error: string | null;
}