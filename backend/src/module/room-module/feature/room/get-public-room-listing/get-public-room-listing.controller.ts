import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetPublicRoomListingService } from "./get-public-room-listing.handler";

@Controller()
export class GetPublicRoomListingController {
    constructor(private readonly getPublicRoomListingService: GetPublicRoomListingService) { }

    @Get()
    async getPublicRoomListing(@Query('offset') offset?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, totalDocuments } = await this.getPublicRoomListingService.handle(offset, limit, search);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: totalDocuments,
            message: "Public Room Listing Success"
        }
    }
}