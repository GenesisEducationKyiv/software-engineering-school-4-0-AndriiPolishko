import { Module } from '@nestjs/common';

import { MyMailerController } from './myMailer.controller';
import { MyMailerService } from './myMailer.service';
import { ExchangeModule } from '../exchange/exchange.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [SubscriptionModule, ExchangeModule],
  controllers: [MyMailerController],
  providers: [MyMailerService],
})
export class MyMailerModule {}
