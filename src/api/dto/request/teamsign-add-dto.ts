import { IsNotEmpty } from "class-validator";

export class TeamSignAddDto {
    @IsNotEmpty()
    signId: string;
}
