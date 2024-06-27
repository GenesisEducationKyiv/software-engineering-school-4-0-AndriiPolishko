import { BaseExchangeService, ExchangeRateData } from '../echange.abstract';
import { RateResponce } from '../dto/exchange.dto';

export class ExchangeRateService extends BaseExchangeService {
  private exchangeRateAPIKey = process.env.EXCHANGE_API_KEY;

  requestURL = `https://v6.exchangerate-api.com/v6/${this.exchangeRateAPIKey}/latest/UAH`;

  public async getUsdUahRate(): Promise<RateResponce> {
    const data = (await this.getCurrencyData()) as ExchangeRateData;

    return {
      conversion_rates: {
        USD: data.conversion_rates.USD,
      },
    };
  }
}
