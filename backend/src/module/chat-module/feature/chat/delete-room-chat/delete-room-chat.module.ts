import { Module } from "@nestjs/common";
import { DeleteRoomChatController } from "./delete-room-chat.controller";
import { DeleteRoomChatService } from "./delete-room-chat.handler";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";

@Module({
    imports: [],
    controllers: [DeleteRoomChatController],
    providers: [DeleteRoomChatService, RoomChatRepository],
    exports: [],
})

export class DeleteRoomChatModule { }