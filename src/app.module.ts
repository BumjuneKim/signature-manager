import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { User } from "./api/entity/user.entity";
import { join } from "path";
import { AuthsController } from "./api/controller/auths.controller";
import { AuthsService } from "./api/service/auths.service";
import { LocalStrategy } from "./api/auth/local.strategy";
import { LocalSerializer } from "./api/auth/local.serializer";
import { LocalAuthGuard } from "./api/auth/local.authguard";
import { SignsController } from "./api/controller/signs.controller";
import { Sign } from "./api/entity/sign.entity";
import { SignsService } from "./api/service/signs.service";
import { TeamsController } from "./api/controller/teams.controller";
import { TeamsService } from "./api/service/teams.service";
import { Team } from "./api/entity/team.entity";

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
        TypeOrmModule.forFeature([User, Sign, Team]),
    ],
    controllers: [AuthsController, SignsController, TeamsController],
    providers: [AuthsService, SignsService, TeamsService, LocalStrategy, LocalSerializer, LocalAuthGuard],
})
export class AppModule {}
