import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';

import { ExchangeService } from '../exchange/exchange.service';
import { Subscriber } from '../../db/entities/subscriber.entity';
import { RateResponse } from '../exchange/dto/exchange.dto';
import { MyMailerService } from './myMailer.service';
import { SubscriptionService } from '../subscription/subscription.service';

describe('MailerService', () => {
  let exchangeService: ExchangeService;
  let subscriptionService: SubscriptionService;
  let service: MyMailerService;
  let mailService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        {
          provide: getRepositoryToken(Subscriber),
          useClass: Repository,
        },
        SubscriptionService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        MyMailerService,
      ],
    }).compile();

    service = module.get<MyMailerService>(MyMailerService);
    exchangeService = module.get<ExchangeService>(ExchangeService);
    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
    mailService = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send emails to all subscribers', async () => {
    const subscribers = [{ email: 'test@example.com' }] as Subscriber[];
    const exchangeRes = { conversion_rates: { USD: 28 } } as RateResponse;
    const usdUahRate = exchangeRes.conversion_rates.USD;

    jest.spyOn(exchangeService, 'getUsdUahRate').mockResolvedValue(exchangeRes);
    jest.spyOn(subscriptionService, 'getAllSubscribers').mockResolvedValue(subscribers);

    const { message } = await service.sendEmails();
    expect(message).toEqual('Emails sent');
    expect(mailService.sendMail).toHaveBeenCalledWith({
      to: 'test@example.com',
      from: 'Andrii',
      subject: 'Current USD to UAH rate',
      text: `Hello my dear subscriber!\nYou can buy 1 UAH for ${1 / usdUahRate} USD, or 1 USD for ${usdUahRate} UAH.\nHave a nice day!`,
    });
  });

  it('should throw an error if getting the rate fails', async () => {
    jest.spyOn(exchangeService, 'getUsdUahRate').mockRejectedValue(new Error('API error'));

    const { message } = await service.sendEmails();

    await expect(message).toEqual('Internal error while trying to send emails');
  });
});
