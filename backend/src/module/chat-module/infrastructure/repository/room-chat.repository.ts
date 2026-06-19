import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { RoomChatEntity } from "../../domain/room-chat/room-chat.entity";

@Injectable()
export class RoomChatRepository extends Repository<RoomChatEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema')
        private readonly dataSource: DataSource,
    ) {
        super(RoomChatEntity, dataSource.createEntityManager());
    }

    async createRoomChat(body: Partial<RoomChatEntity>) {
        const chat = this.create(body);
        return await this.save(chat);
    }

    async findByUuid(uuid: string) {
        const chat = await this.findOne({
            where: {
                uuid: uuid
            },
            relations: {
                member: true,
                room: true
            }
        });
        return chat;
    }

    async getRoomChatListing(room_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                room_uuid: room_uuid,
            },
            relations: {
                member: true,
                room: true,
            },
            order: {
                created_at: 'ASC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async deleteRoomChat(uuid: string) {
        await this.softDelete(uuid);
        return;
    }
}