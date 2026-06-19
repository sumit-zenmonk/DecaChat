import { Module } from "@nestjs/common";
import { RoomRepository } from "src/module/chat-module/infrastructure/repository/room.repository";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";
import { CreateRoomChatController } from "./create-room-chat.controller";
import { CreateRoomChatService } from "./create-room-chat.handler";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";

@Module({
    imports: [],
    controllers: [CreateRoomChatController],
    providers: [CreateRoomChatService, RoomRepository, RoomMemberRepository, RoomChatRepository],
    exports: [],
})

export class CreateRoomChatModule { }