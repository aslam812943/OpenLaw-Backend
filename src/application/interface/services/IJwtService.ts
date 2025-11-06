// import {JwtPayload} from 'jsonwebtoken'

// export interface TokenPayload extends JwtPayload{
//     name:string;
//     role:string;
//     userId:string
// }



export interface IJwtService{
    // signAccessToken(payload:object):string;
    // signRefreshToken(payload:object):string;
    // verifyAccessToken(token:string):any;
    // verifyRefreshToken(token:string):any;
     generateToken(payload: object): string;
  verifyToken(token: string): any;
}