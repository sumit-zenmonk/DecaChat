import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetRoomJoinedListingService } from "./get-room-joined-listing.handler";
import type { Request } from "express";

@Controller()
export class GetRoomJoinedListingController {
    constructor(private readonly getRoomJoinedListingService: GetRoomJoinedListingService) { }

    @Get()
    async getRoomJoinedListing(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, totalDocuments } = await this.getRoomJoinedListingService.handle(req, offset, limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: totalDocuments,
            message: "Joined Room Listing Success"
        }
    }
}