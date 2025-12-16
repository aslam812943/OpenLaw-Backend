"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMailerEmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class NodeMailerEmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    async sendMail(to, subject, body) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            html: body
        });
    }
}
exports.NodeMailerEmailService = NodeMailerEmailService;
//# sourceMappingURL=NodeMailerEmailService.js.map