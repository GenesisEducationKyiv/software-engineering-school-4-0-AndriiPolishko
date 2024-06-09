import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import axios from "axios";
import { HttpException, HttpStatus } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Cron } from "@nestjs/schedule";

import { Subscriber } from "../../db/entities/subscriber.entity";

@Injectable()
export class ExchangeService {
  private exchangeBaseUrl = "https://v6.exchangerate-api.com/v6/";

  // This key should in the .env file
  private apiKey = "9664c502db83b3fc33518fae";

  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
    private readonly mailService: MailerService,
  ) {}

  /**
   * This functions makes a request to the exchange rate API and returns the current USD to UAH rate.
   * @returns
   */
  public async getUsdUahRate(): Promise<number> {
    try {
      const res = await axios.get(`${this.exchangeBaseUrl}${this.apiKey}/latest/UAH`);

      return res.data.conversion_rates.USD;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException("Subscriber already exists", HttpStatus.CONFLICT);
    }

    const subscriber = new Subscriber();

    subscriber.email = email;
    subscriber.dateCreated = new Date();

    return this.subscriberRepository.save(subscriber);
  }

  // @Cron("00 00 12 * * *")
  @Cron("30 * * * * *")
  /**
   * This function sends emails to all subscribers every day at 12 am seconds.
   * It also can be called manually by sending a GET request to /exchange/send-emails
   * */
  public async sendEmails() {
    try {
      const usdUahRate = await this.getUsdUahRate();
      const allSubscribers = await this.subscriberRepository.find();
      allSubscribers.forEach(subscriber => {
        this.mailService.sendMail({
          to: subscriber.email,
          from: "andrii",
          subject: "Current USD to UAH rate",
          text: `Hello my dear subscriber!\nYou can buy 1 UAH for ${usdUahRate} USD, or 1 USD for ${1 / usdUahRate} UAH.\nHave a nice day!`,
        });
      });

      return "Emails sent";
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
