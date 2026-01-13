import { Request, Response, NextFunction } from "express";
import { IGetAppoimentsUseCase } from "../../../application/interface/use-cases/lawyer/IGetAppoimentsUseCase";
import { UpdateAppointmentStatusUseCase } from "../../../application/useCases/lawyer/UpdateAppointmentStatusUseCase";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";


export class AppoimentsController {
    constructor(
        private _appoimentUseCase: IGetAppoimentsUseCase,
        private _updateStatusUseCase?: UpdateAppointmentStatusUseCase
    ) { }

    async getAppoiments(req: Request, res: Response, next: NextFunction) {
        try {
            let lawyerId = req.user?.id
            let data = await this._appoimentUseCase.execute(lawyerId!)
            res.status(HttpStatusCode.OK).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!this._updateStatusUseCase) {
                throw new Error("UpdateStatusUseCase not initialized");
            }

            await this._updateStatusUseCase.execute(id, status);
            res.status(HttpStatusCode.OK).json({ success: true, message: "Appointment status updated successfully" });
        } catch (error) {
            next(error);
        }
    }
}