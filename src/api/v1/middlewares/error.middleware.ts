import { NextFunction, Request, Response } from 'express';
import HttpException from '@/helpers/http.exception';
import Logger from '@/helpers/logger';

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  res.status(status).send({
    status,
    message
  });

  Logger.error(error.message);

  next();
}

export default errorMiddleware;
