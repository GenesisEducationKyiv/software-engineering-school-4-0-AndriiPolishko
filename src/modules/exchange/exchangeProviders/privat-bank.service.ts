import { BaseExchangeService, PrivatBankData } from '../echange.abstract';
import { RateResponce } from '../dto/exchange.dto';

export class PrivatBankService extends BaseExchangeService {
  protected requestURL: string = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';

  public async getUsdUahRate(): Promise<RateResponce> {
    const data = (await this.getCurrencyData()) as PrivatBankData[];

    return {
      conversion_rates: {
        USD: Number(data[1].buy),
      },
    };
  }
}
