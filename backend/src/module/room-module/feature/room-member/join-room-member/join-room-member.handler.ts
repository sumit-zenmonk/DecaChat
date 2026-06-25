import { BadRequestException, Injectable } from "@nestjs/common";
import { JoinRoomMemberDto } from "./join-room-member.dto";
import type { Request } from "express";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { SocketEventUserEnum } from "src/common/infrastruture/socket/socket.enum";
import { OutboxRepository } from "src/module/room-module/infrastructure/repository/outbox.repository";
import { RoomMemberEntity } from "src/module/room-module/domain/room-member/room-member.entity";
import { RoomMemberPublishEventEnum } from "src/module/room-module/domain/room-member/room-member-event.entity";

@Injectable()
export class JoinRoomMemberService {
    private readonly ROOM_EXCHANGE = 'room.exchange';

    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, body: JoinRoomMemberDto) {
        const isRoomExists = await this.roomRepository.findByUuid(body.room_uuid);
        if (!isRoomExists) {
            throw new BadRequestException("Room Not Found");
        }

        const members_data = await this.roomMemberRepository.getRoomMemberListing(body.room_uuid);
        if (members_data.total >= Number(process.env.ROOM_MEMBER_LIMIT || 10)) {
            throw new BadRequestException("Room Members Limit Exceeded");
        }

        const isRoomMemberExists = members_data.data.filter((member) => member.user_uuid == req.user.uuid);
        if (isRoomMemberExists.length) {
            throw new BadRequestException("Already Member of Room");
        }

        await this.roomMemberRepository.createRoomMember({ ...body, user_uuid: req.user.uuid });
        const newMember = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid, body.room_uuid);

        await this.outboxRepository.createOutboxEntry({
            exchange_name: this.ROOM_EXCHANGE,
            routing_key: '',
            event_name: RoomMemberPublishEventEnum.ROOM_MEMBER_CREATED,
            message_payload: newMember as RoomMemberEntity,
        });

        await this.socketService.emitToUser(req.user.uuid, SocketEventUserEnum.ROOM_MEMBER_CREATED, isRoomExists);
        return;
    }
}