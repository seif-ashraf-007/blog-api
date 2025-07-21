import User from './user.model';
import Token from './token.model';
import { UserData } from '../../types/user.types';
import { genUsername } from '@/utls/index';
import { RegisterResponse } from '@/types/auth.types';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import logger from '@/lib/logger';
import config from '@/config';

export const registerUser = async (
  data: UserData,
): Promise<RegisterResponse> => {
  let { email, password, role, username } = data;

  username = username || genUsername();

  const newUser = await User.create({
    username,
    email,
    password,
    role,
  });
  if (!newUser) throw new Error('Error while creating the user');

  const accessToken = generateAccessToken(newUser._id, role);
  const refreshToken = generateRefreshToken(newUser._id, role);

  // store refresh token in db
  const savedRefreshTokenToken = await Token.create({
    token: refreshToken,
    userId: newUser._id,
    role: role,
  });

  logger.info(
    {
      userId: savedRefreshTokenToken.userId,
      role: savedRefreshTokenToken.role,
      token: savedRefreshTokenToken.token,
    },
    'Refresh token created and saved for user',
  );

  return {
    success: true,
    data: {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
    message: 'Registered a new user successfully',
  };
};
