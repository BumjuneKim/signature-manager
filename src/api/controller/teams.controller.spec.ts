import { Test, TestingModule } from "@nestjs/testing";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "../service/teams.service";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Team } from "../entity/team.entity";
import { join } from "path";
import { Sign } from "../entity/sign.entity";
import { ConfigModule } from "@nestjs/config";

describe("Teams Controller", () => {
    let teamsController: TeamsController;
    let teamsService: TeamsService;
    let teamsRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                TypeOrmModule.forRoot({
                    type: "mongodb",
                    url: process.env.DB_CONNECTION_STRING,
                    entities: [join(__dirname, "../**/**.entity{.ts,.js}")],
                    synchronize: true,
                    useNewUrlParser: true,
                    logging: true,
                    useUnifiedTopology: true,
                }),
                TypeOrmModule.forFeature([Team, User, Sign]),
            ],
            controllers: [TeamsController],
            providers: [TeamsService],
        }).compile();

        teamsController = module.get<TeamsController>(TeamsController);
        teamsService = module.get<TeamsService>(TeamsService);
        teamsRepository = module.get(getRepositoryToken(Team));
    });

    describe("start auth api test", () => {
        it("should be defined", () => {
            expect(teamsController).toBeDefined();
        });
    });
});
