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
import { Injectable, Logger } from '@nestjs/common';
import { JwtHelperService } from 'src/module/user-module/infrastructure/services/jwt.service';
import { UserRepository } from 'src/module/user-module/infrastructure/repository/user.repository';
import * as RoomUserRepository from 'src/module/room-module/infrastructure/repository/user.repository';
import { SocketEventNameEnum, SocketEventGroupRoomEnum } from './socket.enum';

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

    private readonly logger = new Logger(SocketService.name);

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
                this.logger.log(`Unauth Socket Request Connected`);
                return;
            }

            const decoded = await this.jwtHelperService.verifyJwtToken(token);
            const user = await this.userRepository.findByUuid(decoded.uuid);

            if (!user) {
                client.disconnect();
                return;
            }

            this.activeUsers.set(decoded.uuid, client.id);
            this.logger.log(`User connected: ${decoded.uuid}`);
            await this.userRoomRepository.updateOnlineStatus(decoded.uuid, true);
        } catch (e) {
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        for (const [uuid, socketId] of this.activeUsers.entries()) {
            if (socketId === client.id) {
                this.activeUsers.delete(uuid);
                this.logger.log(`User disconnected: ${uuid}`);
                await this.userRoomRepository.updateOnlineStatus(uuid, false);
                break;
            }
        }

        for (const [roomUuid, viewers] of this.roomViewers.entries()) {
            if (viewers.has(client.id)) {
                viewers.delete(client.id);
                const count = viewers.size;
                await this.emitToRoom(roomUuid, SocketEventNameEnum.ROOM_VIEWER_COUNT, { room_uuid: roomUuid, count });
            }
        }
    }

    @SubscribeMessage(SocketEventGroupRoomEnum.GROUP_ROOM_CONNECT)
    async handleRoomConnection(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket
    ) {
        this.logger.log(`Unauth Room Connected: ${data.room_uuid}`);
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
                this.logger.debug(`Socket event fired in room: ${SocketEventNameEnum.ROOM_VIEWER_COUNT}`);
                await this.emitToRoom(roomUuid, SocketEventNameEnum.ROOM_VIEWER_COUNT, { room_uuid: roomUuid, count });
            }
        }
    }

    // send message to room
    async emitToRoom(room_uuid: string, event: string, data: any) {
        this.logger.debug(`Socket event fired to room: event -> ${event} and room_uuid -> ${room_uuid}`);
        await this.server.to(room_uuid).emit(event, data);
        return;
    }

    // send message to receiver only
    async emitToUser(userUuid: string, event: string, data: any) {
        const socketId = this.activeUsers.get(userUuid);
        this.logger.debug(`Socket event fired to user: event -> ${event} and socketId -> ${socketId}`);
        if (socketId) {
            await this.server.to(socketId).emit(event, data);
        }
        return;
    }
}
