import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';

import { ExchangeService } from '../exchange/exchange.service';
import { Subscriber } from '../../db/entities/subscriber.entity';

@Injectable()
export class MyMailerService {
  constructor(
    private exchangeService: ExchangeService,
    @InjectRepository(Subscriber) private subscriberRepository: Repository<Subscriber>,
    private mailService: MailerService,
  ) {}

  @Cron('00 00 12 * * *')
  /**
   * This function sends emails to all subscribers every day at 12 am seconds.
   * It also can be called manually by sending a GET request to /exchange/send-emails
   * */
  public async sendEmails() {
    try {
      const { conversion_rates } = await this.exchangeService.getUsdUahRate();
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
