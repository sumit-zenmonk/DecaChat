import { Global, Module } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { JwtHelperService } from "src/module/user-module/infrastructure/services/jwt.service";
import * as RoomUserRepository from 'src/module/room-module/infrastructure/repository/user.repository';

@Global()
@Module({
    providers: [SocketService, JwtHelperService, UserRepository, RoomUserRepository.UserRepository],
    exports: [SocketService],
})
export class SocketModule { }
