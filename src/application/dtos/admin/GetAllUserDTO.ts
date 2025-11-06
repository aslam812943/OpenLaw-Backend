export interface IGetAllUserDTO{
    id:string;
    name:string;
    email:string;
    phone:string;
    isBlock:boolean;


}


export class GetAllUserDTO implements IGetAllUserDTO{
    id:string;
    email: string;
    phone: string;
    isBlock: boolean;
    name: string;


    constructor(data:IGetAllUserDTO){
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.isBlock = data.isBlock;
        this.phone = data.phone
    }
}