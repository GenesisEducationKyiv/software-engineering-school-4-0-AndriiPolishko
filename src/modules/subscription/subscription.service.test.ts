import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { Repository } from 'typeorm';
import { Subscriber } from '../../db/entities/subscriber.entity';
import { SubscriptionService } from './subscription.service';
import { TypeORMMySqlTestingModule } from '../../db/testing/test-data-source';

jest.mock('axios');

describe('ExchangeService', () => {
  let subscriberRepository: Repository<Subscriber>;
  let service: SubscriptionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Subscriber),
          useClass: Repository,
        },
        SubscriptionService,
      ],
      imports: [TypeORMMySqlTestingModule([Subscriber])],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    subscriberRepository = module.get<Repository<Subscriber>>(getRepositoryToken(Subscriber));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a new subscriber', async () => {
    const email = 'test@example.com';
    jest.spyOn(subscriberRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(subscriberRepository, 'save').mockResolvedValue({ email } as Subscriber);

    const subscriber = await service.subscribe(email);
    expect(subscriber.email).toEqual(email);
  });

  it('should throw an error if the subscriber already exists', async () => {
    const email = 'test@example.com';
    jest.spyOn(subscriberRepository, 'findOne').mockResolvedValue({ email } as Subscriber);

    await expect(service.subscribe(email)).rejects.toThrow(HttpException);
  });
});
