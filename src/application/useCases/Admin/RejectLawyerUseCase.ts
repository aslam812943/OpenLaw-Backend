import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { IRejectLawyerUseCase } from "../../interface/use-cases/admin/IRejectLawyerUseCase";
import { NodeMailerEmailService } from "../../../infrastructure/services/nodeMailer/NodeMailerEmailService";

export class RejectLawyerUseCase implements IRejectLawyerUseCase {
  constructor(
    private _lawyerRepo: ILawyerRepository,
    private _mailService: NodeMailerEmailService
  ) { }

  async execute(id: string, email: string, reason: string): Promise<void> {

    await this._lawyerRepo.rejectLawyer(id);


    await this._mailService.sendMail(
      email,
      "⚠️ Regarding Your Lawyer Verification Status - LegalConnect Platform",
      `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(to right, #dc2626, #b91c1c); padding: 20px 30px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">
                LegalConnect Verification Update
              </h2>
            </div>

            <!-- Body -->
            <div style="padding: 30px;">
              <h3 style="color: #b91c1c; font-size: 20px; margin-bottom: 15px;">Dear Lawyer,</h3>

              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                We hope this message finds you well.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                After carefully reviewing your verification documents and submitted information, 
                we regret to inform you that your <strong>lawyer verification request</strong> on 
                <span style="color:#007bff; font-weight: 600;">LegalConnect</span> has been 
                <strong style="color:#d32f2f;">rejected</strong> at this stage.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                <strong>Reason for Rejection:</strong>
              </p>

              <blockquote style="border-left: 4px solid #d32f2f; padding-left: 10px; color: #555; font-style: italic; margin: 10px 0;">
                ${reason}
              </blockquote>

              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                If you believe this was a misunderstanding or wish to reapply, 
                please ensure all required documents are clear, valid, and up-to-date before resubmission.
              </p>

              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                We appreciate your interest in joining the LegalConnect platform and encourage you 
                to apply again after making the necessary corrections.
              </p>

              <br/>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">Best regards,</p>
              <p style="font-weight: 600; color: #b91c1c;">The LegalConnect Team</p>

              <p style="font-size: 12px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                This is an automated email. Please do not reply.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 13px; color: #6b7280;">
              © 2025 LegalConnect. All Rights Reserved.
            </div>
          </div>
        </div>
      `
    );
  }
}
