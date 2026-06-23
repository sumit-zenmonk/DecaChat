import { Module } from "@nestjs/common";
import { GetRoomByUUIDController } from "./get-room-by-uuid.controller";
import { GetRoomByUUIDService } from "./get-room-by-uuid.handler";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";

@Module({
    imports: [],
    controllers: [GetRoomByUUIDController],
    providers: [GetRoomByUUIDService, RoomRepository],
    exports: [],
})

export class GetRoomByUUIDModule { }