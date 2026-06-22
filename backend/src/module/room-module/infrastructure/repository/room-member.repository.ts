import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { RoomMemberEntity } from "../../domain/room-member/room-member.entity";

@Injectable()
export class RoomMemberRepository extends Repository<RoomMemberEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_ROOM_SCHEMA || 'room_schema')
        private readonly dataSource: DataSource,
    ) {
        super(RoomMemberEntity, dataSource.createEntityManager());
    }

    async createRoomMember(body: Partial<RoomMemberEntity>) {
        const member = this.create(body);
        return await this.save(member);
    }

    async findByUuid(uuid: string) {
        const member = await this.findOne({
            where: {
                uuid: uuid
            },
        });
        return member;
    }

    async findByUserUuidAndRoomUuid(user_uuid: string, room_uuid: string) {
        const member = await this.findOne({
            where: {
                user_uuid: user_uuid,
                room_uuid: room_uuid
            },
            relations: {
                room: { creator: true },
                user: true,
            },
        });
        return member;
    }

    async getRoomMemberListing(room_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                room_uuid
            },
            relations: {
                room: { creator: true },
                user: true
            },
            order: {
                created_at: 'DESC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async deleteRoomMember(uuid: string) {
        await this.softDelete(uuid);
        return;
    }
}