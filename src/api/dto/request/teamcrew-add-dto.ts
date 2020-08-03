import { IsNotEmpty } from "class-validator";

export class TeamCrewAddDto {
    @IsNotEmpty()
    crewUserId: string;
}
