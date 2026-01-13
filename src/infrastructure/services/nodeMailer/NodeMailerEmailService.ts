import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import { IEmailService } from '../../../application/interface/services/IEmailService';

dotenv.config();

export class NodeMailerEmailService implements IEmailService {
    private transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }


    async sendMail(to: string, subject: string, body: string): Promise<void> {

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            html: body
        })
    }
}