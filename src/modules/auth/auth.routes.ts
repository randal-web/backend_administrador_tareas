import { Router, type RequestHandler } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { AuthService } from './auth.service';
import { config } from '../../config';
import { validate } from '../../middleware/validation.middleware';
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  updateProfileSchema
} from './auth.schema';

const router: Router = Router();

// Local auth
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);

// Profile (authenticated)
router.get('/me', authMiddleware as RequestHandler, AuthController.me as RequestHandler);
router.get('/profile', authMiddleware as RequestHandler, AuthController.getProfile as RequestHandler);
router.put('/profile', authMiddleware as RequestHandler, validate(updateProfileSchema), AuthController.updateProfile as RequestHandler);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${config.frontendUrl}/login?error=oauth_failed` }),
  async (req: any, res) => {
    try {
      const result = await AuthService.findOrCreateOAuthUser({
        email: req.user.emails[0].value,
        fullName: req.user.displayName,
        avatarUrl: req.user.photos?.[0]?.value,
        provider: 'google',
        providerId: req.user.id,
      });

      // Set cookie for cross-domain auth
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to frontend without token in URL
      res.redirect(`${config.frontendUrl}/auth/callback`);
    } catch {
      res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
  }
);

export default router;
