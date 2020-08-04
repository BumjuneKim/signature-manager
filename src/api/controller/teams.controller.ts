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
import { IResponse, setSuccessRespFormat } from "../../common/middleware/userParse";
import { TeamSignDeleteDto } from "../dto/request/teamsign-delete-dto";
import { TeamCrewAuthEditDto } from "../dto/request/teamcrew-auth-edit-dto";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { TeamAddResponse } from "../dto/response/team-add-response";
import { SimpleSuccessResponse } from "../dto/response/simple-success-response";

@ApiTags("signature-manager")
@Controller("/api/teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Post()
    @ApiBody({ description: "팀 생성 API", type: TeamCreateDto })
    @ApiCreatedResponse({ description: "서명 가져오기 성공", type: TeamAddResponse })
    @ApiBadRequestResponse({ description: "동일한 이름의 팀이 이미 존재" })
    @ApiUnauthorizedResponse({ description: "비로그인 상태로 요청" })
    @ApiForbiddenResponse({ description: "팀장 권한을 갖지 않은 채로 요청" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async createTeam(@Request() req: IRequestWithUser, @Body() teamCreateDto: TeamCreateDto): Promise<TeamAddResponse> {
        const team = await this.teamsService.createTeam({ user: req.user, teamCreateDto });
        return new TeamAddResponse({ teamId: team.id.toString(), name: team.name });
    }

    // 팀 초대는 invitation 방식으로 가는게 좋을 것 같지만 여기서는 API 호출로 바로 팀원이 된다고 가정
    @HttpCode(200)
    @Post("/:teamId/crew")
    @ApiBody({ description: "팀원 추가 API", type: TeamCrewAddDto })
    @ApiParam({ description: "팀원을 추가할 팀의 ID", name: "teamId" })
    @ApiCreatedResponse({ description: "팀원 추가 성공", type: SimpleSuccessResponse })
    @ApiBadRequestResponse({ description: "이미 팀원으로 추가된 user" })
    @ApiUnauthorizedResponse({ description: "비로그인 상태로 요청" })
    @ApiForbiddenResponse({ description: "팀장 권한을 갖지 않은 채로 요청" })
    @ApiNotFoundResponse({ description: "팀이 존재하지 않음" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async addCrewToTeam(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Body() teamCrewAddDto: TeamCrewAddDto,
    ): Promise<SimpleSuccessResponse> {
        await this.teamsService.addCrewToTeam({ user: req.user, teamId, crewUserId: teamCrewAddDto.crewUserId });
        return new SimpleSuccessResponse();
    }

    @Put("/:teamId/crew/:crewId")
    @ApiBody({ description: "팀원 권한 변경 API", type: TeamCrewAuthEditDto })
    @ApiParam({ description: "권한 변경할 팀원이 속한 팀의 ID", name: "teamId" })
    @ApiParam({ description: "권한 변경할 팀원의 userID", name: "crewId" })
    @ApiCreatedResponse({ description: "팀원 권한 변경 성공", type: SimpleSuccessResponse })
    @ApiUnauthorizedResponse({ description: "비로그인 상태로 요청" })
    @ApiForbiddenResponse({ description: "팀장 권한을 갖지 않은 채로 요청" })
    @ApiNotFoundResponse({ description: "팀이 존재하지 않음" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async editTeamCrewAuthority(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Param("crewId") crewId: string,
        @Body() teamCrewAuthEditDto: TeamCrewAuthEditDto,
    ): Promise<SimpleSuccessResponse> {
        await this.teamsService.editTeamCrewAuthority({
            user: req.user,
            editAuthority: teamCrewAuthEditDto.editAuthority,
            teamId,
            crewId,
        });

        return new SimpleSuccessResponse();
    }

    @Post("/:teamId/sign")
    @ApiBody({ description: "팀 서명 추가 API", type: TeamSignAddDto })
    @ApiParam({ description: "서명을 추가할 팀의 ID", name: "teamId" })
    @ApiCreatedResponse({ description: "팀 서명 추가 성공", type: SimpleSuccessResponse })
    @ApiBadRequestResponse({ description: "사용이 불가능한 서명으로 추가 요청" })
    @ApiUnauthorizedResponse({ description: "비로그인 상태로 요청" })
    @ApiForbiddenResponse({ description: "자신이 소유하지 않은 서명으로 요청" })
    @ApiNotFoundResponse({ description: "서명을 찾을 수 없음" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async addTeamSignFromMine(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Body() teamsignAddDto: TeamSignAddDto,
    ): Promise<SimpleSuccessResponse> {
        await this.teamsService.addTeamSignFromMine({ user: req.user, signId: teamsignAddDto.signId, teamId });
        return new SimpleSuccessResponse();
    }

    @Delete("/:teamId/sign")
    @ApiBody({ description: "팀 서명 삭제 API", type: TeamSignDeleteDto })
    @ApiParam({ description: "서명을 삭제할 팀의 ID", name: "teamId" })
    @ApiCreatedResponse({ description: "팀 서명 추가 성공", type: SimpleSuccessResponse })
    @ApiUnauthorizedResponse({ description: "비로그인 상태로 요청" })
    @ApiForbiddenResponse({ description: "팀 서명을 삭제할 권한이 없음" })
    @ApiNotFoundResponse({ description: "서명을 찾을 수 없음" })
    @UsePipes(new ValidationPipe({ transform: true }))
    async deleteTeamSign(
        @Request() req: IRequestWithUser,
        @Param("teamId") teamId: string,
        @Body() teamSignDeleteDto: TeamSignDeleteDto,
    ): Promise<SimpleSuccessResponse> {
        await this.teamsService.deleteTeamSign({ user: req.user, signId: teamSignDeleteDto.signId, teamId });
        return new SimpleSuccessResponse();
    }
}
