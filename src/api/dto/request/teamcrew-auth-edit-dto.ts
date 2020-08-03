import { IsEnum, IsNotEmpty } from "class-validator";
import { TeamCrewAuthority } from "../../entity/user.entity";

export class TeamCrewAuthEditDto {
    @IsNotEmpty()
    @IsEnum(TeamCrewAuthority)
    editAuthority: TeamCrewAuthority;
}
