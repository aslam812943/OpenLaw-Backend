export class UpdateLawyerProfileDTO {
    public name: string;
    public phone: string;
    public address: string;
    public city: string;
    public state: string;
    public pincode: string;
    public practiceAreas: string[];
    public languages: string[];
    public imageUrl?: string;
    public bio?: string;
    public consultationFee?: number;

    constructor(
        name: string,
        phone: string,
        address: string,
        city: string,
        state: string,
        pincode: string,
        practiceAreas: string[],
        languages: string[],
        imageUrl?: string,
        bio?: string,
        consultationFee?: number
    ) {
        this.name = name?.trim();
        this.phone = phone?.trim();
        this.address = address?.trim();
        this.city = city?.trim();
        this.state = state?.trim();
        this.pincode = pincode?.trim();
        this.practiceAreas = practiceAreas || [];
        this.languages = languages || [];
        this.imageUrl = imageUrl;
        this.bio = bio?.trim();
        this.consultationFee = consultationFee;
    }
}

