import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validate.middleware';
import { registerSchema, loginSchema, updateProfileSchema } from './auth.validation';

const router = Router();
const authController = new AuthController();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);

// Protected routes
router.use(authenticate);
router
  .route('/profile')
  .get(authController.getProfile)
  .patch(validateRequest(updateProfileSchema), authController.updateProfile);

export default router;
