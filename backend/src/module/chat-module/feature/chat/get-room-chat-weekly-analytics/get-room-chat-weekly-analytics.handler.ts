import { en } from "@faker-js/faker";
import { BadRequestException, Injectable } from "@nestjs/common";
import { getCurrentWeekRange } from "src/common/infrastruture/services/time";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";

@Injectable()
export class GetRoomChatWeeklyAnalyticsService {
    constructor(
        private readonly repository: RoomChatRepository,
    ) { }

    async handle(room_uuid: string) {
        const { end, start } = getCurrentWeekRange();
        const data = await this.repository.getRoomChatWeeklyAnalytics(room_uuid, start, end);

        return data;
    }
}