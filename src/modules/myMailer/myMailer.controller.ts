import { Controller, Get } from '@nestjs/common';
import { MyMailerService } from './myMailer.service';

@Controller('mail')
export class MyMailerController {
  constructor(private service: MyMailerService) {}

  @Get('send-emails')
  async sendEmails() {
    return await this.service.sendEmails();
  }
}
