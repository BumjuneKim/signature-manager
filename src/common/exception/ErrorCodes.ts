import { HttpStatus } from "@nestjs/common";

export interface ErrorData {
    errorCode: number;
    status: number;
    message: string;
}

export enum AuthErrors {
    NOT_LOGGED_IN = 1000,
    ALREADY_JOINED_EMAIL = 1001,
    NOT_FOUND_USER_FROM_EMAIL = 1002,
    WRONG_PASSWORD = 1003,
}

export enum SignErrors {
    NOT_ALLOW_IMAGE = 2001,
    NO_IMAGE = 2002,
    NO_SIGN = 2003,
    NOT_MY_SIGN = 2004,
}

export enum CommonErrors {}

export type ErrorCodes = AuthErrors | SignErrors | CommonErrors;

const errors: { [code: number]: ErrorData } = {
    [AuthErrors.NOT_LOGGED_IN]: {
        errorCode: AuthErrors.NOT_LOGGED_IN,
        status: HttpStatus.UNAUTHORIZED,
        message: "로그인을 해야만 진행할 수 있습니다.",
    },
    [AuthErrors.ALREADY_JOINED_EMAIL]: {
        errorCode: AuthErrors.ALREADY_JOINED_EMAIL,
        status: HttpStatus.BAD_REQUEST,
        message: "이미 가입된 이메일 입니다.",
    },
    [AuthErrors.NOT_FOUND_USER_FROM_EMAIL]: {
        errorCode: AuthErrors.NOT_FOUND_USER_FROM_EMAIL,
        status: HttpStatus.NOT_FOUND,
        message: "가입되지 않은 이메일이거나, 잘못된 비밀번호 입니다. ",
    },
    [AuthErrors.WRONG_PASSWORD]: {
        errorCode: AuthErrors.WRONG_PASSWORD,
        status: HttpStatus.UNAUTHORIZED,
        message: "가입되지 않은 이메일이거나, 잘못된 비밀번호 입니다. ",
    },
    [SignErrors.NOT_ALLOW_IMAGE]: {
        errorCode: SignErrors.NOT_ALLOW_IMAGE,
        status: HttpStatus.BAD_REQUEST,
        message: "jpg, png 이미지 파일만 서명으로 등록이 가능합니다.",
    },
    [SignErrors.NO_IMAGE]: {
        errorCode: SignErrors.NO_IMAGE,
        status: HttpStatus.BAD_REQUEST,
        message: "서명으로 등록할 이미지를 찾을 수 없습니다.",
    },
    [SignErrors.NO_SIGN]: {
        errorCode: SignErrors.NO_SIGN,
        status: HttpStatus.NOT_FOUND,
        message: "서명을 찾을 수 없습니다.",
    },
    [SignErrors.NOT_MY_SIGN]: {
        errorCode: SignErrors.NOT_MY_SIGN,
        status: HttpStatus.FORBIDDEN,
        message: "",
    },
};

export const getErrorByCode = (code: ErrorCodes): ErrorData => {
    return (
        errors[code] || {
            errorCode: 500,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error Occurred",
        }
    );
};
