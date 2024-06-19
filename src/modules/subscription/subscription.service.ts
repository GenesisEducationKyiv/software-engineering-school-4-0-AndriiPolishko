import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { Subscriber } from '../../db/entities/subscriber.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
  ) {}

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
}
