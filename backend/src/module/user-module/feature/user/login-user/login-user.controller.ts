import { Body, Controller, Post, Req } from "@nestjs/common";
import { LoginUserService } from "./login-user.handler";
import { LoginUserDto } from "./login-user.dto";
import type { Request } from "express";

@Controller('/login')
export class LoginUserController {
    constructor(private readonly loginUserService: LoginUserService) { }

    @Post()
    async loginUser(@Req() req: Request, @Body() body: LoginUserDto) {
        const { token, isUserExists } = await this.loginUserService.handle(req, body);
        return {
            message: "Logged In User",
            access_token: token,
            user: {
                email: isUserExists.email,
                uuid: isUserExists.uuid,
            }
        }
    }
}