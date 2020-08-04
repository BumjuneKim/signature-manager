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
import { LocalAuthGuard } from "../auth/local.authguard";
import { IRequestWithUser } from "../../common/interface/IRequestWithUser";
import { ApiBody, ApiCreatedResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SignInDto } from "../dto/request/signin-dto";
import { SimpleSuccessResponse } from "../dto/response/simple-success-response";
import { LoginUserResponse } from "../dto/response/login-user-response";

@ApiTags("signature-manager")
@Controller("/api/auth")
@UseFilters(new ApiExceptionFilter())
export class AuthsController {
    constructor(private readonly authsService: AuthsService) {}

    @Post("signup")
    @ApiBody({ description: "회원가입 API", type: UserDto })
    @ApiCreatedResponse({ description: "회원가입 성공", type: SimpleSuccessResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "이미 가입된 이메일로 회원 가입 신청한 경우" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async signUp(@Body() userDto: UserDto): Promise<SimpleSuccessResponse> {
        await this.authsService.doSignUp(userDto);
        return new SimpleSuccessResponse();
    }

    @HttpCode(200)
    @Post("signin")
    @UseGuards(new LocalAuthGuard())
    @ApiBody({ description: "로그인 API", type: SignInDto })
    @ApiCreatedResponse({ status: HttpStatus.OK, description: "로그인 성공", type: LoginUserResponse })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "로그인 정보가 맞지 않음" })
    async signIn(@Request() req: IRequestWithUser): Promise<LoginUserResponse> {
        const { id, isManager } = req.user;
        return new LoginUserResponse({ id, isManager });
    }

    @HttpCode(200)
    @Post("logout")
    @ApiCreatedResponse({ status: HttpStatus.OK, description: "로그아웃 성공" })
    async logout(@Request() req: IRequestWithUser): Promise<void> {
        req.logout();
    }
}
