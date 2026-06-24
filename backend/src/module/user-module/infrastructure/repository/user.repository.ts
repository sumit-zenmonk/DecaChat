import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { UserEntity } from "../../domain/user/user.entity";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema')
        private readonly dataSource: DataSource,
    ) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async register(body: Partial<UserEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUuid(uuid: string) {
        const user = await this.findOne({
            where: {
                uuid: uuid
            },
            select: {
                email: true,
                uuid: true,
                name: true,
            }
        });
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.findOne({
            where: {
                email: email
            },
            select: {
                email: true,
                uuid: true,
                name: true,
            }
        });
        return user;
    }
}