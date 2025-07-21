import { Router } from 'express';
import { register } from './auth.controller';
import { whitelist } from '@/middlewares/whitelist';
import { validateRegsiterSchema } from './auth.validator';

const router = Router();

router.post('/register', validateRegsiterSchema, whitelist, register);

export default router;
