import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class CheckLawyerStatusUseCase {
    constructor(private _repo: ILawyerRepository) { }

    async check(id: string): Promise<{ isActive: boolean }> {

        if (!id) {
            throw new BadRequestError("Lawyer ID is required.");
        }

      
        const lawyer = await this._repo.findById(id);

        if (!lawyer) {
            throw new NotFoundError("Lawyer not found.");
        }

        return { isActive: !lawyer.isBlock };
    }
}
