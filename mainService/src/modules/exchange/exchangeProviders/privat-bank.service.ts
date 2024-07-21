import { BaseExchangeService, ExchangeProvider, PrivatBankData } from '../echange.base';
import { RateResponse } from '../dto/exchange.dto';

export class PrivatBankService extends BaseExchangeService {
  constructor(nextExchangeService?: BaseExchangeService, requestURL?: string) {
    super(ExchangeProvider.PrivatBank, nextExchangeService, requestURL);

    this.requestURL = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';
  }

  /**
   * Function to get the current USD to UAH rate
   * @returns
   */
  public async getUsdUahRate(): Promise<RateResponse> {
    const data = (await this.getCurrencyData()) as PrivatBankData[];

    return {
      conversion_rates: {
        USD: Number(data[1].buy),
      },
    };
  }
}
