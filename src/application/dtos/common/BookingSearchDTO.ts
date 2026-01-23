export interface BookingSearchDTO {
    page: number;
    limit: number;
    search?: string;
    date?: string;
    status?: string;
}
