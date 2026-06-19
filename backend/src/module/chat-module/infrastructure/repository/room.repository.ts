import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { RoomEntity } from "../../domain/room/room.entity";

@Injectable()
export class RoomRepository extends Repository<RoomEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema')
        private readonly dataSource: DataSource,
    ) {
        super(RoomEntity, dataSource.createEntityManager());
    }

    async createRoom(body: Partial<RoomEntity>) {
        const room = this.create(body);
        return await this.save(room);
    }

    async findByUuid(uuid: string) {
        const room = await this.findOne({
            where: {
                uuid: uuid
            },
        });
        return room;
    }

    async findByCreatorUuidAndUuid(creator_uuid: string, uuid: string) {
        const room = await this.findOne({
            where: {
                creator_uuid: creator_uuid,
                uuid: uuid
            },
        });
        return room;
    }

    async deleteRoom(uuid: string) {
        await this.softDelete(uuid);
        return;
    }
}