import { Module } from "@nestjs/common";
import { GetRoomChatListingController } from "./get-room-chat-listing.controller";
import { GetRoomChatListingService } from "./get-room-chat-listing.handler";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";

@Module({
    imports: [],
    controllers: [GetRoomChatListingController],
    providers: [GetRoomChatListingService, RoomChatRepository],
    exports: [],
})

export class GetRoomChatListingModule { }