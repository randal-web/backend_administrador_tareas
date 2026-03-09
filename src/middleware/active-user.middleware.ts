import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/auth/user.model';

export async function activeUserMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = (req as any).user;

  if (!user) {
    next();
    return;
  }

  try {
    // 1. Check if account is disabled (Critical security check)
    const dbUser = await User.findByPk(user.id, { attributes: ['id', 'is_active'] });

    if (!dbUser || !dbUser.is_active) {
      res.status(403).json({
        message: 'Tu cuenta ha sido inhabilitada. Contacta con el administrador.',
        account_status: 'disabled'
      });
      return;
    }

    // 2. Update last activity (Now it will update on EVERY request, including GET)
    // We use a simple update to avoid overhead
    User.update(
      { last_active_at: new Date() }, 
      { where: { id: user.id }, silent: true } // silent: true prevents updated_at from changing if we only want activity
    ).catch(err => {
      console.error('Error updating last_active_at:', err);
    });

    next();
  } catch (error) {
    next();
  }
}
