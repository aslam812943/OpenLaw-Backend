export class SpecializationResponseDTO {
    constructor(
        public id: string,
        public name: string,
        public description: string | undefined,
        public isActive: boolean
    ) { }
}
