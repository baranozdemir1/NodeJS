import Token from '@/interfaces/token.interface';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/helpers/token';
import jwt from 'jsonwebtoken';
import HttpException from '@/helpers/http.exception';
import { PrismaClient } from '@prisma/client';

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return next(new HttpException(401, 'Your token must be valid.'));
  }

  const accessToken = bearer.split('Bearer ')[1].trim();

  try {
    const payload: Token | jwt.JsonWebTokenError = await verifyToken(
      accessToken
    );

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'Your token must be valid.'));
    }

    const user = await new PrismaClient().user.findUnique({
      where: {
        id: payload.id
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        email: true,
        integrationId: true
      }
    });

    if (!user) {
      return next(new HttpException(401, 'Your token must be valid.'));
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(new HttpException(401, 'Your token must be valid.'));
  }
}

export default authenticatedMiddleware;
