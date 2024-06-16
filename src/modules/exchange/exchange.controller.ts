import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExchangeService } from './exchange.service';

@ApiTags('exchange')
@Controller('exchange')
export class ExchangeController {
  constructor(private service: ExchangeService) {}

  @Get('rate')
  @ApiTags('rate')
  getRate() {
    return this.service.getUsdUahRate();
  }

  @Post('subscribe')
  @ApiTags('subscription')
  async subscribe(@Body() body: { email: string }) {
    const { email } = body;

    return await this.service.subscribe(email);
  }

  @Get('send-emails')
  @ApiTags('subscription')
  async sendEmails() {
    return await this.service.sendEmails();
  }
}
