export class UpdateLawyerProfileDTO {
    constructor(
        public name: string,
        public phone: string,
        public address: string,
        public city: string,
        public state: string,
        public pincode: string,
        public imageUrl?: string,
        public bio?: string
    ) { }
}

