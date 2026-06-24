import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";

@Injectable()
export class GetRoomListingService {
    constructor(
        private readonly repository: RoomRepository,
    ) { }

    async handle(req: Request, offset?: number, limit?: number, search?: string) {
        const { data, total } = await this.repository.getRoomListing(req.user, offset, limit, search);

        return {
            data: data,
            totalDocuments: total,
        }
    }
}