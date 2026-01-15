import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import type { User } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends Omit<import('@prisma/client').User, 'passwordHash'> {}
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
    if (err || !user) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
}

export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
}
