import { BadRequestException, Injectable } from "@nestjs/common";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";

@Injectable()
export class GetPublicRoomListingService {
    constructor(
        private readonly repository: RoomRepository,
    ) { }

    async handle(offset?: number, limit?: number, search?: string) {
        const { data, total } = await this.repository.getPublicRoomListing(offset, limit, search);

        return {
            data: data,
            totalDocuments: total,
        }
    }
}