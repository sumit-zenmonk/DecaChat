import { UserEntity } from "src/domain/user/user.entity";

declare module 'express' {
    interface Request {
        user: { uuid: string, email: string, name: string, };
        token: string;
    }
}