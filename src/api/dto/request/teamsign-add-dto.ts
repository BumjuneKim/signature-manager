import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TeamSignAddDto {
    @ApiProperty({ description: "팀 서명으로 등록할 서명의 ID", type: String })
    @IsNotEmpty()
    signId: string;
}
