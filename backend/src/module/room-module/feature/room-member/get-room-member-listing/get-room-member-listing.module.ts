import { Module } from "@nestjs/common";
import { GetRoomMemberListingController } from "./get-room-member-listing.controller";
import { GetRoomMemberListingService } from "./get-room-member-listing.handler";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";

@Module({
    imports: [],
    controllers: [GetRoomMemberListingController],
    providers: [GetRoomMemberListingService, RoomRepository, RoomMemberRepository],
    exports: [],
})

export class GetRoomMemberListingModule { }