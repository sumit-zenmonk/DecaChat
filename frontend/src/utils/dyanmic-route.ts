export default function getDynamicRoute(pathname: string) {
    // Split the URL into segments: ["", "room", "room_uuid", "chat"]
    const segments = pathname.split('/');

    // Check if it's either /room/[room_uuid] or /room/[room_uuid]/chat
    const isRoomRoute =
        (segments[1] === 'room' && segments.length === 3) ||
        (segments[1] === 'room' && segments[3] === 'chat' && segments.length === 4);

    if (isRoomRoute) {
        return { room_uuid: segments[2] }; // Returns the room_uuid (e.g., "123-abc")
    }

    return { room_uuid: null };
}
