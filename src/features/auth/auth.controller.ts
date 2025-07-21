import type { Request, Response } from 'express';
import logger from '@/lib/logger';
import { registerUser } from './auth.service';
import config from '@/config';

export const register = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  try {
    const { data, accessToken, message, refreshToken, success } =
      await registerUser(body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: true,
    });

    res.status(201).json({
      success,
      message,
      data,
      accessToken,
    });

    logger.info(
      {
        username: data.username,
        email: data.email,
        role: data.role,
      },
      'User registered successfully',
    );
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error(error, 'Error during user registeration');
  }
};
