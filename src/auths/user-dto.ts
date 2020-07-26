import { IsEmail, IsNotEmpty, IsBoolean } from "class-validator";

export class UserDto {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    password: string;
    @IsBoolean()
    isManager: boolean;

    setPassword(password: string) {
        this.password = password;
    }
}
