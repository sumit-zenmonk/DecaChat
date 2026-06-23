import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetRoomByUUIDService } from "./get-room-by-uuid.handler";
import type { Request } from "express";

@Controller()
export class GetRoomByUUIDController {
    constructor(private readonly getRoomByUUIDService: GetRoomByUUIDService) { }

    @Get('/:room_uuid')
    async getRoomByUUID(@Req() req: Request, @Param('room_uuid') room_uuid: string) {
        const data = await this.getRoomByUUIDService.handle(req, room_uuid);

        return {
            data: data,
            message: "Get Your Room Success"
        }
    }
}