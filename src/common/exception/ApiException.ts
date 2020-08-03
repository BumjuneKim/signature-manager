import { HttpException } from "@nestjs/common";
import { ErrorCodes, ErrorData, getErrorByCode } from "./ErrorCodes";

export class ApiException {
    constructor(code: ErrorCodes) {
        const error: ErrorData = getErrorByCode(code);
        return new HttpException(error, error.status);
    }
}
