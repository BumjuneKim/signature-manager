import { Test, TestingModule } from "@nestjs/testing";
import { AuthsController } from "./auths.controller";
import { AuthsService } from "../service/auths.service";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { UserDto } from "../dto/request/user-dto";
import { Repository } from "typeorm";

export type MockType<T> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [P in keyof T]: jest.Mock<{}>;
};

export const repositoryMockFactory: jest.Mock<{ findOne: jest.Mock<any, [undefined]> }, any[]> = jest.fn(() => ({
    findOne: jest.fn(entity => entity),
}));

describe("Auths Controller", () => {
    let authsController: AuthsController;
    let authsService: AuthsService;
    // let usersRepository: Repository<User>;
    let usersRepository: MockType<Repository<User>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                TypeOrmModule.forRoot({
                    type: "mongodb",
                    keepConnectionAlive: true,
                    url: process.env.DB_CONNECTION_STRING,
                    entities: [join(__dirname, "../**/**.entity{.ts,.js}")],
                    synchronize: true,
                    useNewUrlParser: true,
                    logging: true,
                    useUnifiedTopology: true,
                }),
                TypeOrmModule.forFeature([User]),
            ],
            controllers: [AuthsController],
            providers: [
                AuthsService,
                { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
                // {
                //     provide: getRepositoryToken(User),
                //     useClass: Repository,
                // },
            ],
        }).compile();

        authsController = module.get<AuthsController>(AuthsController);
        authsService = module.get<AuthsService>(AuthsService);
        usersRepository = module.get(getRepositoryToken(User));
    });

    describe("start auth api test", () => {
        it("should be defined", () => {
            expect(authsController).toBeDefined();
            expect(authsService).toBeDefined();
            expect(usersRepository).toBeDefined();
        });

        it("sign up", async () => {
            const testUserDto = <UserDto>{
                email: "test@modusign.co.kr",
                name: "test",
                isManager: true,
                password: "1234",
            };

            const user: User = new User();

            // jest.spyOn(authsService, "doSignUp").mockImplementation(() => null);
            // jest.spyOn(usersRepository, "findOne").mockResolvedValueOnce(user);
            // jest.spyOn(usersRepository, "save").mockImplementation(() => testUserDto);
            // console.log(usersRepository);

            try {
                // console.log(testUserDto);
                const bb = await authsService.doSignUp(testUserDto);
                console.log("bb");
                console.log(bb);
            } catch (e) {
                console.log(e);
            }
            // const user = await authsController.signUp(testUserDto);
            // console.log("user", user);
            // jest.spyOn(authsController, "signUp");
        });
    });
});
