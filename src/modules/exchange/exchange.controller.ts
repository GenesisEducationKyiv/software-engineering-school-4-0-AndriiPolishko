import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExchangeService } from './exchange.service';

@ApiTags('exchange')
@Controller('exchange')
export class ExchangeController {
  constructor(private service: ExchangeService) {}

  @Get('rate')
  @ApiTags('rate')
  getRate(@Query('currency') currency: string) {
    return this.service.getUsdUahRate(currency);
  }

  @Post("subscribe")
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
