import { faker } from '@faker-js/faker';
import { roomDataSource, options } from '../data-source';
import { UserEntity } from '../../../domain/user/user.entity';

// hardcoded users for all microservices
const users = [
    {
        uuid: 'c0a80101-7b1d-4a9f-8c1a-123456789001',
        email: 'user1@gmail.com',
        created_at: new Date('2025-01-01T00:00:00.000Z'),
    },
    {
        uuid: 'c0a80102-7b1d-4a9f-8c1a-123456789002',
        email: 'user2@gmail.com',
        created_at: new Date('2025-01-02T00:00:00.000Z'),
    },
];

async function create() {
    roomDataSource.setOptions({
        ...options,
    });

    await roomDataSource.initialize();

    const queryRunner = roomDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        // use same users across all services
        for (const user of users) {
            const created_user = await queryRunner.manager.save(UserEntity, {
                uuid: user.uuid,
                email: user.email,// faker.internet.email(),
                name: faker.person.fullName(),
                profile_image: faker.image.personPortrait() || "https://i.pravatar.cc/300",
            });

            console.log(created_user);
        }

        await queryRunner.commitTransaction();
        console.info('✅ Seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
        await roomDataSource.destroy();
    }
}

void create();