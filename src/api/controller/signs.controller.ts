import {
    Controller,
    Delete,
    Get,
    HttpCode,
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
    @UsePipes(new ValidationPipe({ transform: true }))
    async addSign(@Request() req: IRequestWithUser, @UploadedFile() image): Promise<IResponse<Sign>> {
        const sign = await this.signsService.addSign({ user: req.user, image });
        return setSuccessRespFormat(sign);
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
