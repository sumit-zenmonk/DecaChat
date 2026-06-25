import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventUserEnum } from "src/common/infrastruture/socket/socket.enum";
import { OutboxRepository } from "src/module/room-module/infrastructure/repository/outbox.repository";
import { RoomPublishEventEnum } from "src/module/room-module/domain/room/room.event";

@Injectable()
export class DeleteRoomService {
    private readonly ROOM_EXCHANGE = 'room.exchange';
    constructor(
        private readonly repository: RoomRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, uuid: string) {
        const isRoomExists = await this.repository.findByCreatorUuidAndUuid(req.user.uuid, uuid);
        if (!isRoomExists) {
            throw new BadRequestException("Your Room Not Found");
        }
        await this.repository.deleteRoom(uuid);

        await this.outboxRepository.createOutboxEntry({
            exchange_name: this.ROOM_EXCHANGE,
            routing_key: '',
            event_name: RoomPublishEventEnum.ROOM_DELETED,
            message_payload: { room_uuid: isRoomExists.uuid },
        });

        await this.socketService.emitToUser(req.user.uuid, SocketEventUserEnum.ROOM_DELETED, { uuid });
        return;
    }
}