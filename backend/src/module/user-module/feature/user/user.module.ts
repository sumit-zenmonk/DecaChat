import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { LoginUserModule } from "./login-user/login-user.module";

@Module({
    imports: [
        LoginUserModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: LoginUserModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [UserModule],
})

export class UserModule { }