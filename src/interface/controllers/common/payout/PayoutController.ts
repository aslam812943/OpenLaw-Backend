import { Request, Response, NextFunction } from "express";
import { IRequestPayoutUseCase } from "../../../../application/interface/use-cases/lawyer/IRequestPayoutUseCase";
import { IApprovePayoutUseCase } from "../../../../application/interface/use-cases/admin/IApprovePayoutUseCase";
import { IRejectPayoutUseCase } from "../../../../application/interface/use-cases/admin/IRejectPayoutUseCase";
import { IWithdrawalRepository } from "../../../../domain/repositories/IWithdrawalRepository";
import { HttpStatusCode } from "../../../../infrastructure/interface/enums/HttpStatusCode";
import { ApiResponse } from "../../../../infrastructure/utils/ApiResponse";

export class PayoutController {
    constructor(
        private _requestPayoutUseCase: IRequestPayoutUseCase,
        private _approvePayoutUseCase: IApprovePayoutUseCase,
        private _rejectPayoutUseCase: IRejectPayoutUseCase,
        private _withdrawalRepository: IWithdrawalRepository
    ) { }

    async requestPayout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.user?.id;
            const { amount } = req.body;
            const data = await this._requestPayoutUseCase.execute(lawyerId!, Number(amount));
            return ApiResponse.success(res, HttpStatusCode.CREATED, "Payout request submitted successfully", data);
        } catch (error) {
            next(error);
        }
    }

    async getLawyerWithdrawals(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const lawyerId = req.user?.id;
            const data = await this._withdrawalRepository.findByLawyerId(lawyerId!);
            return ApiResponse.success(res, HttpStatusCode.OK, "Withdrawals retrieved successfully", data);
        } catch (error: unknown) {
            next(error);
        }
    }

    async getPendingWithdrawals(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const data = await this._withdrawalRepository.findAllPending();
            return ApiResponse.success(res, HttpStatusCode.OK, "Pending withdrawals retrieved successfully", data);
        } catch (error: unknown) {
            next(error);
        }
    }

    async approvePayout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            await this._approvePayoutUseCase.execute(id);
            return ApiResponse.success(res, HttpStatusCode.OK, "Payout approved and processed successfully");
        } catch (error: unknown) {
            next(error);
        }
    }

    async rejectPayout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            await this._rejectPayoutUseCase.execute(id);
            return ApiResponse.success(res, HttpStatusCode.OK, "Payout rejected and funds refunded successfully");
        } catch (error) {
            next(error);
        }
    }
}
