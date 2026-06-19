import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetRoomMemberListingService } from "./get-room-member-listing.handler";

@Controller()
export class GetRoomMemberListingController {
    constructor(private readonly getRoomMemberListingService: GetRoomMemberListingService) { }

    @Get('/:room_uuid')
    async getRoomMemberListing(@Param('room_uuid') room_uuid: string, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, totalDocuments } = await this.getRoomMemberListingService.handle(room_uuid, offset, limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: totalDocuments,
            message: "Room Member Listing Success"
        }
    }
}