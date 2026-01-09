import { Request, Response, NextFunction } from "express";
import { RequestPayoutUseCase } from "../../../../application/useCases/lawyer/RequestPayoutUseCase";
import { ApprovePayoutUseCase } from "../../../../application/useCases/Admin/ApprovePayoutUseCase";
import { IWithdrawalRepository } from "../../../../domain/repositories/IWithdrawalRepository";
import { HttpStatusCode } from "../../../../infrastructure/interface/enums/HttpStatusCode";

export class PayoutController {
    constructor(
        private _requestPayoutUseCase: RequestPayoutUseCase,
        private _approvePayoutUseCase: ApprovePayoutUseCase,
        private _withdrawalRepository: IWithdrawalRepository
    ) { }

    async requestPayout(req: Request, res: Response, next: NextFunction) {
        try {
            const lawyerId = req.user?.id;
            const { amount } = req.body;
            const data = await this._requestPayoutUseCase.execute(lawyerId!, Number(amount));
            res.status(HttpStatusCode.CREATED).json({ success: true, data, message: "Payout request submitted successfully" });
        } catch (error) {
            next(error);
        }
    }

    async getLawyerWithdrawals(req: Request, res: Response, next: NextFunction) {
        try {
            const lawyerId = req.user?.id;
            const data = await this._withdrawalRepository.findByLawyerId(lawyerId!);
            res.status(HttpStatusCode.OK).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async getPendingWithdrawals(_req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this._withdrawalRepository.findAllPending();
            res.status(HttpStatusCode.OK).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async approvePayout(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this._approvePayoutUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({ success: true, message: "Payout approved and processed successfully" });
        } catch (error) {
            next(error);
        }
    }
}
