import { BadRequestException, Injectable } from "@nestjs/common";
import { RoomMemberCreatedMQEventPayload } from "src/module/chat-module/infrastructure/rabbit-mq/rabbit-mq.type";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";

@Injectable()
export class JoinRoomMemberService {
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
    ) { }

    async handle(body: RoomMemberCreatedMQEventPayload) {
        await this.roomMemberRepository.createRoomMember({ ...body });
        return;
    }
}