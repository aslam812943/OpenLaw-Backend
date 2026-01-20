import { NextFunction, Request, Response } from "express";
import { IAddSpecializationUseCase } from "../../../application/interface/use-cases/admin/specialization/IAddSpecializationUseCase";
import { IEditSpecializationUseCase } from "../../../application/interface/use-cases/admin/specialization/IEditSpecializationUseCase";
import { IDeleteSpecializationUseCase } from "../../../application/interface/use-cases/admin/specialization/IDeleteSpecializationUseCase";
import { IGetSpecializationsUseCase } from "../../../application/interface/use-cases/admin/specialization/IGetSpecializationsUseCase";
import { CreateSpecializationDTO } from "../../../application/dtos/admin/specialization/CreateSpecializationDTO";
import { UpdateSpecializationDTO } from "../../../application/dtos/admin/specialization/UpdateSpecializationDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
export class SpecializationController {
    constructor(
        private _addSpecializationUseCase: IAddSpecializationUseCase,
        private _editSpecializationUseCase: IEditSpecializationUseCase,
        private _deleteSpecializationUseCase: IDeleteSpecializationUseCase,
        private _getSpecializationsUseCase: IGetSpecializationsUseCase
    ) { }

    async addSpecialization(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description } = req.body;
            const createDto = new CreateSpecializationDTO(name, description);
            const result = await this._addSpecializationUseCase.execute(createDto);
            res.status(HttpStatusCode.CREATED).json({ success: true, message: MessageConstants.SPECIALIZATION.CREATE_SUCCESS, data: result });
        } catch (error: unknown) {
            next(error);
        }
    }

    async editSpecialization(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, description, isActive } = req.body;
            const updateDto = new UpdateSpecializationDTO(name, description, isActive);
            const result = await this._editSpecializationUseCase.execute(id, updateDto);
            res.status(HttpStatusCode.OK).json({ success: true, message: MessageConstants.SPECIALIZATION.UPDATE_SUCCESS, data: result });
        } catch (error: unknown) {
            next(error);
        }
    }

    async deleteSpecialization(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this._deleteSpecializationUseCase.execute(id);
            res.status(HttpStatusCode.OK).json({ success: true, message: MessageConstants.SPECIALIZATION.DELETE_SUCCESS });
        } catch (error: unknown) {
            next(error);
        }
    }

    async getSpecializations(_req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._getSpecializationsUseCase.execute();
            res.status(HttpStatusCode.OK).json({ success: true, message: MessageConstants.SPECIALIZATION.FETCH_SUCCESS, data: result });
        } catch (error: unknown) {
            next(error);
        }
    }
}
