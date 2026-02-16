import { Router, type RequestHandler } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { AuthService } from './auth.service';
import { config } from '../../config';

const router: Router = Router();

// Local auth
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Profile (authenticated)
router.get('/me', authMiddleware as RequestHandler, AuthController.me as RequestHandler);
router.get('/profile', authMiddleware as RequestHandler, AuthController.getProfile as RequestHandler);
router.put('/profile', authMiddleware as RequestHandler, AuthController.updateProfile as RequestHandler);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${config.frontendUrl}/login` }),
  async (req: any, res) => {
    try {
      const result = await AuthService.findOrCreateOAuthUser({
        email: req.user.emails[0].value,
        fullName: req.user.displayName,
        avatarUrl: req.user.photos?.[0]?.value,
        provider: 'google',
        providerId: req.user.id,
      });

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${config.frontendUrl}/dashboard`);
    } catch {
      res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
  }
);

// Outlook OAuth
router.get('/outlook', passport.authenticate('windowslive', { scope: ['openid', 'profile', 'offline_access', 'https://outlook.office.com/Mail.Read'] }));
router.get(
  '/outlook/callback',
  passport.authenticate('windowslive', { session: false, failureRedirect: `${config.frontendUrl}/login` }),
  async (req: any, res) => {
    try {
      const result = await AuthService.findOrCreateOAuthUser({
        email: req.user.emails[0].value,
        fullName: req.user.displayName,
        provider: 'outlook',
        providerId: req.user.id,
      });

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${config.frontendUrl}/dashboard`);
    } catch {
      res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
  }
);

export default router;
