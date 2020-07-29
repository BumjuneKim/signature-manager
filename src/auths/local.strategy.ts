import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthsService } from "./auths.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authsService: AuthsService) {
        super({ usernameField: "email" });
    }

    async validate(email: string, password: string, done: CallableFunction): Promise<any> {
        return await this.authsService
            .doSignIn(email, password)
            .then(user => {
                done(null, user);
            })
            .catch(e => done(e));
    }
}
