import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { ProcessorsService } from './processors.service';
import { RoomRabbitMQConsumerInitializer } from './rabbit-mq-consumer-initializer';
import { RegisterUserService } from '../../feature/user/register-user/register-user.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { UserRepository } from '../repository/user.repository';

@Module({
    providers: [
        RabbitMQService,
        RoomRabbitMQConsumerInitializer,
        ProcessorsService,
        RegisterUserService,
        InboxRepository,
        UserRepository,
    ],
    exports: [RabbitMQService, ProcessorsService],
})
export class RoomRabbitMQModule { }
