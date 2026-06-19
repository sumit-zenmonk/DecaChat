import { Body, Controller, Post, Req } from "@nestjs/common";
import { CreateRoomChatService } from "./create-room-chat.handler";
import { CreateRoomChatDto } from "./create-room-chat.dto";
import type { Request } from "express";

@Controller()
export class CreateRoomChatController {
    constructor(private readonly createRoomChatService: CreateRoomChatService) { }

    @Post()
    async createRoomChat(@Req() req: Request, @Body() body: CreateRoomChatDto) {
        await this.createRoomChatService.handle(req, body);

        return {
            message: "Room Chat Created Successfully"
        };
    }
}