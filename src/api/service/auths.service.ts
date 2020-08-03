import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";
import { User } from "../entity/user.entity";
import { MongoRepository } from "typeorm";
import { UserDto } from "../dto/request/user-dto";
import { ApiException } from "../../common/exception/ApiException";
import { AuthErrors } from "../../common/exception/ErrorCodes";

@Injectable()
export class AuthsService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: MongoRepository<User>,
    ) {}

    async doSignUp(userDto: UserDto): Promise<void> {
        const equalEmailUser = await this.usersRepository.findOne({
            email: userDto.getEmail(),
        });
        if (equalEmailUser) throw new ApiException(AuthErrors.ALREADY_JOINED_EMAIL);

        const digestedPassword = crypto
            .createHash("sha256")
            .update(userDto.password)
            .digest("hex");
        const hashedPassword = await bcrypt.hash(digestedPassword, 10);
        userDto.setPassword(hashedPassword);

        await this.usersRepository.save(new User(userDto));
    }

    async doSignIn(email: string, pwd: string): Promise<any> {
        const targetUser = await this.usersRepository.findOne({ email });
        if (!targetUser) return null;

        const digestedPassword = crypto
            .createHash("sha256")
            .update(pwd)
            .digest("hex");
        const pwCheckResult = await bcrypt.compare(digestedPassword, targetUser.password);
        if (!pwCheckResult) throw new ApiException(AuthErrors.WRONG_PASSWORD);

        const { password, ...userInfo } = targetUser;
        return userInfo;
    }
}
