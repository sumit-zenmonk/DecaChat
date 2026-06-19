import { Module } from "@nestjs/common";
import { JoinRoomMemberController } from "./join-room-member.controller";
import { JoinRoomMemberService } from "./join-room-member.handler";
import { RoomRepository } from "src/module/room-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/room-module/infrastructure/repository/room-member.repository";
import { OutboxRepository } from "src/module/room-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [JoinRoomMemberController],
    providers: [JoinRoomMemberService, RoomRepository, RoomMemberRepository, OutboxRepository],
    exports: [],
})

export class JoinRoomMemberModule { }