import { Request, Response, NextFunction } from 'express';

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;

  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ 
      message: 'Acceso denegado. Se requieren privilegios de administrador.' 
    });
    return;
  }

  next();
}