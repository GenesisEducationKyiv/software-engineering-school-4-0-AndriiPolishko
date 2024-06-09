import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HttpException } from "@nestjs/common";
import axios from "axios";
import { MailerService } from "@nestjs-modules/mailer";
import { Repository } from "typeorm";
import { ExchangeService } from "./exchange.service";
import { Subscriber } from "../../db/entities/subscriber.entity";

jest.mock("axios");

describe("ExchangeService", () => {
  let service: ExchangeService;
  let subscriberRepository: Repository<Subscriber>;
  let mailService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
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
    subscriberRepository = module.get<Repository<Subscriber>>(getRepositoryToken(Subscriber));
    mailService = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsdUahRate", () => {
    it("should return the current USD to UAH rate", async () => {
      const response = { data: { conversion_rates: { USD: 28 } } };
      (axios.get as jest.Mock).mockResolvedValue(response);

      const rate = await service.getUsdUahRate();
      expect(rate).toEqual(28);
    });

    it("should throw an error if the API request fails", async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error("API error"));

      await expect(service.getUsdUahRate()).rejects.toThrow(HttpException);
    });
  });

  describe("subscribe", () => {
    it("should add a new subscriber", async () => {
      const email = "test@example.com";
      jest.spyOn(subscriberRepository, "findOne").mockResolvedValue(null);
      jest.spyOn(subscriberRepository, "save").mockResolvedValue({ email } as Subscriber);

      const subscriber = await service.subscribe(email);
      expect(subscriber.email).toEqual(email);
    });

    it("should throw an error if the subscriber already exists", async () => {
      const email = "test@example.com";
      jest.spyOn(subscriberRepository, "findOne").mockResolvedValue({ email } as Subscriber);

      await expect(service.subscribe(email)).rejects.toThrow(HttpException);
    });
  });

  describe("sendEmails", () => {
    it("should send emails to all subscribers", async () => {
      const subscribers = [{ email: "test@example.com" }] as Subscriber[];
      const usdUahRate = 28;

      jest.spyOn(service, "getUsdUahRate").mockResolvedValue(usdUahRate);
      jest.spyOn(subscriberRepository, "find").mockResolvedValue(subscribers);

      const result = await service.sendEmails();
      expect(result).toEqual("Emails sent");
      expect(mailService.sendMail).toHaveBeenCalledWith({
        to: "test@example.com",
        from: "andrii",
        subject: "Current USD to UAH rate",
        text: `Hello my dear subscriber!\nYou can buy 1 UAH for ${usdUahRate} USD, or 1 USD for ${1 / usdUahRate} UAH.\nHave a nice day!`,
      });
    });

    it("should throw an error if getting the rate fails", async () => {
      jest.spyOn(service, "getUsdUahRate").mockRejectedValue(new Error("API error"));

      await expect(service.sendEmails()).rejects.toThrow(HttpException);
    });
  });
});
