import {
    Controller,
    Post,
    Body,
    Request,
    UsePipes,
    ValidationPipe,
    UseFilters,
    UseGuards,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";
import { AuthsService } from "../service/auths.service";
import { UserDto } from "../dto/request/user-dto";
import { ApiExceptionFilter } from "../../common/exception/ApiExceptionFilter";
import { User } from "../entity/user.entity";
import { LocalAuthGuard } from "../auth/local.authguard";
import { IRequestWithUser } from "../../common/interface/IRequestWithUser";
import { IResponse, setSuccessRespFormat } from "../../common/middleware/userParse";
import { ApiBody, ApiCreatedResponse, ApiResponse } from "@nestjs/swagger";
import { SignupResponse } from "../dto/response/signup-response";
import { SignInDto } from "../dto/request/signin-dto";

@Controller("/api/auth")
@UseFilters(new ApiExceptionFilter())
export class AuthsController {
    constructor(private readonly authsService: AuthsService) {}

    @Post("signup")
    @ApiBody({ type: UserDto })
    @ApiCreatedResponse({ description: "회원가입 성공", type: SignupResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "이미 가입된 이메일로 회원 가입 신청한 경우" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async signUp(@Body() userDto: UserDto): Promise<SignupResponse> {
        await this.authsService.doSignUp(userDto);
        return new SignupResponse();
    }

    @HttpCode(200)
    @Post("signin")
    @UseGuards(new LocalAuthGuard())
    @ApiBody({ type: SignInDto })
    async signIn(@Request() req: IRequestWithUser): Promise<IResponse<User>> {
        return setSuccessRespFormat(req.user);
    }

    @HttpCode(200)
    @Post("logout")
    async logout(@Request() req: IRequestWithUser): Promise<void> {
        req.logout();
    }
}
