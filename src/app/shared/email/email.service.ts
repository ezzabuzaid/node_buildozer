import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Constants } from '@core/helpers';
import { AppUtils } from '@core/utils';

export class EmailService {
    public static async sendEmail(message: Mail.Options) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '7d96f20d8d82d5', // generated by Mailtrap
                pass: '0c6a10fb769d24' // generated by Mailtrap
            }
        });
        return transporter.sendMail(message);
    }

    public static sendVerificationEmail(url, userEmail) {
        return EmailService.sendEmail({
            from: 'test@test.com',
            to: userEmail,
            subject: 'Verify Email',
            html: AppUtils.renderHTML('verification-template', { link: `${url}/${Constants.Endpoints.PORTAL}/${Constants.Endpoints.VERIFY_EMAIL}` })
        });
    }
}

export function fakeEmail(token = ''): Mail.Options {
    return {
        from: 'ezzabuzaid@gmail.com',
        to: 'ezzabuzaid@hotmail.com',
        subject: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://website.com/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        text: 'Hello to myself!',
        html: `Password rest successfully`
    };
}
