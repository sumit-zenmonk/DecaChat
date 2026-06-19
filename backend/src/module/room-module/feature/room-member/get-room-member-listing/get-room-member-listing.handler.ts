import { BadRequestException, Injectable } from "@nestjs/common";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";

@Injectable()
export class GetRoomMemberListingService {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
    ) { }

    async handle(room_uuid: string, offset?: number, limit?: number) {
        const isRoomExists = await this.roomRepository.findByUuid(room_uuid);
        if (!isRoomExists) {
            throw new BadRequestException("Room Not Found");
        }

        const { data, total } = await this.roomMemberRepository.getRoomMemberListing(room_uuid, offset, limit);

        return {
            data: data,
            totalDocuments: total,
        }
    }
}