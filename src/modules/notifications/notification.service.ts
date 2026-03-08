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
    
    // Create local date string (YYYY-MM-DD)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const created: Notification[] = [];

    // --- MORNING (9 AM onwards) ---
    if (hour >= 9) {
      // 1. Individual Task Notifications
      const tasks = await Task.findAll({
        where: {
          user_id: userId,
          status: { [Op.in]: ['TODO', 'IN_PROGRESS', 'REVIEW'] },
          [Op.or]: [
            { start_date: { [Op.lte]: todayStr } },
            { end_date: todayStr },
          ],
        },
      });

      for (const t of tasks) {
        const refId = `task_morning_${t.id}_${todayStr}`;
        const exists = await Notification.findOne({ where: { user_id: userId, reference_id: refId } });
        
        if (!exists) {
          const n = await Notification.create({
            user_id: userId,
            title: `📌 Tarea para hoy`,
            message: t.title,
            type: 'task_due',
            reference_id: refId,
            reference_type: 'task'
          });
          created.push(n);
        }
      }

      // 2. Individual Reminder Notifications
      const reminders = await Reminder.findAll({
        where: { user_id: userId, due_date: todayStr, is_completed: false },
      });

      for (const r of reminders) {
        const refId = `rem_morning_${r.id}_${todayStr}`;
        const exists = await Notification.findOne({ where: { user_id: userId, reference_id: refId } });

        if (!exists) {
          const n = await Notification.create({
            user_id: userId,
            title: `🔔 Recordatorio`,
            message: `${r.title}${r.due_time ? ` (${r.due_time})` : ''}`,
            type: 'reminder_due',
            reference_id: refId,
            reference_type: 'reminder'
          });
          created.push(n);
        }
      }
    }

    // --- EVENING (8 PM onwards) ---
    if (hour >= 20) {
      const pendingTasks = await Task.findAll({
        where: {
          user_id: userId,
          status: { [Op.in]: ['TODO', 'IN_PROGRESS', 'REVIEW'] },
          [Op.or]: [
            { start_date: { [Op.lte]: todayStr } },
            { end_date: todayStr },
          ],
        },
      });

      const pendingReminders = await Reminder.findAll({
        where: { user_id: userId, due_date: todayStr, is_completed: false },
      });

      for (const t of pendingTasks) {
        const refId = `task_evening_${t.id}_${todayStr}`;
        const exists = await Notification.findOne({ where: { user_id: userId, reference_id: refId } });
        if (!exists) {
          await Notification.create({
            user_id: userId,
            title: `🌙 Tarea pendiente`,
            message: `No olvides terminar: ${t.title}`,
            type: 'evening_pending',
            reference_id: refId,
            reference_type: 'task'
          });
        }
      }

      for (const r of pendingReminders) {
        const refId = `rem_evening_${r.id}_${todayStr}`;
        const exists = await Notification.findOne({ where: { user_id: userId, reference_id: refId } });
        if (!exists) {
          await Notification.create({
            user_id: userId,
            title: `🌙 Pendiente`,
            message: `Aún no has completado: ${r.title}`,
            type: 'evening_pending',
            reference_id: refId,
            reference_type: 'reminder'
          });
        }
      }
    }

    return created;
  }
}
