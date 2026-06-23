import { Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";

@Injectable()
export class GetRoomByUUIDService {
    constructor(
        private readonly repository: RoomRepository,
    ) { }

    async handle(req: Request, room_uuid: string) {
        const data = await this.repository.findByCreatorUuidAndUuid(req.user.uuid, room_uuid);

        return data;
    }
}