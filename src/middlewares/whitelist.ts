import config from '@/config';
import userModel from '@/features/auth/user.model';
import logger from '@/lib/logger';
import { UserData } from '@/types/user.types';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

export const whitelist = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, role } = req.body as UserData;

    if (role === 'admin' && !config.WHITELIST_ADMIN_MAIL.includes(email)) {
      res.status(401).json({
        code: 'AuthorizationError',
        message: 'You cannot register as a admin',
      });

      logger.warn(
        `User with email ${email} tried to register as an admin but is not in the whitelist`,
      );
      return;
    }

    next();
  } catch (error) {
    logger.error(error, 'Authorization error');
    res.status(500).json({ message: 'Internal server error' });
  }
};
