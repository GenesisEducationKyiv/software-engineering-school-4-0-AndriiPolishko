import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';

import { ExchangeService } from '../exchange/exchange.service';
import { EmailSendResponse } from './dto/myMailer.dto';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class MyMailerService {
  constructor(
    private exchangeService: ExchangeService,
    @Inject(SubscriptionService) private subscriptionService: SubscriptionService,
    private mailService: MailerService,
  ) {}

  @Cron('00 00 12 * * *')
  /**
   * This function sends emails to all subscribers every day at 12 am seconds.
   * It also can be called manually by sending a GET request to /exchange/send-emails
   * */
  public async sendEmails(): Promise<EmailSendResponse> {
    try {
      const { conversion_rates } = await this.exchangeService.getUsdUahRate();
      const usdUahRate = conversion_rates.USD;
      const allSubscribers = await this.subscriptionService.getAllSubscribers();
      allSubscribers.forEach(subscriber => {
        this.mailService.sendMail({
          to: subscriber.email,
          from: 'Andrii',
          subject: 'Current USD to UAH rate',
          text: this.generateText(usdUahRate),
        });
      });

      return { message: 'Emails sent' };
    } catch (error) {
      console.log(error);

      return { message: 'Internal error while trying to send emails', error };
    }
  }

  private generateText(usdUahRate: number): string {
    return `Hello my dear subscriber!\nYou can buy 1 UAH for ${1 / usdUahRate} USD, or 1 USD for ${usdUahRate} UAH.\nHave a nice day!`;
  }
}
