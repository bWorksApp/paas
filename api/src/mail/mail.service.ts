import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  //register new account
  async send(user: any, token: string) {
    const verifyUrl = process.env.MAIL_VERIFICATION_URL;
    const url = `${verifyUrl}${token}`;

    if (!user.email || !user.username || !url) return;
    let result;
    try {
      result = await this.mailerService.sendMail({
        to: user.email,
        subject: '[PAAS] Welcome to PAAS! Please confirm your Email',
        template: './confirm',
        context: {
          name: user.username,
          url,
        },
      });
    } catch (e) {
      console.log(
        `user register: mail service error: ${user.username}, ${url}`,
      );
    }

    return result;
  }

  //reset user password
  async resetPassword(user: any, token: string) {
    const verifyUrl = process.env.MAIL_RESET_PASSWORD_URL;
    const url = encodeURI(`${verifyUrl}${token}`);

    if (!user.email || !user.username || !url) return;

    try {
      return await this.mailerService.sendMail({
        to: user.email,
        subject: '[PAAS] You requested reset password',
        template: './reset',
        context: {
          name: user.username,
          url,
        },
      });
    } catch (e) {
      console.log(
        `user register: mail service error: ${user.username}, ${url}`,
      );
    }
  }
}
