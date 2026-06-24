import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { UserEntity } from "../../domain/user/user.entity";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_ROOM_SCHEMA || 'room_schema')
        private readonly dataSource: DataSource,
    ) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async register(body: Partial<UserEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUuid(uuid: string) {
        const user = await this.find({
            where: {
                uuid: uuid
            },
            select: {
                email: true,
                uuid: true,
                name: true,
                profile_image: true,
                is_online: true,
            }
        });
        return user;
    }

    async updateOnlineStatus(uuid: string, is_online: boolean) {
        await this.update({ uuid }, { is_online });
    }

    async findByEmail(email: string) {
        const user = await this.find({
            where: {
                email: email
            },
            select: {
                email: true,
                uuid: true,
                name: true,
                profile_image: true,
            }
        });
        return user;
    }
}