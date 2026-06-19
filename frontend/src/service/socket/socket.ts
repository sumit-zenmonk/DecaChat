import { io, Socket } from "socket.io-client"

let auth_socket: Socket | null = null
let unauth_socket: Socket | null = null
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8090";

export const connectAuthSocket = (token: string): Socket => {
    if (!auth_socket) {
        auth_socket = io(BACKEND_URL, {
            auth: { token }
        })
        console.log('Auth socket Connected', auth_socket);
    }
    return auth_socket;
}
export const disconnectAuthSocket = (): void => {
    if (auth_socket) {
        auth_socket.disconnect()
        auth_socket = null
    }
}

export const connectUnAuthSocket = (): Socket => {
    if (!unauth_socket) {
        unauth_socket = io(BACKEND_URL, {});
    }
    console.log('UnAuth socket Connected', unauth_socket);
    return unauth_socket;
};
export const disconnectUnAuthSocket = (): void => {
    if (unauth_socket) {
        unauth_socket.disconnect();
        unauth_socket = null;
    }
};

export const getAuthSocket = (): Socket | null => auth_socket
export const getUnAuthSocket = (): Socket | null => unauth_socket