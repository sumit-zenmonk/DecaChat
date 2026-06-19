import { BadRequestException, Injectable } from "@nestjs/common";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";
import { RoomMemberRole } from "src/module/chat-module/domain/room-member/room-member.enum";
import { RoomCreatedMQEventPayload } from "src/module/chat-module/infrastructure/rabbit-mq/rabbit-mq.type";

@Injectable()
export class CreateRoomService {

    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
    ) { }

    async handle(body: RoomCreatedMQEventPayload) {
        const newRoom = await this.roomRepository.createRoom({ ...body });
        await this.roomMemberRepository.createRoomMember(
            {
                role: RoomMemberRole.CREATOR,
                room_uuid: newRoom.uuid,
                user_uuid: body.creator_uuid,
            }
        );
        return;
    }
}