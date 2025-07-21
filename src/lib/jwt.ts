import jwt from 'jsonwebtoken';
import config from '@/config';
import { Types } from 'mongoose';

export const generateAccessToken = (
  userId: Types.ObjectId,
  role?: string,
): string => {
  return jwt.sign({ userId, role }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
};

export const generateRefreshToken = (
  userId: Types.ObjectId,
  role: string,
): string => {
  return jwt.sign({ userId, role }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken',
  });
};
