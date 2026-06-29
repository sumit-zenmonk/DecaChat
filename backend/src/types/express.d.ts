import 'express';

declare module 'express' {
    interface Request {
        user: { uuid: string, email: string };
        token: string;
    }
}