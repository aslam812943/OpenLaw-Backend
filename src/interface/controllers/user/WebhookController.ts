import { Request, Response, NextFunction } from 'express';
import { IHandleWebhookUseCase } from '../../../application/interface/use-cases/user/IHandleWebhookUseCase';
import { HttpStatusCode } from '../../../infrastructure/interface/enums/HttpStatusCode';


 
export class WebhookController {
    constructor(
        private handleWebhookUseCase: IHandleWebhookUseCase
    ) {}

 
    async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
           
            const event = req.body;

            
            await this.handleWebhookUseCase.execute(event);

          
            res.status(HttpStatusCode.OK).json({ received: true });
        } catch (error) {
            
            next(error);
        }
    }
}

