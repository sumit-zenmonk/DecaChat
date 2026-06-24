import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository, ILike } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { RoomEntity } from "../../domain/room/room.entity";
import { UserEntity } from "../../domain/user/user.entity";

@Injectable()
export class RoomRepository extends Repository<RoomEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_ROOM_SCHEMA || 'room_schema')
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
            relations: {
                creator: true
            }
        });
        return room;
    }

    async findByCreatorUuidAndUuid(creator_uuid: string, uuid: string) {
        const room = await this.findOne({
            where: {
                creator_uuid: creator_uuid,
                uuid: uuid
            },
            relations: {
                creator: true
            }
        });
        return room;
    }

    async findByCreatorUuidAndName(creator_uuid: string, name: string) {
        const room = await this.findOne({
            where: {
                creator_uuid: creator_uuid,
                name: name
            },
            relations: {
                creator: true
            }
        });
        return room;
    }

    async getRoomListing(user: Partial<UserEntity>, offset?: number, limit?: number, search?: string) {
        const whereClause = search
            ? [
                  { creator_uuid: user.uuid, name: ILike(`%${search}%`) },
                  { creator_uuid: user.uuid, description: ILike(`%${search}%`) },
              ]
            : { creator_uuid: user.uuid };

        const [data, total] = await this.findAndCount({
            where: whereClause,
            relations: {
                creator: true,
            },
            order: {
                created_at: 'DESC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async getRoomJoinedListing(user: Partial<UserEntity>, offset?: number, limit?: number, search?: string) {
        const whereClause = search
            ? [
                  { members: { user_uuid: user.uuid }, name: ILike(`%${search}%`) },
                  { members: { user_uuid: user.uuid }, description: ILike(`%${search}%`) },
              ]
            : { members: { user_uuid: user.uuid } };

        const [data, total] = await this.findAndCount({
            where: whereClause,
            relations: {
                creator: true,
                members: true,
            },
            order: {
                created_at: 'DESC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async getPublicRoomListing(offset?: number, limit?: number, search?: string) {
        const whereClause = search
            ? [
                  { name: ILike(`%${search}%`) },
                  { description: ILike(`%${search}%`) },
              ]
            : undefined;

        const [data, total] = await this.findAndCount({
            where: whereClause,
            relations: {
                creator: true,
            },
            order: {
                created_at: 'DESC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async deleteRoom(uuid: string) {
        await this.softDelete(uuid);
        return;
    }
}