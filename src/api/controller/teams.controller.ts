import {
    Controller,
    Request,
    Post,
    UsePipes,
    ValidationPipe,
    Body,
    Param,
    HttpCode,
    Delete,
    Put,
} from "@nestjs/common";
import { TeamsService } from "../service/teams.service";
import { IRequestWithUser } from "../../common/interface/IRequestWithUser";
import { TeamCreateDto } from "../dto/request/team-create-dto";
import { TeamCrewAddDto } from "../dto/request/teamcrew-add-dto";
import { TeamSignAddDto } from "../dto/request/teamsign-add-dto";
import { Team } from "../entity/team.entity";
import { IResponse, setSuccessRespFormat } from "../../common/middleware/userParse";
import { TeamSignDeleteDto } from "../dto/request/teamsign-delete-dto";
import { TeamCrewAuthEditDto } from "../dto/request/teamcrew-auth-edit-dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("signature-manager")
@Controller("/api/teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createTeam(@Request() req: IRequestWithUser, @Body() teamCreateDto: TeamCreateDto): Promise<IResponse<Team>> {
        const team = await this.teamsService.createTeam({ user: req.user, teamCreateDto });
        return setSuccessRespFormat(team);
    }

    // 팀 초대는 invitation 방식으로 가는게 좋을 것 같지만 여기서는 API 호출로 바로 팀원이 된다고 가정
    @HttpCode(200)
    @Post("/:teamId/crew")
    @UsePipes(new ValidationPipe({ transform: true }))
    async addCrewToTeam(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Body() teamCrewAddDto: TeamCrewAddDto,
    ): Promise<IResponse<void>> {
        await this.teamsService.addCrewToTeam({ user: req.user, teamId, crewUserId: teamCrewAddDto.crewUserId });
        return setSuccessRespFormat();
    }

    @Put("/:teamId/crew/:crewId")
    @UsePipes(new ValidationPipe({ transform: true }))
    async editTeamCrewAuthority(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Param("crewId") crewId: string,
        @Body() teamCrewAuthEditDto: TeamCrewAuthEditDto,
    ): Promise<IResponse<void>> {
        await this.teamsService.editTeamCrewAuthority({
            user: req.user,
            editAuthority: teamCrewAuthEditDto.editAuthority,
            teamId,
            crewId,
        });

        return setSuccessRespFormat();
    }

    @Post("/:teamId/sign")
    @UsePipes(new ValidationPipe({ transform: true }))
    async addTeamSignFromMine(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Body() teamsignAddDto: TeamSignAddDto,
    ): Promise<IResponse<void>> {
        await this.teamsService.addTeamSignFromMine({ user: req.user, signId: teamsignAddDto.signId, teamId });
        return setSuccessRespFormat();
    }

    @Delete("/:teamId/sign")
    @UsePipes(new ValidationPipe({ transform: true }))
    async deleteTeamSign(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Body() teamSignDeleteDto: TeamSignDeleteDto,
    ): Promise<IResponse<void>> {
        await this.teamsService.deleteTeamSign({ user: req.user, signId: teamSignDeleteDto.signId, teamId });
        return setSuccessRespFormat();
    }
}
