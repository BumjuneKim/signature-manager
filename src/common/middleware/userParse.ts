import { Request, Response } from "express";
export function userParse(req: Request, res: Response, next: CallableFunction): void {
    req.user = req.session?.passport?.user;
    next();
}

export interface IResponse<T> {
    success: boolean;
    result: T;
}

export function setSuccessRespFormat(result = {}): IResponse<any> {
    return { success: true, result };
}
