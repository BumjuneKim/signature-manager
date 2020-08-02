import { Test, TestingModule } from "@nestjs/testing";
import { SignsController } from "./signs.controller";
import { SignsService } from "../service/signs.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sign } from "../entity/sign.entity";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";

describe("Signs Controller", () => {
    let controller: SignsController;

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
                TypeOrmModule.forFeature([Sign]),
            ],
            controllers: [SignsController],
            providers: [SignsService],
        }).compile();

        controller = module.get<SignsController>(SignsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
