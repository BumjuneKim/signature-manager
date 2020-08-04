import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TeamSignDeleteDto {
    @ApiProperty({ description: "팀에서 삭제할 서명의 ID", type: String })
    @IsNotEmpty()
    signId: string;
}
