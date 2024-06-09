import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ExchangeModule } from "../exchange/exchange.module";
import { Subscriber } from "../../db/entities/subscriber.entity";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "mysqlContainer", // "127.0.0.1", 'mysqlContainer',
      port: 3306,
      username: "root",
      password: "root",
      database: "subscribers",
      entities: [Subscriber],
      migrations: [__dirname + "/../db/migrations/*{.ts,.js}"],
      migrationsRun: true,
      logging: ["error"],
      synchronize: false,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ExchangeModule,
    MailerModule.forRoot({
      transport: {
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
