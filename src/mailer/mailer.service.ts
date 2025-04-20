import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private isReady = false;
  private logger = new Logger(MailerService.name);

  constructor() {
    this.setup(); // Async init
  }

  async setup() {
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    this.isReady = true;
    this.logger.log('📧 Ethereal SMTP configured');
    this.logger.log(`Login: ${testAccount.user}`);
    this.logger.log(`Preview password: ${testAccount.pass}`);
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    if (!this.isReady) {
      this.logger.warn('⏳ Mailer not ready yet. Waiting...');
      await new Promise((res) => setTimeout(res, 2000)); // wait 2 sec
    }

    const info = await this.transporter.sendMail({
      from: '"iTicket" <no-reply@iticket.az>',
      to,
      subject,
      text,
      html,
    });

    this.logger.log(`✅ Email sent: ${info.messageId}`);
    this.logger.log(`🔗 Preview: ${nodemailer.getTestMessageUrl(info)}`);
  }
}
