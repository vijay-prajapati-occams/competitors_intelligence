import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authRateLimiter, authController.refresh);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.me);

export default router;
