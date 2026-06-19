import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ChatMigration1778505600003 implements MigrationInterface {
    name = "ChatMigration1778505600003";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "chat",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "member_uuid", type: "uuid", isNullable: false, },
                    { name: "room_uuid", type: "uuid", isNullable: false, },
                    { name: "parent_uuid", type: "uuid", isNullable: true, },
                    { name: "message", type: "text", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "chat",
            new TableForeignKey({
                columnNames: ["room_uuid"],
                referencedTableName: "room",
                referencedColumnNames: ["uuid"],
                name: "FK_CHAT_ROOM",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "chat",
            new TableForeignKey({
                columnNames: ["member_uuid"],
                referencedTableName: "room_member",
                referencedColumnNames: ["uuid"],
                name: "FK_CHAT_ROOM_MEMBER",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("chat", "FK_CHAT_ROOM");
        await queryRunner.dropForeignKey("chat", "FK_CHAT_ROOM_MEMBER");
        await queryRunner.dropTable("chat", true);
    }
}
