//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { InboxEntity } from "../../domain/inbox/inbox.entity";
import { UserEntity } from "../../domain/user/user.entity";
import { OutboxEntity } from "../../domain/outbox/outbox.entity";
import { RoomEntity } from "../../domain/room/room.entity";
import { RoomMemberEntity } from "../../domain/room-member/room-member.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, InboxEntity, OutboxEntity,
        RoomEntity, RoomMemberEntity,
    ],
    schema: process.env.DB_POSTGRES_ROOM_SCHEMA || 'room_schema',
    synchronize: false,
    migrations: ['dist/module/room-module/infrastructure/database/migrations/*{.ts,.js}'],
};

const roomDataSource = new DataSource(options);

export { roomDataSource, options };