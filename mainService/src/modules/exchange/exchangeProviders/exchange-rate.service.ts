import { BaseExchangeService, ExchangeProvider, ExchangeRateData } from '../echange.base';
import { RateResponse } from '../dto/exchange.dto';

export class ExchangeRateService extends BaseExchangeService {
  private exchangeRateAPIKey = process.env.EXCHANGE_API_KEY;

  constructor(nextExchangeService?: BaseExchangeService, requestURL?: string) {
    super(ExchangeProvider.ExchangeRate, nextExchangeService, requestURL);

    this.requestURL = `https://v6.exchangerate-api.com/v6/${this.exchangeRateAPIKey}/latest/UAH`;
  }

  /**
   * Function to get the current USD to UAH rate
   * @returns
   */
  public async getUsdUahRate(): Promise<RateResponse> {
    const data = (await this.getCurrencyData()) as ExchangeRateData;

    return {
      conversion_rates: {
        USD: data.conversion_rates.USD,
      },
    };
  }
}
