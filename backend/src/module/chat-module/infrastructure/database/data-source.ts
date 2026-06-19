//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { UserEntity } from "src/module/chat-module/domain/user/user.entity";
import { OutboxEntity } from "../../domain/outbox/outbox.entity";
import { InboxEntity } from "../../domain/inbox/inbox.entity";
import { RoomEntity } from "../../domain/room/room.entity";
import { RoomMemberEntity } from "../../domain/room-member/room-member.entity";
import { RoomChatEntity } from "../../domain/room-chat/room-chat.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, OutboxEntity, InboxEntity,
        RoomEntity, RoomMemberEntity, RoomChatEntity
    ],
    schema: process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema',
    synchronize: false,
    migrations: ['dist/module/chat-module/infrastructure/database/migrations/*{.ts,.js}'],
};

const chatDataSource = new DataSource(options);

export { chatDataSource, options };