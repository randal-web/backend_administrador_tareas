import { Op } from 'sequelize';
import { Notification, NotificationCreationAttributes } from './notification.model';
import { Task } from '../tasks/task.model';
import { Reminder } from '../reminders/reminder.model';

export class NotificationService {
  /* ── CRUD ───────────────────────────────────── */

  static async getAll(userId: string) {
    return Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 100,
    });
  }

  static async getUnreadCount(userId: string) {
    return Notification.count({
      where: { user_id: userId, is_read: false },
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    const n = await Notification.findOne({ where: { id: notificationId, user_id: userId } });
    if (!n) throw new Error('Notificación no encontrada');
    await n.update({ is_read: true });
    return n;
  }

  static async markAllAsRead(userId: string) {
    await Notification.update({ is_read: true }, { where: { user_id: userId, is_read: false } });
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  static async delete(notificationId: string, userId: string) {
    const n = await Notification.findOne({ where: { id: notificationId, user_id: userId } });
    if (!n) throw new Error('Notificación no encontrada');
    await n.destroy();
    return { message: 'Notificación eliminada' };
  }

  static async deleteAll(userId: string) {
    await Notification.destroy({ where: { user_id: userId } });
    return { message: 'Notificaciones eliminadas' };
  }

  /* ── GENERATION ─────────────────────────────── */

  static async generate(userId: string) {
    const now = new Date();
    const hour = now.getHours();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const created: Notification[] = [];

    // Morning (9 AM): tasks & reminders for today
    if (hour >= 9 && hour < 12) {
      const alreadyMorning = await Notification.findOne({
        where: {
          user_id: userId,
          type: 'morning_tasks',
          created_at: { [Op.gte]: new Date(`${today}T00:00:00`) },
        },
      });

      if (!alreadyMorning) {
        // Today's tasks (not done)
        const tasks = await Task.findAll({
          where: {
            user_id: userId,
            status: { [Op.in]: ['TODO', 'IN_PROGRESS', 'REVIEW'] },
            [Op.or]: [
              { start_date: { [Op.lte]: today } },
              { end_date: today },
            ],
          },
        });

        if (tasks.length > 0) {
          const taskLines = tasks.slice(0, 5).map(t => `• ${t.title}`).join('\n');
          const extra = tasks.length > 5 ? `\n...y ${tasks.length - 5} más` : '';
          const n = await Notification.create({
            user_id: userId,
            title: `🌅 Buenos días — ${tasks.length} tarea${tasks.length !== 1 ? 's' : ''} para hoy`,
            message: `${taskLines}${extra}`,
            type: 'morning_tasks',
          });
          created.push(n);
        }

        // Today's reminders
        const reminders = await Reminder.findAll({
          where: { user_id: userId, due_date: today, is_completed: false },
        });

        if (reminders.length > 0) {
          const lines = reminders.slice(0, 5).map(r => `• ${r.title}${r.due_time ? ` (${r.due_time})` : ''}`).join('\n');
          const extra = reminders.length > 5 ? `\n...y ${reminders.length - 5} más` : '';
          const n = await Notification.create({
            user_id: userId,
            title: `📋 ${reminders.length} pendiente${reminders.length !== 1 ? 's' : ''} para hoy`,
            message: `${lines}${extra}`,
            type: 'morning_reminders',
          });
          created.push(n);
        }
      }
    }

    // Evening (11 PM): pending tasks & reminders still incomplete
    if (hour >= 23) {
      const alreadyEvening = await Notification.findOne({
        where: {
          user_id: userId,
          type: 'evening_pending',
          created_at: { [Op.gte]: new Date(`${today}T00:00:00`) },
        },
      });

      if (!alreadyEvening) {
        const pendingTasks = await Task.findAll({
          where: {
            user_id: userId,
            status: { [Op.in]: ['TODO', 'IN_PROGRESS', 'REVIEW'] },
            [Op.or]: [
              { start_date: { [Op.lte]: today } },
              { end_date: today },
            ],
          },
        });

        const pendingReminders = await Reminder.findAll({
          where: { user_id: userId, due_date: today, is_completed: false },
        });

        const total = pendingTasks.length + pendingReminders.length;
        if (total > 0) {
          const lines: string[] = [];
          pendingTasks.slice(0, 3).forEach(t => lines.push(`• Tarea: ${t.title}`));
          pendingReminders.slice(0, 3).forEach(r => lines.push(`• Pendiente: ${r.title}`));
          const extra = total > 6 ? `\n...y ${total - 6} más` : '';

          const n = await Notification.create({
            user_id: userId,
            title: `🌙 Fin del día — ${total} elemento${total !== 1 ? 's' : ''} sin completar`,
            message: `${lines.join('\n')}${extra}`,
            type: 'evening_pending',
          });
          created.push(n);
        }
      }
    }

    return created;
  }
}
