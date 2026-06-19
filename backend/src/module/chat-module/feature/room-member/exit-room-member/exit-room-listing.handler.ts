import { BadRequestException, Injectable } from "@nestjs/common";
import { RoomMemberDeletedMQEventPayload } from "src/module/chat-module/infrastructure/rabbit-mq/rabbit-mq.type";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";

@Injectable()
export class ExitRoomMemberService {
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
    ) { }

    async handle(body: RoomMemberDeletedMQEventPayload) {
        const isMemberExists = await this.roomMemberRepository.findByUuid(body.room_member_uuid);
        if (!isMemberExists) {
            throw new BadRequestException("Member not found");
        }

        await this.roomMemberRepository.deleteRoomMember(body.room_member_uuid);
        return;
    }
}