import { Injectable, Logger } from '@nestjs/common';
import { ChatEventHandlerMap, ChatEventPayloadMap, RoomCreatedMQEventPayload, RoomDeletedMQEventPayload, RoomMemberCreatedMQEventPayload, RoomMemberDeletedMQEventPayload, UserRegisteredMQEventPayload } from './rabbit-mq.type';
import { RegisterUserService } from 'src/module/chat-module/feature/user/register-user/register-user.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';
import { CreateRoomService } from '../../feature/room/create-room/create-room.handler';
import { DeleteRoomService } from '../../feature/room/delete-room/delete-room.handler';
import { JoinRoomMemberService } from '../../feature/room-member/join-room-member/join-room-member.handler';
import { ExitRoomMemberService } from '../../feature/room-member/exit-room-member/exit-room-listing.handler';

@Injectable()
export class ProcessorsService {
    constructor(
        private readonly registerUserService: RegisterUserService,
        private readonly createRoomService: CreateRoomService,
        private readonly deleteRoomService: DeleteRoomService,
        private readonly joinRoomMemberService: JoinRoomMemberService,
        private readonly exitRoomMemberService: ExitRoomMemberService,
        private readonly inboxRepository: InboxRepository,
    ) { }
    private readonly logger = new Logger(ProcessorsService.name);

    // Map event names to handlers
    public eventHandlerMap: ChatEventHandlerMap = {
        'user.registered': [this.handleUserRegister],
        'room.created': [this.handleRoomCreated],
        'room.deleted': [this.handleRoomDeleted],
        'room.member.created': [this.handleRoomMemberCreated],
        'room.member.deleted': [this.handleRoomMemberDeleted],
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handlers = this.eventHandlerMap[eventName as keyof ChatEventPayloadMap];
        if (!handlers || !handlers.length) {
            this.logger.debug(`No handler found for event: ${eventName} in Chat Module`);
            return;
        }

        for (const handler of handlers) {
            const handlerName = handler.name;
            const alreadyProcessed = await this.inboxRepository.findByOutboxUuidAndHandlerName(outbox_uuid, handlerName);
            if (alreadyProcessed) {
                this.logger.debug(`Duplicated event: ${eventName} with handler: ${handlerName} in Chat Module`);
                continue;
            }

            // Execute the handler
            await handler.call(this, payload, outbox_uuid, eventName);

            // Record successful processing in the inbox
            await this.inboxRepository.createEntry({
                outbox_uuid,
                event_name: eventName,
                handler_name: handlerName
            });
        }
    }

    async handleUserRegister(payload: UserRegisteredMQEventPayload) {
        await this.registerUserService.handle(payload);
    }

    async handleRoomCreated(payload: RoomCreatedMQEventPayload) {
        await this.createRoomService.handle(payload);
    }

    async handleRoomDeleted(payload: RoomDeletedMQEventPayload) {
        await this.deleteRoomService.handle(payload);
    }

    async handleRoomMemberCreated(payload: RoomMemberCreatedMQEventPayload) {
        await this.joinRoomMemberService.handle(payload);
    }

    async handleRoomMemberDeleted(payload: RoomMemberDeletedMQEventPayload) {
        await this.exitRoomMemberService.handle(payload);
    }
}
