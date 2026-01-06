import { LawyerRepository } from "../../../infrastructure/repositories/lawyer/LawyerRepository";
import { IApproveLawyerUseCase } from "../../interface/use-cases/admin/IApproveLawyerUseCase";
import { NodeMailerEmailService } from "../../../infrastructure/services/nodeMailer/NodeMailerEmailService";

export class ApproveLawyerUseCase implements IApproveLawyerUseCase {
  constructor(
    private _lawyerRepo: LawyerRepository,
    private _mailService: NodeMailerEmailService
  ) { }

  async execute(id: string, email: string): Promise<void> {
  
    await this._lawyerRepo.approveLawyer(id);

 


    const subject = "✅ Congratulations! Your LegalConnect Profile Has Been Approved";

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f9fafb; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
          
          <div style="background: linear-gradient(to right, #10b981, #047857); padding: 20px 30px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">LegalConnect Approval Notice</h2>
          </div>

          <div style="padding: 30px;">
            <h3 style="color: #065f46; font-size: 20px; margin-bottom: 10px;">Dear Lawyer,</h3>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              We are pleased to inform you that your profile has been <strong style="color:#10b981;">successfully approved</strong> by the LegalConnect administration team.
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              You can now access your dashboard, manage your clients, respond to consultation requests, and start offering your legal expertise on our platform.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://legalconnect.in/login" 
                style="background: linear-gradient(to right, #10b981, #059669); 
                       color: #ffffff; 
                       padding: 12px 28px; 
                       text-decoration: none; 
                       border-radius: 8px; 
                       font-weight: 600;
                       display: inline-block;">
                Go to Dashboard
              </a>
            </div>

            <p style="font-size: 15px; color: #555;">
              If you have any questions or face issues accessing your account, please contact our support team at 
              <a href="mailto:support@legalconnect.in" style="color:#10b981; text-decoration:none;">support@legalconnect.in</a>.
            </p>

            <p style="font-size: 15px; margin-top: 25px;">
              Welcome aboard, and thank you for being a part of the <strong>LegalConnect</strong> professional community!
            </p>

            <p style="font-size: 15px; margin-top: 20px;">Warm regards,<br>
              <strong style="color:#065f46;">LegalConnect Admin Team</strong>
            </p>
          </div>

          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 13px; color: #6b7280;">
            © 2025 LegalConnect. All Rights Reserved.
          </div>

        </div>
      </div>
    `;

    await this._mailService.sendMail(email, subject, htmlContent);
  }
}
