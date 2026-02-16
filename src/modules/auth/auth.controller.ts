import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, full_name } = req.body;

      if (!email || !password || !full_name) {
        res.status(400).json({ message: 'Todos los campos son requeridos' });
        return;
      }

      const result = await AuthService.register(email, password, full_name);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña son requeridos' });
        return;
      }

      const result = await AuthService.login(email, password);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: 'El email es requerido' });
        return;
      }
      const result = await AuthService.forgotPassword(email);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
        return;
      }
      const result = await AuthService.resetPassword(token, password);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await AuthService.updateProfile(req.user!.id, req.body);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      res.json(user);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
