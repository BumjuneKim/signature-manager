import {
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Request,
    UploadedFile,
    UseFilters,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { IRequestWithUser } from "../../common/interface/IRequestWithUser";
import { FileInterceptor } from "@nestjs/platform-express";
import { SignsService } from "../service/signs.service";
import { ApiExceptionFilter } from "../../common/exception/ApiExceptionFilter";
import { Sign } from "../entity/sign.entity";
import { IResponse, setSuccessRespFormat } from "../../common/middleware/userParse";
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileUploadDto } from "../dto/request/file-upload-dto";
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import { UserDto } from "../dto/request/user-dto";
import { SignupResponse } from "../dto/response/signup-response";
import { SignAddResponse } from "../dto/response/sign-add-response";

@ApiTags("signature-manager")
@Controller("/api/signs")
@UseFilters(new ApiExceptionFilter())
export class SignsController {
    constructor(private readonly signsService: SignsService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor("image", {
            fileFilter(
                req: any,
                file: {
                    fieldname: string;
                    originalname: string;
                    encoding: string;
                    mimetype: string;
                    size: number;
                    destination: string;
                    filename: string;
                    path: string;
                    buffer: Buffer;
                },
                callback: (error: Error | null, acceptFile: boolean) => void,
            ) {
                const { mimetype = "" } = file;
                const [type, ext] = mimetype.split("/");
                const isSignableImage = type === "image" && ["jpeg", "png"].indexOf(ext) !== -1;

                return isSignableImage ? callback(null, true) : callback(new Error("Not Acceptable Image type"), false);
            },
        }),
    )
    @ApiConsumes("multipart/form-data")
    @ApiBody({ description: "서명 생성 API", type: FileUploadDto })
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiCreatedResponse({ description: "서명 등록 성공", type: SignAddResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "서명으로 사용할 이미지 없음" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "비로그인 상태로 요청" })
    async addSign(@Request() req: IRequestWithUser, @UploadedFile() image): Promise<SignAddResponse> {
        const newSign = await this.signsService.addSign({ user: req.user, image });
        return new SignAddResponse({ signId: newSign.id.toString(), signImageUrl: newSign.signImageUrl });
    }

    @Get()
    async getMySigns(@Request() req: IRequestWithUser): Promise<IResponse<Sign[]>> {
        const signs = await this.signsService.getMySigns({ user: req.user });
        return setSuccessRespFormat(signs);
    }

    @Delete("/:signId")
    @UsePipes(new ValidationPipe({ transform: true }))
    async deleteSign(@Request() req: IRequestWithUser, @Param("signId") signId: string): Promise<IResponse<void>> {
        await this.signsService.deleteSign({ user: req.user, signId });
        return setSuccessRespFormat();
    }
}
