import Notification, { NotificationAttributes } from './notification.model';
import { User } from '../auth/user.model';

export class NotificationService {
  static async getByUserId(userId: string) {
    return await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 50
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOne({ where: { id: notificationId, user_id: userId } });
    if (notification) {
      await notification.update({ is_read: true });
      return true;
    }
    return false;
  }

  static async delete(notificationId: string, userId: string) {
    const notification = await Notification.findOne({ where: { id: notificationId, user_id: userId } });
    if (notification) {
      await notification.destroy();
      return true;
    }
    return false;
  }

  // Admin function: Create a notification for ALL users
  static async notifyAll(data: { title: string; message: string; type: any; action_url?: string }) {
    const users = await User.findAll({ attributes: ['id'] });
    const notifications = users.map(user => ({
      ...data,
      user_id: user.id
    }));
    
    await Notification.bulkCreate(notifications);
    return { count: users.length };
  }

  static async createOne(userId: string, data: Partial<NotificationAttributes>) {
    return await Notification.create({ ...data, user_id: userId } as any);
  }
}