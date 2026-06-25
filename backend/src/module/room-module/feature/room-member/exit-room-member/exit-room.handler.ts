import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventUserEnum } from "src/common/infrastruture/socket/socket.enum";
import { OutboxRepository } from "src/module/room-module/infrastructure/repository/outbox.repository";
import { RoomMemberPublishEventEnum } from "src/module/room-module/domain/room-member/room-member-event.entity";

@Injectable()
export class ExitRoomMemberService {
    private readonly ROOM_EXCHANGE = 'room.exchange';

    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, room_uuid: string) {
        const isRoomMemberExists = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid, room_uuid);
        if (!isRoomMemberExists) {
            throw new BadRequestException("Member Not Found");
        }

        if (req.user.uuid !== isRoomMemberExists.user_uuid) {
            throw new BadRequestException("Not Allowed to remove other member");
        }
        if (req.user.uuid === isRoomMemberExists.room.creator_uuid) {
            throw new BadRequestException("Creator can't be exit room");
        }

        await this.roomMemberRepository.deleteRoomMember(isRoomMemberExists.uuid);

        await this.outboxRepository.createOutboxEntry({
            exchange_name: this.ROOM_EXCHANGE,
            routing_key: '',
            event_name: RoomMemberPublishEventEnum.ROOM_MEMBER_DELETED,
            message_payload: { room_member_uuid: isRoomMemberExists.uuid },
        });


        await this.socketService.emitToUser(req.user.uuid, SocketEventUserEnum.ROOM_MEMBER_DELETED, { room_uuid: room_uuid });
        return;
    }
}