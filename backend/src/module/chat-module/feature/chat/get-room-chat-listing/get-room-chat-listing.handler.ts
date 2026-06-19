import { BadRequestException, Injectable } from "@nestjs/common";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";

@Injectable()
export class GetRoomChatListingService {
    constructor(
        private readonly repository: RoomChatRepository,
    ) { }

    async handle(room_uuid: string, offset?: number, limit?: number) {
        const { data, total } = await this.repository.getRoomChatListing(room_uuid, offset, limit);

        return {
            data: data,
            totalDocuments: total,
        }
    }
}