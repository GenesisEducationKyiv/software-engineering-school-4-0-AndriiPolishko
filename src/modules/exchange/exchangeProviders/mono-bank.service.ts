import { BaseExchangeService, MonoBankData } from '../echange.abstract';
import { RateResponce } from '../dto/exchange.dto';

export class MonoBankService extends BaseExchangeService {
  protected requestURL: string = 'https://api.monobank.ua/bank/currency';

  public async getUsdUahRate(): Promise<RateResponce> {
    const data = (await this.getCurrencyData()) as MonoBankData[];
    const usdRate = data.find(rate => rate.currencyCodeA === 840 && rate.currencyCodeB === 980);

    return {
      conversion_rates: {
        USD: usdRate.rateBuy,
      },
    };
  }
}
