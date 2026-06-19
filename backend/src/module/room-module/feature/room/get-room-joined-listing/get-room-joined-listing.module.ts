import { Module } from "@nestjs/common";
import { GetRoomJoinedListingController } from "./get-room-joined-listing.controller";
import { GetRoomJoinedListingService } from "./get-room-joined-listing.handler";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";

@Module({
    imports: [],
    controllers: [GetRoomJoinedListingController],
    providers: [GetRoomJoinedListingService, RoomRepository],
    exports: [],
})

export class GetRoomJoinedListingModule { }