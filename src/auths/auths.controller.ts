import {
    Controller,
    Post,
    Get,
    Body,
    UsePipes,
    ValidationPipe,
    UseFilters,
} from "@nestjs/common";
import { AuthsService } from "./auths.service";
import { UserDto } from "./user-dto";
import { ApiExceptionFilter } from "../common/exception/ApiExceptionFilter";

@Controller("/api/auth")
@UseFilters(new ApiExceptionFilter())
export class AuthsController {
    constructor(private readonly authsService: AuthsService) {}

    @Post("signup")
    @UsePipes(new ValidationPipe({ transform: true }))
    async signUp(@Body() createUserDao: UserDto): Promise<any> {
        const aa = await this.authsService.doSignUp(createUserDao);
        return { hello: 1 };
    }
}
