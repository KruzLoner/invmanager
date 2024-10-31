import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerValidation, loginValidation } from '../validations/auth.validations.js';
import type { RequestHandler } from 'express';

const router = Router();

router.post('/register', validate(registerValidation), register as RequestHandler);
router.post('/login', validate(loginValidation), login as RequestHandler);
router.get('/profile', authenticate as RequestHandler, getProfile as RequestHandler);

export default router; 