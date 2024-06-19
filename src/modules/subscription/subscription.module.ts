import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscriber } from '../../db/entities/subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class MyMailerModule {}
