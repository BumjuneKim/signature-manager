import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TeamCrewAddDto {
    @ApiProperty({ description: "추가할 팀원의 userID", type: String })
    @IsNotEmpty()
    crewUserId: string;
}
