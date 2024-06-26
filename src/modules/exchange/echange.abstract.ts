import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

export enum Provider {
  ExchangeRate,
  PrivatBank,
  MonoBank,
}

export abstract class BaseExchangeService {
  private nextExchangeService: BaseExchangeService;

  private requestQuery: string;

  private provider: Provider;

  constructor(requestQuery: string) {
    this.requestQuery = requestQuery;
  }

  /**
   * This functions makes a request to the exchange rate API and returns the current USD to UAH rate.
   * @param currency
   * @param requestQuery
   * @returns
   */
  public async getCurrencyData(): Promise<any> {
    // FIXME: fix any
    try {
      const res = await axios.get(this.requestQuery);
      // TODO: add type conversion
      const data = res.data;

      return data;
    } catch (error) {
      console.log(error);

      if (this.nextExchangeService) return this.nextExchangeService.getUsdUahRate();

      throw new HttpException(`Sorry, no available currency exchange providers at the momment.`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public abstract getUsdUahRate(): any; // FIXME: fix any

  /**
   * Function to set the request query
   * @param requestQuery
   */
  public setRequestURL(requestQuery: string) {
    this.requestQuery = requestQuery;
  }

  /**
   * Function to pass the request down the chain
   * @param exhangeService
   */
  public next(exhangeService: BaseExchangeService) {
    this.nextExchangeService = exhangeService;
  }
}
