import { BadRequestException, Injectable, } from "@nestjs/common";
import type { UserRegisteredMQEventPayload } from "src/module/chat-module/infrastructure/rabbit-mq/rabbit-mq.type";
import { UserRepository } from "src/module/chat-module/infrastructure/repository/user.repository";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class RegisterUserService {
    constructor(
        private readonly repository: UserRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema',
    })
    async handle(payload: UserRegisteredMQEventPayload) {
        const isUserExists = await this.repository.findByEmail(payload.email);
        if (isUserExists) {
            console.warn(`Duplicate skipped: ${isUserExists.email}`);
            return;
        }

        await this.repository.register(payload);
        return;
    }
}