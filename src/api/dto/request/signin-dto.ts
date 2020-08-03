import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
    @ApiProperty({ description: "계정 이메일", type: String })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "계정 비밀번호", type: String })
    @IsNotEmpty()
    password: string;
}
