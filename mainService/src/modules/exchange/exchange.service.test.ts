import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { MailerService } from '@nestjs-modules/mailer';

import { ExchangeService } from './exchange.service';
import { ExchangeRateService } from './exchangeProviders/exchange-rate.service';
import { MonoBankService } from './exchangeProviders/mono-bank.service';
import { PrivatBankService } from './exchangeProviders/privat-bank.service';

jest.mock('axios');

describe('ExchangeService', () => {
  let service: ExchangeService;
  let exchangeRateService: ExchangeRateService;
  let monoBankService: MonoBankService;
  let privatBankService: PrivatBankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        ExchangeRateService,
        MonoBankService,
        PrivatBankService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    exchangeRateService = module.get<ExchangeRateService>(ExchangeRateService);
    monoBankService = module.get<MonoBankService>(MonoBankService);
    privatBankService = module.get<PrivatBankService>(PrivatBankService);
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

  it('Exchange Rate. Should correctly extract USD price', async () => {
    jest.spyOn(exchangeRateService, 'getCurrencyData').mockResolvedValue({ conversion_rates: { USD: 28 } });

    const rate = await exchangeRateService.getUsdUahRate();

    expect(rate.conversion_rates.USD).toEqual(28);
  });

  it('Mono Bank. Should correctly extract USD price', async () => {
    jest.spyOn(monoBankService, 'getCurrencyData').mockResolvedValue([{ currencyCodeA: 840, currencyCodeB: 980, rateBuy: 28, rateSell: 28.5 }]);

    const rate = await monoBankService.getUsdUahRate();

    expect(rate.conversion_rates.USD).toEqual(28);
  });

  it('Privat Bank. Should correctly extract USD price', async () => {
    jest.spyOn(privatBankService, 'getCurrencyData').mockResolvedValue([
      { ccy: 'EUR', base_ccy: 'UAH', buy: '43', sale: '44' },
      { ccy: 'USD', base_ccy: 'UAH', buy: '28', sale: '28.5' },
    ]);

    const rate = await privatBankService.getUsdUahRate();

    expect(rate.conversion_rates.USD).toEqual(28);
  });
});
