import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateRoomChatModule } from "./create-room-chat/create-room-chat.module";
import { GetRoomChatListingModule } from "./get-room-chat-listing/get-room-chat-listing.module";
import { DeleteRoomChatModule } from "./delete-room-chat/delete-room-chat.module";

@Module({
    imports: [
        CreateRoomChatModule,
        GetRoomChatListingModule,
        DeleteRoomChatModule,
        RouterModule.register([
            {
                path: 'room/chat',
                children: [
                    { path: '', module: CreateRoomChatModule },
                    { path: '', module: GetRoomChatListingModule },
                    { path: '', module: DeleteRoomChatModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class ChatModule { }