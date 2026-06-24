import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetRoomChatWeeklyAnalyticsService } from "./get-room-chat-weekly-analytics.handler";

@Controller()
export class GetRoomChatWeeklyAnalyticsController {
    constructor(private readonly getRoomChatWeeklyAnalyticsService: GetRoomChatWeeklyAnalyticsService) { }

    @Get('/:room_uuid')
    async getRoomChatWeeklyAnalytics(@Param('room_uuid') room_uuid: string) {
        const data = await this.getRoomChatWeeklyAnalyticsService.handle(room_uuid);

        return {
            data: data,
            message: "Room Chat Anayltics Success"
        }
    }
}