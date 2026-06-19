import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetRoomChatListingService } from "./get-room-chat-listing.handler";

@Controller()
export class GetRoomChatListingController {
    constructor(private readonly getRoomChatListingService: GetRoomChatListingService) { }

    @Get('/:room_uuid')
    async getRoomChatListing(@Param('room_uuid') room_uuid: string, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, totalDocuments } = await this.getRoomChatListingService.handle(room_uuid, offset, limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: totalDocuments,
            message: "Room Chat Listing Success"
        }
    }
}