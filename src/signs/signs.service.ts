import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { isEmpty } from "lodash";
import { User } from "../common/schemas/user.entity";
import { ApiException } from "../common/exception/ApiException";
import { AuthErrors, SignErrors } from "../common/exception/ErrorCodes";
import { Sign, SignStatus } from "../common/schemas/sign.entity";
import { putImageToS3 } from "../common/utils/s3Uploader";

@Injectable()
export class SignsService {
    constructor(
        @InjectRepository(Sign)
        private readonly signsRepository: MongoRepository<Sign>,
    ) {}

    async addSign(options: { user: User; image }): Promise<Sign> {
        const { user, image } = options;

        if (isEmpty(user)) throw new ApiException(AuthErrors.NOT_LOGGED_IN);
        if (isEmpty(image)) throw new ApiException(SignErrors.NO_IMAGE);

        const { url } = await putImageToS3(image);

        return this.signsRepository.save(
            new Sign({
                status: SignStatus.ACTIVE,
                owner: user.id.toString(),
                signImageUrl: url,
            }),
        );
    }

    async getMySigns(options: { user: User }): Promise<Sign[]> {
        const { user } = options;
        if (isEmpty(user)) throw new ApiException(AuthErrors.NOT_LOGGED_IN);

        return this.signsRepository.find({ owner: user.id.toString(), status: SignStatus.ACTIVE });
    }

    async deleteSign(options: { user: User; signId: string }): Promise<any> {
        const { user, signId } = options;

        if (isEmpty(user)) throw new ApiException(AuthErrors.NOT_LOGGED_IN);
        const targetSign: Sign = await this.signsRepository.findOne(signId);
        if (!targetSign) throw new ApiException(SignErrors.NO_SIGN);
        if (user.id.toString() !== targetSign.owner) throw new ApiException(SignErrors.NOT_MY_SIGN);

        return this.signsRepository.updateOne({ _id: targetSign.id }, { $set: { status: SignStatus.DELETED } });
    }

    // async doSignUp(userDto: UserDto): Promise<User> {
    //     const equalEmailUser = await this.usersRepository.findOne({
    //         email: userDto.getEmail(),
    //     });
    //     if (equalEmailUser) throw new ApiException(AuthErrors.ALREADY_JOINED_EMAIL);
    //
    //     const digestedPassword = crypto
    //         .createHash("sha256")
    //         .update(userDto.password)
    //         .digest("hex");
    //     const hashedPassword = await bcrypt.hash(digestedPassword, 10);
    //     userDto.setPassword(hashedPassword);
    //
    //     return await this.usersRepository.save(new User(userDto));
    // }
    //
    // async doSignIn(email: string, pwd: string): Promise<any> {
    //     const targetUser = await this.usersRepository.findOne({ email });
    //     if (!targetUser) return null;
    //
    //     const digestedPassword = crypto
    //         .createHash("sha256")
    //         .update(pwd)
    //         .digest("hex");
    //     const pwCheckResult = await bcrypt.compare(digestedPassword, targetUser.password);
    //     if (!pwCheckResult) throw new ApiException(AuthErrors.WRONG_PASSWORD);
    //
    //     const { password, ...userInfo } = targetUser;
    //     return userInfo;
    // }
}
