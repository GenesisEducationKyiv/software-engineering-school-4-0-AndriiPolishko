import { Injectable } from '@nestjs/common';

import { ExchangeRateService } from './exchangeProviders/exchange-rate.service';
import { PrivatBankService } from './exchangeProviders/privat-bank.service';
import { MonoBankService } from './exchangeProviders/mono-bank.service';

@Injectable()
export class ExchangeService {
  constructor() {}

  public async getUsdUahRate(): Promise<any> {
    const privatBankService = new PrivatBankService();
    const monoBankService = new MonoBankService(privatBankService);
    const exchangeRateService = new ExchangeRateService(monoBankService);

    // First try to get from exchageRate then monobank then privatbank
    return exchangeRateService.getUsdUahRate();
  }
}
