export class ChangePasswordDTO {
    constructor(
        public id: string,
        public oldPassword: string,
        public newPassword: string
    ) { }
}
