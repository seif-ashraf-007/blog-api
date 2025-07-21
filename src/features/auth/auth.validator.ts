import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import userModel from './user.model';

const userRegisterSchema = z.object({
  username: z
    .string()
    .max(20, { error: 'Username must be less than 20 characters' })
    .optional()
    .refine(
      async (username) => {
        const user = await userModel.findOne({ username });
        return !user;
      },
      { error: 'Username already in use' },
    ),
  email: z
    .email({ error: 'Must be a valid email' })
    .max(50, { error: 'Email must be less than 20 characters' })
    .refine(
      async (email) => {
        const user = await userModel.findOne({ email });
        return !user;
      },
      { error: 'Email already in use' },
    ),
  password: z
    .string()
    .min(8, { error: 'Password must be at leat 8 characters logs' })
    .max(16, { error: 'Password must be less than 16 characters long' }),
  role: z.enum(['user', 'admin'], {
    error: 'Role must be either admin or user only',
  }),
});

export const validateRegsiterSchema = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = await userRegisterSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};
