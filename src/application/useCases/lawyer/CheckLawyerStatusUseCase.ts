import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class CheckLawyerStatusUseCase {
    constructor(private _lawyerRepository : ILawyerRepository) { }

    async check(lawyerId: string): Promise<{ isActive: boolean }> {

        if (!lawyerId) {
            throw new BadRequestError("Lawyer ID is required.");
        }

      
        const lawyer = await this._lawyerRepository.findById(lawyerId);

        if (!lawyer) {
            throw new NotFoundError("Lawyer not found.");
        }

        return { isActive: !lawyer.isBlock };
    }
}
