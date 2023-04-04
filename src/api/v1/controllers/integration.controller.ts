import Controller from '@/interfaces/controller.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import IntegrationService from '@/services/integration.service';
import HttpException from '@/helpers/http.exception';
import validate from '@/validations/integration.validation';
import authenticatedMiddleware from '@/middlewares/authenticated.middleware';
import { Router, Request, Response, NextFunction } from 'express';

class IntegrationController implements Controller {
  public path = '/integration';
  public router = Router();
  private IntegrationService = new IntegrationService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/add/marketplace/hepsiburada`,
      [authenticatedMiddleware, validationMiddleware(validate.addHepsiburada)],
      this.addHepsiburada
    );
  }

  private addHepsiburada = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    if (!req.user) return next(new HttpException(404, 'No logged in user'));
    const { id } = req.user;
    const data = await this.IntegrationService.addHepsiburada(id, req.body);

    res.status(200).send({
      userId: id,
      data
    });
  };
}

export default IntegrationController;
