import { Test, TestingModule } from "@nestjs/testing";
import { PetsController } from "./pets.controller";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { Pet } from "./pet.entity";

describe("Pets Controller", () => {
    let controller: PetsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PetsController],
            imports: [
                ConfigModule.forRoot(),
                TypeOrmModule.forRoot({
                    type: "mongodb",
                    url: process.env.DB_CONNECTION_STRING,
                    entities: [join(__dirname, "**/**.entity{.ts,.js}")],
                    synchronize: true,
                    useNewUrlParser: true,
                    logging: true,
                    useUnifiedTopology: true,
                }),
                TypeOrmModule.forFeature([Pet]),
            ],
        }).compile();

        controller = module.get<PetsController>(PetsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
