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
    this.router.get(
      `${this.path}/marketplace/hepsiburada`,
      authenticatedMiddleware,
      this.getHepsiburada
    );
    this.router.post(
      `${this.path}/marketplace/hepsiburada`,
      [authenticatedMiddleware, validationMiddleware(validate.addHepsiburada)],
      this.addHepsiburada
    );
    this.router.put(
      `${this.path}/marketplace/hepsiburada`,
      [
        authenticatedMiddleware,
        validationMiddleware(validate.updateHepsiburada)
      ],
      this.updateHepsiburada
    );
    this.router.delete(
      `${this.path}/marketplace/hepsiburada`,
      authenticatedMiddleware,
      this.deleteHepsiburada
    );
  }

  private getHepsiburada = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) return next(new HttpException(404, 'No logged in user'));
      const { id } = req.user;
      const data = await this.IntegrationService.getHepsiburada(id);

      res.status(200).send({ data });
    } catch (error: Error | any) {
      next(new HttpException(400, error.message));
    }
  };

  private addHepsiburada = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) return next(new HttpException(404, 'No logged in user'));
      const { id } = req.user;
      const data = await this.IntegrationService.addHepsiburada(id, req.body);

      res.status(200).send({
        userId: id,
        data
      });
    } catch (error: Error | any) {
      next(new HttpException(400, error.message));
    }
  };

  private updateHepsiburada = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) return next(new HttpException(404, 'No logged in user'));
      const { id } = req.user;
      const data = await this.IntegrationService.updateHepsiburada(
        id,
        req.body
      );

      res.status(200).send({
        userId: id,
        data
      });
    } catch (error: Error | any) {
      next(new HttpException(400, error.message));
    }
  };

  private deleteHepsiburada = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) return next(new HttpException(404, 'No logged in user'));

      const { id } = req.user;
      const data = await this.IntegrationService.deleteHepsiburada(id);

      res.status(200).send({
        userId: id,
        data
      });
    } catch (error: Error | any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default IntegrationController;
