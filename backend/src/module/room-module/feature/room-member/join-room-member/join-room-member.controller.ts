import { Body, Controller, Post, Req } from "@nestjs/common";
import { JoinRoomMemberService } from "./join-room-member.handler";
import { JoinRoomMemberDto } from "./join-room-member.dto";
import type { Request } from "express";

@Controller()
export class JoinRoomMemberController {
    constructor(private readonly joinRoomMemberService: JoinRoomMemberService) { }

    @Post()
    async joinRoomMember(@Req() req: Request, @Body() body: JoinRoomMemberDto) {
        await this.joinRoomMemberService.handle(req, body);

        return {
            message: "Room Created Successfully"
        };
    }
}