import { Controller, Get } from '@nestjs/common';
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
}
