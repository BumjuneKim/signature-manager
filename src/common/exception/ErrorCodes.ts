import { HttpStatus } from "@nestjs/common";

export interface ErrorData {
    errorCode: number;
    status: number;
    message: string;
}

export enum AuthErrors {
    DEFAULT = 500,
    ALREADY_JOINED_EMAIL = 1001,
}

export type ErrorCodes = AuthErrors;

const errors: { [code: number]: ErrorData } = {
    [AuthErrors.ALREADY_JOINED_EMAIL]: {
        errorCode: AuthErrors.ALREADY_JOINED_EMAIL,
        status: HttpStatus.BAD_REQUEST,
        message: "이미 가입된 이메일 입니다.",
    },
};

export const getErrorByCode = (code: ErrorCodes): ErrorData => {
    return (
        errors[code] || {
            errorCode: AuthErrors.DEFAULT,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error Occurred",
        }
    );
};
