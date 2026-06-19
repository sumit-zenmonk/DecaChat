import { Module } from "@nestjs/common";
import { DeleteRoomController } from "./delete-room.controller";
import { DeleteRoomService } from "./delete-room.handler";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";
import { OutboxRepository } from "src/module/room-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [DeleteRoomController],
    providers: [DeleteRoomService, RoomRepository, OutboxRepository],
    exports: [],
})

export class DeleteRoomModule { }