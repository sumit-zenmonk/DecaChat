import { Body, Controller, Delete, Param, Req } from "@nestjs/common";
import { DeleteRoomService } from "./delete-room.handler";
import type { Request } from "express";

@Controller()
export class DeleteRoomController {
    constructor(private readonly deleteRoomService: DeleteRoomService) { }

    @Delete('/:uuid')
    async deleteRoom(@Req() req: Request, @Param('uuid') uuid: string) {
        await this.deleteRoomService.handle(req, uuid);

        return {
            message: "Room Deleted Success"
        }
    }
}