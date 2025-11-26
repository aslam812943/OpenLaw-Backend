interface GoogleAuthResponse {
    token: string;
    user: { id: string, email: string };
}



export interface IGoogleAuthUseCase{
    execute(idToken:string):Promise<GoogleAuthResponse>
}