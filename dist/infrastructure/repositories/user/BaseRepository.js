"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const InternalServerError_1 = require("../../errors/InternalServerError");
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        try {
            return await this.model.create(data);
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while creating document.");
        }
    }
    async findOne(filter) {
        try {
            return await this.model.findOne(filter).exec();
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while finding document.");
        }
    }
    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError("Database error while updating document.");
        }
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map