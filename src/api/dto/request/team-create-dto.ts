import { IsNotEmpty } from "class-validator";

export class TeamCreateDto {
    @IsNotEmpty()
    name: string;
}
