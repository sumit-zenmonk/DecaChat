import { io, Socket } from "socket.io-client"

let socket: Socket | null = null
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8090";

export const connectSocket = (token?: string): Socket => {
    if (!socket || (!socket.auth && token)) {
        socket = io(BACKEND_URL,
            token ? { auth: { token } } : {}
        )
        console.log('Socket Connected', socket);
    }
    return socket;
}
export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export const getSocket = (): Socket | null => socket;