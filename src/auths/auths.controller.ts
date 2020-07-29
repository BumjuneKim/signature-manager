import { Controller, Post, Get, Body, Request, UsePipes, ValidationPipe, UseFilters, UseGuards } from "@nestjs/common";
import { AuthsService } from "./auths.service";
import { UserDto } from "./dto/user-dto";
import { ApiExceptionFilter } from "../common/exception/ApiExceptionFilter";
import { User } from "../common/schemas/user.entity";
import { LocalAuthGuard } from "./local.authguard";
import { IRequestWithUser } from "../common/interface/IRequestWithUser";

@Controller("/api/auth")
@UseFilters(new ApiExceptionFilter())
export class AuthsController {
    constructor(private readonly authsService: AuthsService) {}

    @Post("signup")
    @UsePipes(new ValidationPipe({ transform: true }))
    async signUp(@Request() req: Request, @Body() userDto: UserDto): Promise<Omit<User, "password">> {
        const { password, ...result } = await this.authsService.doSignUp(userDto);
        return result;
    }

    @Post("signin")
    @UseGuards(new LocalAuthGuard())
    async signIn(@Request() req: IRequestWithUser): Promise<any> {
        return req.user;
    }

    @Post("logout")
    async logout(@Request() req: IRequestWithUser): Promise<void> {
        req.logout();
    }
}
