export class Specialization {
    constructor(
        public id: string,
        public name: string,
        public description?: string,
        public isActive: boolean = true
    ) { }
}
