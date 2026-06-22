export default function useRoomRouteCheck(pathname: string) {
    // Split the URL into segments: ["", "room", "uuid", "chat"]
    const segments = pathname.split('/');

    // Check if it's either /room/[uuid] or /room/[uuid]/chat
    const isRoomRoute =
        (segments[1] === 'room' && segments.length === 3) ||
        (segments[1] === 'room' && segments[3] === 'chat' && segments.length === 4);

    if (isRoomRoute) {
        return { uuid: segments[2] }; // Returns the uuid (e.g., "123-abc")
    }

    return { uuid: null };
}
