import { IsEnum, IsNotEmpty } from "class-validator";
import { TeamCrewAuthority } from "../../entity/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class TeamCrewAuthEditDto {
    @ApiProperty({ description: "변경할 권한 내역", enum: TeamCrewAuthority, type: String })
    @IsNotEmpty()
    @IsEnum(TeamCrewAuthority)
    editAuthority: TeamCrewAuthority;
}
