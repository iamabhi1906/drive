import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationOtp(email: string, otp: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `Here is you otp to verify..!! <h1>${otp}</h1>`,
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome!',
      html: `Hey welcome ${name}, \n Enjoy..!!`,
    });
  }
}
