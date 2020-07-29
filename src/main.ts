import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
import { userParse } from "./common/middleware/userParse";

const port = process.env.PORT || 7000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.use(session({ secret: "modu-sign", resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(userParse);

    await app.listen(port);
    Logger.log(`Server running on http://localhost:${port}`, "kbj");
}
bootstrap();
