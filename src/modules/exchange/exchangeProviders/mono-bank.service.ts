import { BaseExchangeService, MonoBankData } from '../echange.abstract';
import { RateResponce } from '../dto/exchange.dto';

export class MonoBankService extends BaseExchangeService {
  constructor(nextExchangeService?: BaseExchangeService, requestURL?: string) {
    super(nextExchangeService, requestURL);

    this.requestURL = 'https://api.monobank.ua/bank/currency';
  }

  /**
   * Function to get the current USD to UAH rate
   * @returns
   */
  public async getUsdUahRate(): Promise<RateResponce> {
    const data = (await this.getCurrencyData()) as MonoBankData[];
    const usdCurrencyCode = 840;
    const uahCurrencyCode = 980;
    const usdRate = data.find(rate => rate.currencyCodeA === usdCurrencyCode && rate.currencyCodeB === uahCurrencyCode);

    return {
      conversion_rates: {
        USD: usdRate.rateBuy,
      },
    };
  }
}
