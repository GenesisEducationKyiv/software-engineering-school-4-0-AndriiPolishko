import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MyMailerController } from './myMailer.controller';
import { MyMailerService } from './myMailer.service';
import { Subscriber } from '../../db/entities/subscriber.entity';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber]), ExchangeModule],
  controllers: [MyMailerController],
  providers: [MyMailerService],
})
export class MyMailerModule {}
