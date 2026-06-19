import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class roomMigration1778505600001 implements MigrationInterface {
    name = "roomMigration1778505600001";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "room",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "name", type: "varchar", isNullable: false, },
                    { name: "description", type: "varchar", isNullable: true, },
                    { name: "creator_uuid", type: "uuid", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "room",
            new TableForeignKey({
                columnNames: ["creator_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_ROOM_CREATOR",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("room", "FK_ROOM_CREATOR");
        await queryRunner.dropTable("room", true);
    }
}