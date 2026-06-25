import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { SocketEventUserEnum, SocketEventGroupRoomEnum } from "src/common/infrastruture/socket/socket.enum";
import { SocketService } from "src/common/infrastruture/socket/socket.service";
import { RoomChatRepository } from "src/module/chat-module/infrastructure/repository/room-chat.repository";

@Injectable()
export class DeleteRoomChatService {
    constructor(
        private readonly roomRepository: RoomChatRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(req: Request, uuid: string) {
        const isRoomChatExists = await this.roomRepository.findByUuid(uuid);
        if (!isRoomChatExists) {
            throw new BadRequestException("Room Chat Not Found");
        }
        if (isRoomChatExists.member.user_uuid !== req.user.uuid) {
            throw new BadRequestException("Can't delete other's chat");
        }

        await this.roomRepository.deleteRoomChat(uuid);

        // await this.socketService.emitToUser(req.user.uuid, SocketEventUserEnum.ROOM_CHAT_CREATED, { chat_uuid: isRoomChatExists.uuid, room_uuid: isRoomChatExists.room_uuid });
        await this.socketService.emitToRoom(isRoomChatExists.room_uuid, SocketEventGroupRoomEnum.GROUP_ROOM_CHAT_DELETED, { chat_uuid: isRoomChatExists.uuid, room_uuid: isRoomChatExists.room_uuid });
        return;
    }
}