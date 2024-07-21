import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeModule } from '../exchange/exchange.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { Subscriber } from '../../db/entities/subscriber.entity';
import { MyMailerModule } from '../myMailer/myMailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [Subscriber],
      migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
      migrationsRun: true,
      logging: ['error'],
      synchronize: false,
    }),
    MailerModule.forRoot({
      transport: {
        service: process.env.MAILER_SERVICE,
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT ? parseInt(process.env.MAILER_PORT) : 465,
        secure: true,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_APP_PASSWORD,
        },
      },
    }),
    ScheduleModule.forRoot(),
    ExchangeModule,
    MyMailerModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
