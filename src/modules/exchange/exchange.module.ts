import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { Subscriber } from '../../db/entities/subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  controllers: [ExchangeController],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
