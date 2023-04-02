import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodError } from 'zod';

function validationMiddleware(schema: z.Schema): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const value = await schema.parseAsync(req.body);

      req.body = value;
      next();
    } catch (e: ZodError | any) {
      const errors: string[] = [];

      if (e instanceof ZodError) {
        e.errors.forEach(error => {
          if (error.code === 'invalid_enum_value') {
            errors.push('Role must be either USER or ADMIN');
          } else {
            errors.push(error.message);
          }
        });
      }

      res.status(400).send({ status: 400, errors });
    }
  };
}

export default validationMiddleware;
