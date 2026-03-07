import { Op } from 'sequelize';
import { Reminder, ReminderCreationAttributes } from './reminder.model';

export class ReminderService {
  static async create(userId: string, data: Partial<ReminderCreationAttributes>) {
    const reminder = await Reminder.create({
      ...data,
      user_id: userId,
      title: data.title!,
      due_date: data.due_date!,
    });
    return reminder;
  }

  static async getAll(userId: string) {
    return Reminder.findAll({
      where: { user_id: userId, is_completed: false },
      order: [['due_date', 'ASC'], ['due_time', 'ASC']],
    });
  }

  static async getArchived(userId: string) {
    return Reminder.findAll({
      where: { user_id: userId, is_completed: true },
      order: [['updated_at', 'DESC']],
    });
  }

  static async getById(reminderId: string, userId: string) {
    const reminder = await Reminder.findOne({
      where: { id: reminderId, user_id: userId },
    });
    if (!reminder) throw new Error('Pendiente no encontrado');
    return reminder;
  }

  static async update(reminderId: string, userId: string, data: Partial<ReminderCreationAttributes>) {
    const reminder = await Reminder.findOne({ where: { id: reminderId, user_id: userId } });
    if (!reminder) throw new Error('Pendiente no encontrado');
    await reminder.update(data);
    return reminder;
  }

  static async delete(reminderId: string, userId: string) {
    const reminder = await Reminder.findOne({ where: { id: reminderId, user_id: userId } });
    if (!reminder) throw new Error('Pendiente no encontrado');
    await reminder.destroy();
    return { message: 'Pendiente eliminado correctamente' };
  }

  static async toggleComplete(reminderId: string, userId: string) {
    const reminder = await Reminder.findOne({ where: { id: reminderId, user_id: userId } });
    if (!reminder) throw new Error('Pendiente no encontrado');
    await reminder.update({ is_completed: !reminder.is_completed });
    return reminder;
  }
}
