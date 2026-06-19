import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class userMigration1778505600000 implements MigrationInterface {
    name = "userMigration1778505600000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "email", type: "varchar", isUnique: true, isNullable: false, },
                    { name: "profile_image", type: "varchar", isNullable: true },
                    { name: "is_online", type: "boolean", default: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user", true);
    }
}