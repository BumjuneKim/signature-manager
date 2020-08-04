import {
    Controller,
    Delete,
    Get,
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
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FileUploadDto } from "../dto/request/file-upload-dto";
import { SignAddResponse } from "../dto/response/sign-add-response";
import { SignGetResponse } from "../dto/response/sign-get-response";
import { SimpleSuccessResponse } from "../dto/response/simple-success-response";

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
    @ApiBadRequestResponse({ description: "서명으로 사용할 이미지 없음" })
    @ApiUnauthorizedResponse({ description: "비로그인 상태로 요청" })
    async addSign(@Request() req: IRequestWithUser, @UploadedFile() image): Promise<SignAddResponse> {
        const newSign = await this.signsService.addSign({ user: req.user, image });
        return new SignAddResponse({ signId: newSign.id.toString(), signImageUrl: newSign.signImageUrl });
    }

    @Get()
    @ApiCreatedResponse({ description: "서명 가져오기 성공", type: [SignGetResponse] })
    @ApiUnauthorizedResponse({ description: "비로그인 상태로 요청" })
    async getMySigns(@Request() req: IRequestWithUser): Promise<SignGetResponse[]> {
        const signs = await this.signsService.getMySigns({ user: req.user });

        return signs.map<SignGetResponse>(sign => {
            return new SignGetResponse({
                signId: sign.id.toString(),
                signImageUrl: sign.signImageUrl,
                createdAt: sign.createdAt,
            });
        });
    }

    @Delete("/:signId")
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiParam({ description: "삭제할 서명의 ID", name: "signId" })
    @ApiCreatedResponse({ description: "서명 삭제 성공", type: SimpleSuccessResponse })
    @ApiUnauthorizedResponse({ description: "비로그인 상태로 요청" })
    @ApiForbiddenResponse({ description: "소유하지 않은 서명 삭제 요청" })
    @ApiNotFoundResponse({ description: "서명을 찾을 수 없음" })
    async deleteSign(
        @Request() req: IRequestWithUser,
        @Param("signId") signId: string,
    ): Promise<SimpleSuccessResponse> {
        await this.signsService.deleteSign({ user: req.user, signId });
        return new SimpleSuccessResponse();
    }
}
