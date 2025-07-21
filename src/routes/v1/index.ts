import { Router } from 'express';
import authRouter from '@/features/auth/auth.routes';

const router = Router();

// Root route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    docs: '',
    timestap: new Date().toISOString(),
  });
});

router.use('/auth', authRouter);

export default router;
