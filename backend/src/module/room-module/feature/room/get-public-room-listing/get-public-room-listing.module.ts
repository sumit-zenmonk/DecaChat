import { Module } from "@nestjs/common";
import { GetPublicRoomListingController } from "./get-public-room-listing.controller";
import { GetPublicRoomListingService } from "./get-public-room-listing.handler";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";

@Module({
    imports: [],
    controllers: [GetPublicRoomListingController],
    providers: [GetPublicRoomListingService, RoomRepository],
    exports: [],
})

export class GetPublicRoomListingModule { }