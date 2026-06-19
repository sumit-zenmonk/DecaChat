import { BadRequestException, Injectable, } from "@nestjs/common";
import type { UserRegisteredMQEventPayload } from "src/module/room-module/infrastructure/rabbit-mq/rabbit-mq.type";
import { UserRepository } from "src/module/room-module/infrastructure/repository/user.repository";
import { Transactional } from "typeorm-transactional";
import { faker } from '@faker-js/faker';

@Injectable()
export class RegisterUserService {
    constructor(
        private readonly repository: UserRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_ROOM_SCHEMA || 'room_schema',
    })
    async handle(payload: UserRegisteredMQEventPayload) {
        const isUserExists = await this.repository.findByEmail(payload.email);
        if (isUserExists.length) {
            console.warn(`Duplicate skipped: ${isUserExists[0].email}`);
            return;
        }

        await this.repository.register({ ...payload, profile_image: faker.image.personPortrait() || "https://i.pravatar.cc/300" });
        return;
    }
}