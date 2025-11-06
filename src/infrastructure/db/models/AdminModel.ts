import mongoose,{Document,Schema} from "mongoose";


export interface AdminDocument extends Document{
    name:string;
    password:string;
    email:string;
    
}


const AdminSchema = new Schema<AdminDocument>({
    name:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true}},{timestamps:true})


export const AdminModel = mongoose.model<AdminDocument>('Admin',AdminSchema);