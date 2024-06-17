import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private service: SubscriptionService) {}

  @Post('subscribe')
  async subscribe(@Body() body: { email: string }) {
    const { email } = body;

    return await this.service.subscribe(email);
  }
}
