import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class roomMemberMigration1778505600002 implements MigrationInterface {
    name = "roomMemberMigration1778505600002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "chat_schema"."room_member_role_enum" AS ENUM('user', 'creator')`
        );

        await queryRunner.createTable(
            new Table({
                name: "room_member",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "room_uuid", type: "uuid", isNullable: false, },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "role", type: `"chat_schema"."room_member_role_enum"`, default: `'user'`, isNullable: false },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TYPE IF EXISTS "chat_schema"."room_member_role_enum"`);
        await queryRunner.dropTable("room_member", true);
    }
}