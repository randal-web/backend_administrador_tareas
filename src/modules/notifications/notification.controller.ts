import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

export const getMyNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const notifications = await NotificationService.getByUserId(userId);
  res.json(notifications);
};

export const markRead = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  await NotificationService.markAsRead(id, userId);
  res.status(204).end();
};

export const deleteNotif = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  await NotificationService.delete(id, userId);
  res.status(204).end();
};

// This endpoint is for you (as admin) to send global notifications
// You could later protect this with an is_admin check
export const sendGlobalNotification = async (req: Request, res: Response) => {
  try {
    const result = await NotificationService.notifyAll(req.body);
    res.json({ message: `Notificación enviada a ${result.count} usuarios.`, ...result });
  } catch (error: any) {
    res.status(500).json({ message: 'Error enviando notificación global', error: error.message });
  }
};