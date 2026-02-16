import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../modules/auth/user.model';

// AuthRequest is kept as an alias for backward compat
export type AuthRequest = Request;

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      res.status(401).json({ message: 'No autorizado. Usuario no encontrado.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'No autorizado. Token inválido.' });
  }
}
