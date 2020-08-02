import { IsNotEmpty } from "class-validator";

export class TeamSignDeleteDto {
    @IsNotEmpty()
    signId: string;
}
