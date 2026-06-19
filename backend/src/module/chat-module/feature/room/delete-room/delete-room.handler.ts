import { BadRequestException, Injectable } from "@nestjs/common";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { RoomDeletedMQEventPayload } from "src/module/chat-module/infrastructure/rabbit-mq/rabbit-mq.type";

@Injectable()
export class DeleteRoomService {

    constructor(
        private readonly roomRepository: RoomRepository,
    ) { }

    async handle(body: RoomDeletedMQEventPayload) {
        await this.roomRepository.deleteRoom(body.room_uuid);
        return;
    }
}