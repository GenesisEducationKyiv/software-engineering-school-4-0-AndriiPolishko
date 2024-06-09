import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import 

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ExchangeModule } from "../exchange/exchange.module";
import { Subscriber } from "../../db/entities/subscriber.entity";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: 'mysqlContainer', // "127.0.0.1",
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
    ExchangeModule,
    MailerModule.forRoot({
      transport: {
        // TODO move to env
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // This fields should be moved to env
          // But for this project I will leave them here for now.
          user: "projecttempemail1@gmail.com",
          pass: "ufjx vjfs fmjx tabf",
        },
      },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
