import { Module } from "@nestjs/common";
import { CreateRoomController } from "./create-room.controller";
import { CreateRoomService } from "./create-room.handler";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";
import { OutboxRepository } from "src/module/room-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [CreateRoomController],
    providers: [CreateRoomService, RoomRepository, RoomMemberRepository, OutboxRepository],
    exports: [],
})

export class CreateRoomModule { }