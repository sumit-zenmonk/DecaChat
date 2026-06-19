import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateRoomModule } from "./create-room/create-room.module";
import { GetRoomListingModule } from "./get-room-listing/get-room-listing.module";
import { DeleteRoomModule } from "./delete-room/delete-room.module";
import { GetPublicRoomListingModule } from "./get-public-room-listing/get-public-room-listing.module";
import { GetRoomJoinedListingModule } from "./get-room-joined-listing/get-room-joined-listing.module";

@Module({
    imports: [
        CreateRoomModule,
        GetRoomListingModule,
        DeleteRoomModule,
        GetPublicRoomListingModule,
        GetRoomJoinedListingModule,
        RouterModule.register([
            {
                path: 'room',
                children: [
                    { path: '', module: CreateRoomModule },
                    { path: '', module: GetRoomListingModule },
                    { path: '', module: DeleteRoomModule },
                    { path: 'join', module: GetRoomJoinedListingModule },
                    { path: 'public', module: GetPublicRoomListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class RoomModule { }