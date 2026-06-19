import { Injectable, Logger } from '@nestjs/common';
import { RoomEventHandlerMap, RoomEventPayloadMap, UserRegisteredMQEventPayload } from './rabbit-mq.type';
import { RegisterUserService } from 'src/module/room-module/feature/user/register-user/register-user.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ProcessorsService {
    constructor(
        private readonly registerUserService: RegisterUserService,
        private readonly inboxRepository: InboxRepository,
    ) { }
    private readonly logger = new Logger(ProcessorsService.name);

    // Map event names to handlers
    public eventHandlerMap: RoomEventHandlerMap = {
        'user.registered': [this.handleUserRegister]
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_ROOM_SCHEMA || 'room_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handlers = this.eventHandlerMap[eventName as keyof RoomEventPayloadMap];
        if (!handlers || !handlers.length) {
            this.logger.debug(`No handler found for event: ${eventName} in Room Module`);
            return;
        }

        for (const handler of handlers) {
            const handlerName = handler.name;
            const alreadyProcessed = await this.inboxRepository.findByOutboxUuidAndHandlerName(outbox_uuid, handlerName);
            if (alreadyProcessed) {
                this.logger.debug(`Duplicated event: ${eventName} with handler: ${handlerName} in Room Module`);
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
}
