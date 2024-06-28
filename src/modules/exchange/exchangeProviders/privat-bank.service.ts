import { BaseExchangeService, PrivatBankData } from '../echange.abstract';
import { RateResponce } from '../dto/exchange.dto';

export class PrivatBankService extends BaseExchangeService {
  constructor(nextExchangeService?: BaseExchangeService, requestURL?: string) {
    super(nextExchangeService, requestURL);

    this.requestURL = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';
  }

  /**
   * Function to get the current USD to UAH rate
   * @returns
   */
  public async getUsdUahRate(): Promise<RateResponce> {
    const data = (await this.getCurrencyData()) as PrivatBankData[];

    return {
      conversion_rates: {
        USD: Number(data[1].buy),
      },
    };
  }
}
