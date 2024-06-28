import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

import { RateResponce } from './dto/exchange.dto';

export enum Provider {
  ExchangeRate = 'ExchangeRate',
  PrivatBank = 'PrivatBank',
  MonoBank = 'MonoBank',
}

export interface ExchangeRateData {
  conversion_rates: {
    USD: number;
  };
}

export interface PrivatBankData {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

export interface MonoBankData {
  currencyCodeA: number;
  currencyCodeB: number;
  rateBuy: number;
  rateSell: number;
}

type CurrencyData = ExchangeRateData | PrivatBankData[] | MonoBankData[];

export abstract class BaseExchangeService {
  private nextExchangeService: BaseExchangeService;

  protected requestURL: string;

  private currentProvider: Provider;

  constructor(nextExchangeService?: BaseExchangeService, requestURL?: string) {
    this.requestURL = requestURL;
    this.nextExchangeService = nextExchangeService;
  }

  /**
   * This functions makes a request to the exchange rate API and returns the current USD to UAH rate.
   * @param currency
   * @param requestURL
   * @returns
   */
  public async getCurrencyData(): Promise<CurrencyData> {
    try {
      const res = await axios.get(this.requestURL);
      const data: CurrencyData = res.data;

      return data;
    } catch (error) {
      console.error(`Error while making exchange request to ${this.currentProvider} provider`, error);

      if (this.nextExchangeService) return this.nextExchangeService.getUsdUahRate();

      console.error(`Failed to get exchnage data from all providers. Last provider: ${this.currentProvider}`);

      // If we failed to get the data from all providers, we throw an error
      throw new HttpException(`Sorry, no available currency exchange providers at the momment.`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public abstract getUsdUahRate(): Promise<RateResponce>;

  /**
   * Function to set the request query
   * @param requestURL
   */
  public setRequestURL(requestURL: string) {
    this.requestURL = requestURL;
  }

  /**
   * Function to choose provider to be next for the request down the chain
   * @param exhangeService
   */
  public setNext(exhangeService: BaseExchangeService) {
    this.nextExchangeService = exhangeService;
  }
}
