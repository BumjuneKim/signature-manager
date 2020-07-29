import { Request, Response } from "express";
export function userParse(req: Request, res: Response, next: CallableFunction): void {
    req.user = req.session?.passport?.user;
    next();
}
