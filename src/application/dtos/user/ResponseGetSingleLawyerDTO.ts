import { Lawyer } from "../../../domain/entities/Lawyer";

export class ResponseGetSingleLawyerDTO {
  id: string;
  barNumber: string;
  barAdmissionDate: string;
  yearsOfPractice: number;
  practiceAreas: string[];
  languages: string[];
  address: string;
  city: string;
  state: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  bio: string;
  consultationFee:number

  constructor(data: any) {
    this.id = String(data.id);
    this.barNumber = String(data.barNumber);
    this.barAdmissionDate = String(data.barAdmissionDate);
    this.yearsOfPractice = Number(data.yearsOfPractice);
    this.practiceAreas = Array.isArray(data.practiceAreas) ? data.practiceAreas : [];
    this.languages = Array.isArray(data.languages) ? data.languages : [];

    this.address = data.addresses?.address || "";
    this.city = data.addresses?.city || "";
    this.state = data.addresses?.state || "";


    this.name = data.name || data.user?.name || "";
    this.email = data.email || data.user?.email || "";
    this.phone = String(data.phone || data.user?.phone || "");

    this.profileImage = data.profileImage || "";
    this.bio = data.bio || "";
    this.consultationFee = data.consultationFee
  }
}
