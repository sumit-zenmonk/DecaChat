import { Body, Controller, Post, Req } from "@nestjs/common";
import { CreateRoomService } from "./create-room.handler";
import { CreateRoomDto } from "./create-room.dto";
import type { Request } from "express";

@Controller()
export class CreateRoomController {
    constructor(private readonly createRoomService: CreateRoomService) { }

    @Post()
    async createRoom(@Req() req: Request, @Body() body: CreateRoomDto) {
        await this.createRoomService.handle(req, body);

        return {
            message: "Room Created Successfully"
        };
    }
}