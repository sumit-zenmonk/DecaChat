import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtHelperService } from 'src/module/user-module/infrastructure/services/jwt.service';
import { UserRepository } from 'src/module/user-module/infrastructure/repository/user.repository';
import * as RoomUserRepository from 'src/module/room-module/infrastructure/repository/user.repository';
import { SocketEventNameEnum, SocketEventSubscribeEnum } from './socket.enum';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private activeUsers = new Map<string, string>();
    // user_uuid -> socket_id

    private roomViewers = new Map<string, Set<string>>();
    // room_uuid -> Set of socket_ids

    constructor(
        private readonly jwtHelperService: JwtHelperService,
        private readonly userRepository: UserRepository,
        private readonly userRoomRepository: RoomUserRepository.UserRepository,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization;
            if (!token) {
                console.log(`Unauth Socket Request Connected`);
                return;
            }

            const decoded = await this.jwtHelperService.verifyJwtToken(token);
            const user = await this.userRepository.findByUuid(decoded.uuid);

            if (!user) {
                client.disconnect();
                return;
            }

            this.activeUsers.set(decoded.uuid, client.id);
            console.log(`User connected: ${decoded.uuid}`);
            await this.userRoomRepository.updateOnlineStatus(decoded.uuid, true);
        } catch (e) {
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        for (const [uuid, socketId] of this.activeUsers.entries()) {
            if (socketId === client.id) {
                this.activeUsers.delete(uuid);
                console.log(`User disconnected: ${uuid}`);
                await this.userRoomRepository.updateOnlineStatus(uuid, false);
                break;
            }
        }

        for (const [roomUuid, viewers] of this.roomViewers.entries()) {
            if (viewers.has(client.id)) {
                viewers.delete(client.id);
                const count = viewers.size;
                this.server.emit(SocketEventNameEnum.ROOM_VIEWER_COUNT, { room_uuid: roomUuid, count });
            }
        }
    }

    // send message to receiver only
    async emitToUser(userUuid: string, event: string, data: any) {
        const socketId = this.activeUsers.get(userUuid);
        if (socketId) {
            console.log(`Socket event fired to user: ${event}`);
            this.server.to(socketId).emit(event, data);
        }
    }

    @SubscribeMessage(SocketEventSubscribeEnum.SUBSCRIBE_ROOM_CONNECT)
    handleRoomConnection(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket
    ) {
        console.log(`Unauth Room Connected: ${data.room_uuid}`);
        client.join(data.room_uuid);

        const roomUuid = data.room_uuid;
        if (roomUuid) {
            if (!this.roomViewers.has(roomUuid)) {
                this.roomViewers.set(roomUuid, new Set<string>());
            }
            const viewers = this.roomViewers.get(roomUuid);
            if (viewers) {
                viewers.add(client.id);
                const count = viewers.size;
                this.server.emit(SocketEventNameEnum.ROOM_VIEWER_COUNT, { room_uuid: roomUuid, count });
            }
        }
    }

    // send message to room
    async emitToRoom(room_uuid: string, event: string, data: any) {
        console.log(`Socket event fired in room: ${event}`);
        this.server.to(room_uuid).emit(event, data);
    }
}
