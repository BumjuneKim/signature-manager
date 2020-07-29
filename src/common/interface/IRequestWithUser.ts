import { Request } from "express";
import { User } from "../schemas/user.entity";
export interface IRequestWithUser extends Request {
    user: User;
}
