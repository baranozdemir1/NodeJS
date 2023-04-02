import Controller from '@/interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';

class DemoController implements Controller {
  public path = '/';
  public router = Router();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}`, this.getUser);
  }

  private getUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    res.status(200).json({ message: 'OK' });
  };
}

export default DemoController;
