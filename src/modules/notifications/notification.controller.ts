import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

export class NotificationController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const notifications = await NotificationService.getAll(req.user!.id);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await NotificationService.getUnreadCount(req.user!.id);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const notification = await NotificationService.markAsRead(req.params.id as string, req.user!.id);
      res.json(notification);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const result = await NotificationService.markAllAsRead(req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await NotificationService.delete(req.params.id as string, req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async deleteAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await NotificationService.deleteAll(req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async generate(req: Request, res: Response): Promise<void> {
    try {
      const created = await NotificationService.generate(req.user!.id);
      res.json(created);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
