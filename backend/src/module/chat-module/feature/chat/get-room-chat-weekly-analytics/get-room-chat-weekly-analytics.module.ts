import { Module } from "@nestjs/common";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";
import { GetRoomChatWeeklyAnalyticsController } from "./get-room-chat-weekly-analytics.controller";
import { GetRoomChatWeeklyAnalyticsService } from "./get-room-chat-weekly-analytics.handler";

@Module({
    imports: [],
    controllers: [GetRoomChatWeeklyAnalyticsController],
    providers: [GetRoomChatWeeklyAnalyticsService, RoomChatRepository],
    exports: [],
})

export class GetRoomChatWeeklyAnalyticsModule { }