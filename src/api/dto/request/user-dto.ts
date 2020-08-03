import { IsEmail, IsNotEmpty, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ description: "계정 이메일", type: String })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "계정 비밀번호", type: String })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ description: "사용자 이름", type: String })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "팀장 / 팀원 여부", type: Boolean })
    @IsBoolean()
    isManager: boolean;

    getEmail(): string {
        return this.email;
    }

    setPassword(password: string): void {
        this.password = password;
    }
}
