import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomChatDto } from "./create-room-chat.dto";
import type { Request } from "express";
import { RoomMemberRepository } from "src/module/chat-module/infrastructure/repository/room-member.repository";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";
import { SocketEventNameEnum, SocketEventGroupRoomEnum } from "src/common/infrastruture/socket/socket.enum";
import { SocketService } from "src/common/infrastruture/socket/socket.service";

@Injectable()
export class CreateRoomChatService {
    constructor(
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly roomChatRepository: RoomChatRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, body: CreateRoomChatDto) {
        const member = await this.roomMemberRepository.findByUserUuidAndRoomUuid(req.user.uuid, body.room_uuid);
        if (!member) {
            throw new BadRequestException("Member not found");
        }

        const newChat = await this.roomChatRepository.createRoomChat({
            ...body,
            member_uuid: member.uuid,
        });
        const chat = await this.roomChatRepository.findByUuid(newChat.uuid);

        await this.socketService.emitToUser(req.user.uuid, SocketEventNameEnum.ROOM_CHAT_CREATED, chat);
        await this.socketService.emitToRoom(body.room_uuid, SocketEventGroupRoomEnum.GROUP_ROOM_CHAT_CREATED, chat);
        return;
    }
}