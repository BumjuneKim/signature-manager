import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TeamCreateDto {
    @ApiProperty({ description: "생성할 팀명", type: String })
    @IsNotEmpty()
    name: string;
}
