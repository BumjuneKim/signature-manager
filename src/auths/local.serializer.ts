import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../common/schemas/user.entity";
import { MongoRepository } from "typeorm";

@Injectable()
export class LocalSerializer extends PassportSerializer {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: MongoRepository<User>,
    ) {
        super();
    }

    serializeUser(user: User, done: CallableFunction): void {
        done(null, user);
    }

    async deserializeUser(user: User, done: CallableFunction): Promise<any> {
        return await this.usersRepository
            .findOne(user.id)
            .then(user => done(null, user))
            .catch(error => done(error));
    }
}
