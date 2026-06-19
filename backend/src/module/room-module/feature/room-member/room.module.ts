import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { JoinRoomMemberModule } from "./join-room-member/join-room-member.module";
import { ExitRoomMemberModule } from "./exit-room-member/exit-room.module";
import { GetRoomMemberListingModule } from "./get-room-member-listing/get-room-member-listing.module";

@Module({
    imports: [
        JoinRoomMemberModule,
        ExitRoomMemberModule,
        GetRoomMemberListingModule,
        RouterModule.register([
            {
                path: 'room/member',
                children: [
                    { path: '', module: JoinRoomMemberModule },
                    { path: '', module: ExitRoomMemberModule },
                    { path: '', module: GetRoomMemberListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class RoomMemberModule { }