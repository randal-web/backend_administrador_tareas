import { Request, Response, NextFunction } from 'express';

export function betaTesterMiddleware(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;

  if (!user || !user.is_beta_tester) {
    res.status(403).json({ 
      message: 'Acceso restringido. Esta funcionalidad solo está disponible para Beta Testers.' 
    });
    return;
  }

  next();
}