import { Injectable } from '@nestjs/common';

import { BaseExchangeService } from './echange.abstract';

@Injectable()
export class ExchangeService {
  private exchangeRateAPIKey = process.env.EXCHANGE_API_KEY;

  private exchangeRateURL = `https://v6.exchangerate-api.com/v6/${this.exchangeRateAPIKey}/latest/UAHH`; // TODO: fix intenional typo

  private privatURL = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';

  private monobankURL = 'https://api.monobank.ua/bank/currency';

  constructor() {}

  public async getUsdUahRate(): Promise<any> {
    const exchangeRateService = new ExchangeRateService(this.exchangeRateURL);
    const privatBankService = new PrivatBankService(this.privatURL);
    const monoBankService = new MonoBankService(this.monobankURL);

    exchangeRateService.next(privatBankService);
    privatBankService.next(monoBankService);
    //monoBankService.next(exchangeRateService);

    return exchangeRateService.getUsdUahRate();
  }
}

class ExchangeRateService extends BaseExchangeService {
  public async getUsdUahRate() {
    const data = await this.getCurrencyData();

    return {
      conversion_rates: {
        USD: data.conversion_rates.USD,
      },
    };
  }
}

class PrivatBankService extends BaseExchangeService {
  public async getUsdUahRate() {
    const data = await this.getCurrencyData();

    return {
      conversion_rates: {
        USD: data[1].buy,
      },
    };
  }
}

class MonoBankService extends BaseExchangeService {
  public async getUsdUahRate() {
    const data = await this.getCurrencyData();

    const usdRate = data.find(rate => rate.currencyCodeA === 840 && rate.currencyCodeB === 980);

    return {
      conversion_rates: {
        USD: usdRate.rateBuy,
      },
    };
  }
}
