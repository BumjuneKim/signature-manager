import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { PetsController } from "./pets/pets.controller";
import { Pet } from "./pets/pet.entity";
import { User } from "./auths/user.entity";
import { join } from "path";
import { AuthsController } from "./auths/auths.controller";
import { AuthsService } from "./auths/auths.service";

@Module({
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
        TypeOrmModule.forFeature([Pet, User]),
    ],
    controllers: [PetsController, AuthsController],
    providers: [AuthsService],
})
export class AppModule {}
