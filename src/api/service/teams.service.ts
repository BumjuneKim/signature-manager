import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { Team } from "../entity/team.entity";
import { TeamCrewAuthority, User } from "../entity/user.entity";
import { TeamCreateDto } from "../dto/request/team-create-dto";
import { isEmpty } from "lodash";
import { ApiException } from "../../common/exception/ApiException";
import { AuthErrors, SignErrors, TeamErrors } from "../../common/exception/ErrorCodes";
import { Sign, SignStatus } from "../entity/sign.entity";
import { ObjectID } from "mongodb";

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private readonly teamsRepository: MongoRepository<Team>,
        @InjectRepository(User)
        private readonly usersRepository: MongoRepository<User>,
        @InjectRepository(Sign)
        private readonly signsRepository: MongoRepository<Sign>,
    ) {}

    async createTeam(options: { user: User; teamCreateDto: TeamCreateDto }): Promise<Team> {
        const {
            user,
            teamCreateDto: { name },
        } = options;

        if (isEmpty(user)) throw new ApiException(AuthErrors.NOT_LOGGED_IN);
        if (!user.isManager) throw new ApiException(TeamErrors.NOT_ALLOW_TEAM_CREATE);

        const equalNameTeam = await this.teamsRepository.findOne({ owner: user.id.toString(), name });
        if (equalNameTeam) throw new ApiException(TeamErrors.HAS_ALREADY_EQUAL_NAME_TEAM);

        return await this.teamsRepository.save({
            owner: user.id.toString(),
            name,
        });
    }

    async addCrewToTeam(options: { user: User; teamId: string; crewUserId: string }): Promise<void> {
        const { user, teamId, crewUserId } = options;

        if (isEmpty(user)) throw new ApiException(AuthErrors.NOT_LOGGED_IN);
        if (!user.isManager) throw new ApiException(TeamErrors.NOT_ALLOW_ADD_TEAM_CREW);

        const targetTeam = await this.teamsRepository.findOne(teamId);
        if (!targetTeam) throw new ApiException(TeamErrors.NO_TEAM);
        if (user.id.toString() !== targetTeam.owner) throw new ApiException(TeamErrors.NOT_ALLOW_ADD_TEAM_CREW);

        const crewUser = await this.usersRepository.findOne(crewUserId);
        if (!crewUser) throw new ApiException(TeamErrors.NOT_EXISTS_CREW);
        if (crewUser.isManager) throw new ApiException(TeamErrors.MANAGER_CAN_NOT_BE_CREW);

        const { belongingTeams = [] } = crewUser;
        if (belongingTeams.find(team => team.teamId === teamId)) throw new ApiException(TeamErrors.ALREADY_ADDED);

        await this.usersRepository.updateOne(
            { _id: crewUser.id },
            { $push: { belongingTeams: { teamId, authority: TeamCrewAuthority.READ_ONLY } } },
        );
    }

    async editTeamCrewAuthority(options: {
        user: User;
        editAuthority: TeamCrewAuthority;
        teamId: string;
        crewId: string;
    }): Promise<void> {
        const { user, editAuthority, teamId, crewId } = options;

        if (!user.isManager) throw new ApiException(TeamErrors.NOT_ALLOW_EDIT_CREW_AUTH);

        const targetTeam = await this.teamsRepository.findOne(teamId);
        if (!targetTeam) throw new ApiException(TeamErrors.NO_TEAM);
        if (targetTeam.owner !== user.id.toString()) throw new ApiException(TeamErrors.NOT_MY_OWN_TEAM);

        const crewUser = await this.usersRepository.findOne(crewId);
        if (!crewUser) throw new ApiException(TeamErrors.NOT_EXISTS_CREW);

        const belongsTeam = (crewUser.belongingTeams || []).find(bt => bt.teamId === teamId);
        if (!belongsTeam) throw new ApiException(TeamErrors.NOT_TEAM_CREW);

        belongsTeam.authority = editAuthority;

        await this.usersRepository.updateOne(
            { _id: crewUser.id },
            { $set: { belongingTeams: crewUser.belongingTeams } },
        );
    }

    async addTeamSignFromMine(options: { user: User; signId: string; teamId: string }): Promise<void> {
        const { user, signId, teamId } = options;

        if (isEmpty(user)) throw new ApiException(AuthErrors.NOT_LOGGED_IN);

        const targetSign = await this.signsRepository.findOne(signId);
        if (!targetSign) throw new ApiException(SignErrors.NO_SIGN);
        if (targetSign.owner !== user.id.toString()) throw new ApiException(SignErrors.NOT_MY_SIGN);
        if (targetSign.status !== SignStatus.ACTIVE) throw new ApiException(SignErrors.NOT_ACTIVE);

        const targetTeam = await this.teamsRepository.findOne(teamId);
        if (!targetTeam) throw new ApiException(TeamErrors.NO_TEAM);

        const hasAlready = !!(targetTeam.sharedSignIds || []).find(sid => sid === signId);
        if (hasAlready) throw new ApiException(TeamErrors.ALREADY_TEAM_SIGN);

        if (user.isManager) {
            if (targetTeam.owner !== user.id.toString()) {
                throw new ApiException(TeamErrors.NOT_MY_OWN_TEAM);
            }
        } else {
            const belongsTeam = user.belongingTeams.find(belongTeam => belongTeam.teamId === teamId);
            if (!belongsTeam) throw new ApiException(TeamErrors.NOT_TEAM_CREW);
            if (belongsTeam.authority !== TeamCrewAuthority.WRITE_READ)
                throw new ApiException(TeamErrors.NO_WRITE_PERMISSION);
        }

        await this.teamsRepository.updateOne({ _id: new ObjectID(teamId) }, { $push: { sharedSignIds: signId } });
    }

    async deleteTeamSign(options: { user: User; signId: string; teamId: string }): Promise<void> {
        const { user, signId, teamId } = options;

        if (isEmpty(user)) throw new ApiException(AuthErrors.NOT_LOGGED_IN);

        const targetSign = await this.signsRepository.findOne(signId);
        if (!targetSign) throw new ApiException(SignErrors.NO_SIGN);

        const targetTeam = await this.teamsRepository.findOne(teamId);
        if (!targetTeam) throw new ApiException(TeamErrors.NO_TEAM);

        if (user.isManager) {
            if (targetTeam.owner !== user.id.toString()) {
                throw new ApiException(TeamErrors.NOT_MY_OWN_TEAM);
            }
        } else {
            const belongsTeam = user.belongingTeams.find(belongTeam => belongTeam.teamId === teamId);
            if (!belongsTeam) throw new ApiException(TeamErrors.NOT_TEAM_CREW);
            if (belongsTeam.authority !== TeamCrewAuthority.WRITE_READ)
                throw new ApiException(TeamErrors.NO_WRITE_PERMISSION);
        }

        await this.teamsRepository.updateOne({ _id: new ObjectID(teamId) }, { $pull: { sharedSignIds: signId } });
    }
}
