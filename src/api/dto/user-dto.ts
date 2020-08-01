import { IsEmail, IsNotEmpty, IsBoolean } from "class-validator";

export class UserDto {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    name: string;
    @IsBoolean()
    isManager: boolean;
    @IsNotEmpty()
    password: string;

    getEmail(): string {
        return this.email;
    }

    setPassword(password: string): void {
        this.password = password;
    }
}
