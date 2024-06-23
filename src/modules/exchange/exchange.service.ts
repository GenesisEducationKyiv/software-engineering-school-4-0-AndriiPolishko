import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

import { Subscriber } from '../../db/entities/subscriber.entity';
import { RateResponce } from './dto/exchange.dto';

interface ExchangeData {
  conversion_rates: {
    USD: number;
    UAH: number;
  };
}

@Injectable()
export class ExchangeService {
  private exchangeBaseUrl = 'https://v6.exchangerate-api.com/v6/';
  private privatApi = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';

  private apiKey = process.env.EXCHANGE_API_KEY;

  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
  ) {}

  /**
   * This functions makes a request to the exchange rate API and returns the current USD to UAH rate.
   * @param currency
   * @returns
   */
  public async getUsdUahRate(currency: string = 'UAH'): Promise<RateResponce> {
    try {
      const res = await axios.get(`${this.exchangeBaseUrl}${this.apiKey}/latest/${currency}`);
      const privatRes = await axios.get(this.privatApi);
      const data: ExchangeData = res.data || privatRes.data[0];

      return {
        conversion_rates: {
          USD: data.conversion_rates.USD,
          UAH: data.conversion_rates.UAH,
        },
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(`Error while trying to get the exchange rate of ${currency}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
