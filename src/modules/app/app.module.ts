import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeModule } from '../exchange/exchange.module';
import { Subscriber } from '../../db/entities/subscriber.entity';
import { MyMailerModule } from '../myMailer/myMailer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'subscribers',
      entities: [Subscriber],
      migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
      migrationsRun: true,
      logging: ['error'],
      synchronize: false,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_APP_PASSWORD,
        },
      },
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ExchangeModule,
    MyMailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
