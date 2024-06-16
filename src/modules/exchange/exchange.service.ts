import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron } from '@nestjs/schedule';

import { Subscriber } from "../../db/entities/subscriber.entity";
import { RateResponce } from "./dto/exchange.dto";

interface ExchangeData {
  conversion_rates: {
    USD: number;
    UAH: number;
    }
  }

@Injectable()
export class ExchangeService {
  private exchangeBaseUrl = 'https://v6.exchangerate-api.com/v6/';

  private apiKey = process.env.EXCHANGE_API_KEY;

  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
    private readonly mailService: MailerService,
  ) {}

  /**
   * This functions makes a request to the exchange rate API and returns the current USD to UAH rate.
   * @param currency
   * @returns
   */
  public async getUsdUahRate(currency: string = 'UAH'): Promise<RateResponce> {
    try {
      const res = await axios.get(`${this.exchangeBaseUrl}${this.apiKey}/latest/${currency}`);
      const data: ExchangeData = res.data;

      return {
        conversion_rates: {
          USD: data.conversion_rates.USD,
          UAH: data.conversion_rates.UAH
        }
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(`Error while trying to get the exchange rate of ${currency}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * This function adds a new subscriber to the database.
   * If the subscriber already exists, it throws a 409 error.
   * @param email
   * @returns
   */
  public async subscribe(email: string): Promise<Subscriber> {
    const existingSubscriber = await this.subscriberRepository.findOne({
      where: { email },
    });

    if (existingSubscriber) {
      throw new HttpException('Subscriber already exists', HttpStatus.CONFLICT);
    }

    const subscriber = new Subscriber();

    subscriber.email = email;
    subscriber.dateCreated = new Date();

    return this.subscriberRepository.save(subscriber);
  }

  @Cron('00 00 12 * * *')
  /**
   * This function sends emails to all subscribers every day at 12 am seconds.
   * It also can be called manually by sending a GET request to /exchange/send-emails
   * */
  public async sendEmails() {
    try {
      const { conversion_rates } = await this.getUsdUahRate();
      const usdUahRate = conversion_rates.USD;
      const allSubscribers = await this.subscriberRepository.find();
      allSubscribers.forEach(subscriber => {
        this.mailService.sendMail({
          to: subscriber.email,
          from: 'andrii',
          subject: 'Current USD to UAH rate',
          text: `Hello my dear subscriber!\nYou can buy 1 UAH for ${usdUahRate} USD, or 1 USD for ${1 / usdUahRate} UAH.\nHave a nice day!`,
        });
      });

      return 'Emails sent';
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
