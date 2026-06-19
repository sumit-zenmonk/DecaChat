// Payload Types for Room Module
export interface UserRegisteredMQEventPayload {
    uuid: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type RoomEventPayloadMap = {
    'user.registered': UserRegisteredMQEventPayload,
};

// Generic union type
export type RoomEventPayload = RoomEventPayloadMap[keyof RoomEventPayloadMap];

// 1. Define the Handler Function Type
export type EventHandlerFunction<K extends keyof RoomEventPayloadMap> =
    (payload: RoomEventPayloadMap[K], outbox_uuid: string, event_name: string) => Promise<void>;

// 2. Map of exact handler signatures
export type RoomEventHandlerMap = {
    [K in keyof RoomEventPayloadMap]?: EventHandlerFunction<K>[];
};