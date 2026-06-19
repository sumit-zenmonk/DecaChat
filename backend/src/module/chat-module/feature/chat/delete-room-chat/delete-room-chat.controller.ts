import { Body, Controller, Delete, Param, Req } from "@nestjs/common";
import { DeleteRoomChatService } from "./delete-room-chat.handler";
import type { Request } from "express";

@Controller()
export class DeleteRoomChatController {
    constructor(private readonly deleteRoomChatService: DeleteRoomChatService) { }

    @Delete('/:uuid')
    async deleteRoomChat(@Req() req: Request, @Param('uuid') uuid: string) {
        await this.deleteRoomChatService.handle(req, uuid);

        return {
            message: "Room Chat Deleted Success"
        }
    }
}