import { MiddlewareConsumer, Module, NestModule, OnModuleDestroy, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DataSourceOptions } from 'typeorm';

// Common Module
import { AuthenticateMiddleware } from './common/infrastruture/middleware/authenticate.middleware';
import { createTransactionalDataSource } from './common/infrastruture/services/typeorm.transactional';
import { RabbitMQCommonModule } from './common/infrastruture/rabbit-mq/rabbit-mq.module';
import { SocketModule } from './common/infrastruture/socket/socket.module';

// User Module
import { userDataSource } from './module/user-module/infrastructure/database/data-source';
import { UserRepository } from './module/user-module/infrastructure/repository/user.repository';
import { JwtHelperService } from './module/user-module/infrastructure/services/jwt.service';
import * as UserCronModule from './module/user-module/infrastructure/cron/cron.module';
import { UserModule } from './module/user-module/feature/user/user.module';

// Room Module
import { RoomRabbitMQModule } from './module/room-module/infrastructure/rabbit-mq/rabbit-mq.module';
import { roomDataSource } from './module/room-module/infrastructure/database/data-source';
import * as RoomCronModule from './module/room-module/infrastructure/cron/cron.module';
import { RoomModule } from './module/room-module/feature/room/room.module';
import { RoomMemberModule } from './module/room-module/feature/room-member/room.module';

// Chat Module
import { chatDataSource } from './module/chat-module/infrastructure/database/data-source';
import { ChatRabbitMQModule } from './module/chat-module/infrastructure/rabbit-mq/rabbit-mq.module';
import * as ChatCronModule from './module/chat-module/infrastructure/cron/cron.module';
import { ChatModule } from './module/chat-module/feature/chat/chat.module';

@Module({
  imports: [
    // common
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_REGISTER_SECRET,
      // signOptions: { expiresIn: '60m' },
    }),
    ScheduleModule.forRoot(),
    RabbitMQCommonModule,
    SocketModule,

    //User Module
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
      useFactory: () => ({
        ...userDataSource.options,
        retryAttempts: Number(process.env.DB_RETRY_ATTEMPTS) || 10,
        retryDelay: Number(process.env.DB_RETRY_DELAY) || 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
          options as DataSourceOptions,
        ),
    }),
    UserModule,
    UserCronModule.CronModule,

    // Room Module
    RoomRabbitMQModule,
    RoomCronModule.CronModule,
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_ROOM_SCHEMA || 'room_schema',
      useFactory: () => ({
        ...roomDataSource.options,
        retryAttempts: Number(process.env.DB_RETRY_ATTEMPTS) || 10,
        retryDelay: Number(process.env.DB_RETRY_DELAY) || 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_ROOM_SCHEMA || 'room_schema',
          options as DataSourceOptions,
        ),
    }),
    RoomModule,
    RoomMemberModule,

    // Chat Module
    ChatRabbitMQModule,
    ChatCronModule.CronModule,
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema',
      useFactory: () => ({
        ...chatDataSource.options,
        retryAttempts: Number(process.env.DB_RETRY_ATTEMPTS) || 10,
        retryDelay: Number(process.env.DB_RETRY_DELAY) || 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema',
          options as DataSourceOptions,
        ),
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository, JwtHelperService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.ALL },
        { path: '/user/register', method: RequestMethod.ALL },
        { path: '/room/public', method: RequestMethod.GET },
        { path: '/room/member/*path', method: RequestMethod.GET },
        { path: '/room/chat/*path', method: RequestMethod.GET },
      )
      .forRoutes('/*path');
  }
}