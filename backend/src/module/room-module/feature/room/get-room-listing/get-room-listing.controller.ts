import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetRoomListingService } from "./get-room-listing.handler";
import type { Request } from "express";

@Controller()
export class GetRoomListingController {
    constructor(private readonly getRoomListingService: GetRoomListingService) { }

    @Get()
    async getRoomListing(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, totalDocuments } = await this.getRoomListingService.handle(req, offset, limit, search);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: totalDocuments,
            message: "Room Listing Success"
        }
    }
}