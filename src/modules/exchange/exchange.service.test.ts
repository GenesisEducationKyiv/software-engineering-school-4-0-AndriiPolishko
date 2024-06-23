import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import axios from 'axios';

import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { ExchangeService } from './exchange.service';
import { Subscriber } from '../../db/entities/subscriber.entity';
import { SubscriptionService } from '../subscription/subscription.service';

jest.mock('axios');

describe('ExchangeService', () => {
  let service: ExchangeService;
  let subscriberRepository: Repository<Subscriber>;
  let subscriptionService: SubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        SubscriptionService,
        {
          provide: getRepositoryToken(Subscriber),
          useClass: Repository,
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
    subscriberRepository = module.get<Repository<Subscriber>>(getRepositoryToken(Subscriber));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the current USD to UAH rate', async () => {
    const response = { data: { conversion_rates: { USD: 28 } } };

    (axios.get as jest.Mock).mockResolvedValue(response);

    const exchangeRes = await service.getUsdUahRate();
    const usdRate = exchangeRes.conversion_rates.USD;

    expect(usdRate).toEqual(28);
  });

  it('should throw an error if the API request fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

    await expect(service.getUsdUahRate()).rejects.toThrow(HttpException);
  });

  describe('subscribe', () => {
    it('should add a new subscriber', async () => {
      const email = 'test@example.com';
      jest.spyOn(subscriberRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(subscriberRepository, 'save').mockResolvedValue({ email } as Subscriber);

      const subscriber = await subscriptionService.subscribe(email);
      expect(subscriber.email).toEqual(email);
    });

    it('should throw an error if the subscriber already exists', async () => {
      const email = 'test@example.com';
      jest.spyOn(subscriberRepository, 'findOne').mockResolvedValue({ email } as Subscriber);

      await expect(subscriptionService.subscribe(email)).rejects.toThrow(HttpException);
    });
  });
});
