import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";
import { User } from "./user.entity";
import { MongoRepository } from "typeorm";
import { UserDto } from "./user-dto";
import { ApiException } from "../common/exception/ApiException";
import { AuthErrors } from "../common/exception/ErrorCodes";

@Injectable()
export class AuthsService {
    constructor(
        @InjectRepository(User)
        private readonly petsRepository: MongoRepository<User>,
    ) {}

    async doSignUp(userDto: UserDto): Promise<User> {
        const equalEmailUser = await this.petsRepository.findOne({
            email: userDto.email,
        });
        if (equalEmailUser)
            throw new ApiException(AuthErrors.ALREADY_JOINED_EMAIL);

        const digestedPassword = crypto
            .createHash("sha256")
            .update(userDto.password)
            .digest("hex");
        const hashedPassword = await bcrypt.hash(digestedPassword, 10);
        userDto.setPassword(hashedPassword);

        return await this.petsRepository.save(new User(userDto));
    }
}
