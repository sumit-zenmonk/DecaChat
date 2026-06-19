import { Module } from "@nestjs/common";
import { GetRoomListingController } from "./get-room-listing.controller";
import { GetRoomListingService } from "./get-room-listing.handler";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";

@Module({
    imports: [],
    controllers: [GetRoomListingController],
    providers: [GetRoomListingService, RoomRepository],
    exports: [],
})

export class GetRoomListingModule { }