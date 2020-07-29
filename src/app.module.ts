import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { PetsController } from "./pets/pets.controller";
import { Pet } from "./pets/pet.entity";
import { User } from "./common/schemas/user.entity";
import { join } from "path";
import { AuthsController } from "./auths/auths.controller";
import { AuthsService } from "./auths/auths.service";
import { LocalStrategy } from "./auths/local.strategy";
import { LocalSerializer } from "./auths/local.serializer";
import { LocalAuthGuard } from "./auths/local.authguard";
import { SignsController } from "./signs/signs.controller";
import { Sign } from "./common/schemas/sign.entity";
import { SignsService } from "./signs/signs.service";
import { TeamsController } from './teams/teams.controller';

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
        PassportModule.register({
            defaultStrategy: "local",
            session: true,
        }),
        TypeOrmModule.forFeature([Pet, User, Sign]),
    ],
    controllers: [PetsController, AuthsController, SignsController, TeamsController],
    providers: [AuthsService, SignsService, LocalStrategy, LocalSerializer, LocalAuthGuard],
})
export class AppModule {}
