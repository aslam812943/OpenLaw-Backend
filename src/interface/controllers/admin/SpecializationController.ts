import { NextFunction, Request, Response } from "express";
import { IAddSpecializationUseCase } from "../../../application/interface/use-cases/admin/specialization/IAddSpecializationUseCase";
import { IEditSpecializationUseCase } from "../../../application/interface/use-cases/admin/specialization/IEditSpecializationUseCase";
import { IDeleteSpecializationUseCase } from "../../../application/interface/use-cases/admin/specialization/IDeleteSpecializationUseCase";
import { IGetSpecializationsUseCase } from "../../../application/interface/use-cases/admin/specialization/IGetSpecializationsUseCase";
import { CreateSpecializationDTO } from "../../../application/dtos/admin/specialization/CreateSpecializationDTO";
import { UpdateSpecializationDTO } from "../../../application/dtos/admin/specialization/UpdateSpecializationDTO";
import { HttpStatusCode } from "../../../infrastructure/interface/enums/HttpStatusCode";
import { MessageConstants } from "../../../infrastructure/constants/MessageConstants";
import { ApiResponse } from "../../../infrastructure/utils/ApiResponse";
export class SpecializationController {
    constructor(
        private _addSpecializationUseCase: IAddSpecializationUseCase,
        private _editSpecializationUseCase: IEditSpecializationUseCase,
        private _deleteSpecializationUseCase: IDeleteSpecializationUseCase,
        private _getSpecializationsUseCase: IGetSpecializationsUseCase
    ) { }

    async addSpecialization(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { name, description } = req.body;
            const createDto = new CreateSpecializationDTO(name, description);
            const result = await this._addSpecializationUseCase.execute(createDto);
            return ApiResponse.success(res, HttpStatusCode.CREATED, MessageConstants.SPECIALIZATION.CREATE_SUCCESS, result);
        } catch (error: unknown) {
            next(error);
        }
    }

    async editSpecialization(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const { name, description, isActive } = req.body;
            const updateDto = new UpdateSpecializationDTO(name, description, isActive);
            const result = await this._editSpecializationUseCase.execute(id, updateDto);
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.SPECIALIZATION.UPDATE_SUCCESS, result);
        } catch (error: unknown) {
            next(error);
        }
    }

    async deleteSpecialization(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            await this._deleteSpecializationUseCase.execute(id);
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.SPECIALIZATION.DELETE_SUCCESS);
        } catch (error: unknown) {
            next(error);
        }
    }

    async getSpecializations(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const result = await this._getSpecializationsUseCase.execute();
            return ApiResponse.success(res, HttpStatusCode.OK, MessageConstants.SPECIALIZATION.FETCH_SUCCESS, result);
        } catch (error: unknown) {
            next(error);
        }
    }
}
