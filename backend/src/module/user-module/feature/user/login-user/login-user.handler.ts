import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginUserDto } from "./login-user.dto";
import type { Request } from "express";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { JwtHelperService } from "src/module/user-module/infrastructure/services/jwt.service";
import { OutboxRepository } from "src/module/user-module/infrastructure/repository/outbox.repository";
import { UserPublishEventEnum } from "src/module/chat-module/domain/user/user.event";

@Injectable()
export class LoginUserService {
    private readonly USER_EXCHANGE = 'user.exchange';

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtHelperService: JwtHelperService,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    async handle(req: Request, body: LoginUserDto) {
        //check if already exists using this email
        let isUserExists = await this.userRepository.findByEmail(body.email);
        if (!isUserExists) {
            const RegisteredUser = await this.userRepository.register(body);
            await this.outboxRepository.createOutboxEntry({
                exchange_name: this.USER_EXCHANGE,
                routing_key: '',
                event_name: UserPublishEventEnum.USER_REGISTERED,
                message_payload: RegisteredUser,
            });
            isUserExists = RegisteredUser;
        }

        const token = await this.jwtHelperService.generateJwtToken(isUserExists);

        return { token, isUserExists };
    }
}