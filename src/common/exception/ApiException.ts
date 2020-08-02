import { HttpException } from "@nestjs/common";
import { ErrorCodes, ErrorData, getErrorByCode } from "./ErrorCodes";

export class ApiException {
    constructor(code: ErrorCodes) {
        const error: ErrorData = getErrorByCode(code);
        return new HttpException(Object.assign(error, { success: false }), error.status);
    }
}
