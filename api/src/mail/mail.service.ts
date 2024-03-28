import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PlutusTxDocument } from '../plutustx/schemas/schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  /*
mail notify send to user for cases:
- submit new acc
- job got a application
- job application got message
- job application is selected
- job application is paid to bWorks smart contract
- job application is paid to job seeker wallet or refund to employer wallet
*/

  //register new account
  async send(user: any, token: string) {
    const verifyUrl = process.env.MAIL_VERIFICATION_URL;
    const url = `${verifyUrl}${token}`;

    if (!user.email || !user.username || !url) return;
    let result;
    try {
      result = await this.mailerService.sendMail({
        to: user.email,
        subject: '[bWorks] Welcome to bWorks! Please confirm your Email',
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
        subject: '[bWorks] You requested reset password',
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

  //notify to job seeker and employer when payment is lock or unlock
  async paymentUpdate(
    plutusTx: any,
    jobSeeker: any,
    employer: any,
    isLocked: boolean, //true for lock, false for unlock
  ) {
    if (!employer.email || !jobSeeker.email || !plutusTx.jobBidId) return;

    const explorerUrl = process.env.CARDANO_EXPLORER_URL;
    const url = isLocked
      ? `${explorerUrl}${plutusTx.lockedTxHash}`
      : `${explorerUrl}${plutusTx.unlockedTxHash}`;
    const paymentMessage = isLocked
      ? 'Please track the lock transaction with below TxHash:'
      : 'Please track the unlock transaction with below TxHash:';

    const subject = isLocked
      ? 'payment is locked to bWorks smart contract'
      : 'payment is unlocked from bWorks smart contract';

    //if isLocked notify to job seeker, if unlocked notify to job seeker and employer
    let result;
    if (isLocked && jobSeeker.isNotified) {
      try {
        result = await this.mailerService.sendMail({
          to: jobSeeker.email,
          subject: `[bWorks] The application ${plutusTx.jobBidName} ${subject}`,
          template: './payment',
          context: {
            name: jobSeeker.username,
            jobBidName: plutusTx.jobBidName,
            paymentMessage,
            url,
          },
        });
      } catch (e) {
        console.log(
          `payment lock: mail service error: ${jobSeeker.username}, ${employer.username}`,
        );
      }
    }
    if (!isLocked) {
      try {
        result = Promise.all([
          employer.isNotified &&
            (await this.mailerService.sendMail({
              to: employer.email,
              subject: `[bWorks] The application ${plutusTx.jobBidName} ${subject}`,
              template: './payment',
              context: {
                name: employer.username,
                jobBidName: plutusTx.jobBidName,
                paymentMessage,
                url,
              },
            })),
          jobSeeker.isNotified &&
            (await this.mailerService.sendMail({
              to: jobSeeker.email,
              subject: `[bWorks] The application ${plutusTx.jobBidName} ${subject}`,
              template: './payment',
              context: {
                name: jobSeeker.username,
                jobBidName: plutusTx.jobBidName,
                paymentMessage,
                url,
              },
            })),
        ]);
      } catch (e) {
        console.log(
          `payment lock: mail service error: ${jobSeeker.username}, ${employer.username}`,
        );
      }
    }

    return result;
  }
}
