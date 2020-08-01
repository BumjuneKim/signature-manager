import { Controller, Request, Post, UsePipes, ValidationPipe, Body, Param, HttpCode } from "@nestjs/common";
import { TeamsService } from "../service/teams.service";
import { IRequestWithUser } from "../../common/interface/IRequestWithUser";
import { TeamCreateDto } from "../dto/team-create-dto";
import { TeamCrewAddDto } from "../dto/teamcrew-add-dto";
import { TeamSignAddDto } from "../dto/teamsign-add-dto";

@Controller("/api/teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createTeam(@Request() req: IRequestWithUser, @Body() teamCreateDto: TeamCreateDto): Promise<any> {
        return await this.teamsService.createTeam({ user: req.user, teamCreateDto });
    }

    // 팀 초대는 invitation 방식으로 가는게 좋을 것 같지만 여기서는 API 호출로 바로 팀원이 된다고 가정
    @HttpCode(200)
    @Post("/:teamId/crew")
    @UsePipes(new ValidationPipe({ transform: true }))
    async addCrewToTeam(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Body() teamCrewAddDto: TeamCrewAddDto,
    ): Promise<any> {
        return await this.teamsService.addCrewToTeam({ user: req.user, teamId, crewUserId: teamCrewAddDto.crewUserId });
    }

    @Post("/:teamId/sign")
    @UsePipes(new ValidationPipe({ transform: true }))
    async addTeamSignFromMine(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Body() teamsignAddDto: TeamSignAddDto,
    ): Promise<any> {
        return await this.teamsService.addTeamSignFromMine({ user: req.user, signId: teamsignAddDto.signId, teamId });
    }
}