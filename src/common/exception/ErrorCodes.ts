import { HttpStatus } from "@nestjs/common";
import { TeamCreateDto } from "../../api/dto/team-create-dto";

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
    NOT_ACTIVE = 2005,
}

export enum TeamErrors {
    NOT_ALLOW_TEAM_CREATE = 3001,
    HAS_ALREADY_EQUAL_NAME_TEAM = 3002,
    NO_TEAM = 3003,
    NOT_ALLOW_ADD_TEAM_CREW = 3004,
    NOT_EXISTS_CREW = 3005,
    MANAGER_CAN_NOT_BE_CREW = 3006,
    ALREADY_ADDED = 3007,
    NOT_MY_OWN_TEAM = 3008,
    ALREADY_TEAM_SIGN = 3009,
    NOT_TEAM_CREW = 3010,
    NO_WRITE_PERMISSION = 3011,
}

export enum CommonErrors {}

export type ErrorCodes = AuthErrors | SignErrors | TeamErrors | CommonErrors;

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
        message: "자신의 서명만 삭제 가능 합니다.",
    },
    [SignErrors.NOT_ACTIVE]: {
        errorCode: SignErrors.NOT_ACTIVE,
        status: HttpStatus.BAD_REQUEST,
        message: "사용이 불가능한 서명입니다.",
    },
    [TeamErrors.NOT_ALLOW_TEAM_CREATE]: {
        errorCode: TeamErrors.NOT_ALLOW_TEAM_CREATE,
        status: HttpStatus.FORBIDDEN,
        message: "팀을 생성할 수 있는 권한이 없습니다.",
    },
    [TeamErrors.HAS_ALREADY_EQUAL_NAME_TEAM]: {
        errorCode: TeamErrors.HAS_ALREADY_EQUAL_NAME_TEAM,
        status: HttpStatus.BAD_REQUEST,
        message: "같은 이름의 팀이 존재합니다.",
    },
    [TeamErrors.NO_TEAM]: {
        errorCode: TeamErrors.NO_TEAM,
        status: HttpStatus.NOT_FOUND,
        message: "팀이 존재하지 않습니다.",
    },
    [TeamErrors.NOT_ALLOW_ADD_TEAM_CREW]: {
        errorCode: TeamErrors.NOT_ALLOW_ADD_TEAM_CREW,
        status: HttpStatus.FORBIDDEN,
        message: "팀원을 추가할 권한이 없습니다.",
    },
    [TeamErrors.NOT_EXISTS_CREW]: {
        errorCode: TeamErrors.NOT_EXISTS_CREW,
        status: HttpStatus.BAD_REQUEST,
        message: "팀원이 존재하지 않습니다.",
    },
    [TeamErrors.MANAGER_CAN_NOT_BE_CREW]: {
        errorCode: TeamErrors.MANAGER_CAN_NOT_BE_CREW,
        status: HttpStatus.FORBIDDEN,
        message: "팀장은 팀원이 될 수 없습니다.",
    },
    [TeamErrors.ALREADY_ADDED]: {
        errorCode: TeamErrors.ALREADY_ADDED,
        status: HttpStatus.BAD_REQUEST,
        message: "이미 팀원으로 등록되었습니다.",
    },
    [TeamErrors.NOT_MY_OWN_TEAM]: {
        errorCode: TeamErrors.NOT_MY_OWN_TEAM,
        status: HttpStatus.FORBIDDEN,
        message: "소유한 팀이 아닙니다.",
    },
    [TeamErrors.ALREADY_TEAM_SIGN]: {
        errorCode: TeamErrors.ALREADY_TEAM_SIGN,
        status: HttpStatus.BAD_REQUEST,
        message: "이미 팀 서명으로 등록되었습니다.",
    },
    [TeamErrors.NOT_TEAM_CREW]: {
        errorCode: TeamErrors.NOT_TEAM_CREW,
        status: HttpStatus.FORBIDDEN,
        message: "팀 접근 권한 없음",
    },
    [TeamErrors.NO_WRITE_PERMISSION]: {
        errorCode: TeamErrors.NO_WRITE_PERMISSION,
        status: HttpStatus.FORBIDDEN,
        message: "팀 설정 변경 권한 없음",
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
