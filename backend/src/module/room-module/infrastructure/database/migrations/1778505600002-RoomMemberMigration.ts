import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class roomMemberMigration1778505600002 implements MigrationInterface {
    name = "roomMemberMigration1778505600002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "room_schema"."room_member_role_enum" AS ENUM('user', 'creator')`
        );

        await queryRunner.createTable(
            new Table({
                name: "room_member",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "room_uuid", type: "uuid", isNullable: false, },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "role", type: `"room_schema"."room_member_role_enum"`, default: `'user'`, isNullable: false },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "room_member",
            new TableForeignKey({
                columnNames: ["room_uuid"],
                referencedTableName: "room",
                referencedColumnNames: ["uuid"],
                name: "FK_ROOM_MEMBER_ROOM",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "room_member",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_ROOM_MEMBER_USER",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TYPE IF EXISTS "room_schema"."room_member_role_enum"`);
        await queryRunner.dropForeignKey("room_member", "FK_ROOM_MEMBER_ROOM");
        await queryRunner.dropForeignKey("room_member", "FK_ROOM_MEMBER_USER");
        await queryRunner.dropTable("room_member", true);
    }
}