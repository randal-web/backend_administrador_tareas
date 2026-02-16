import { Op } from 'sequelize';
import { Habit, HabitCreationAttributes } from './habit.model';
import { HabitLog } from './habit-log.model';

export class HabitService {
  static async create(userId: string, data: Partial<HabitCreationAttributes>) {
    const habit = await Habit.create({
      ...data,
      user_id: userId,
      name: data.name!,
    });
    return habit;
  }

  static async getAll(userId: string) {
    return Habit.findAll({
      where: { user_id: userId },
      include: [{ model: HabitLog, as: 'logs' }],
      order: [['created_at', 'DESC']],
    });
  }

  static async getById(habitId: string, userId: string) {
    const habit = await Habit.findOne({
      where: { id: habitId, user_id: userId },
      include: [{ model: HabitLog, as: 'logs' }],
    });
    if (!habit) throw new Error('Hábito no encontrado');
    return habit;
  }

  static async update(habitId: string, userId: string, data: Partial<HabitCreationAttributes>) {
    const habit = await Habit.findOne({ where: { id: habitId, user_id: userId } });
    if (!habit) throw new Error('Hábito no encontrado');
    await habit.update(data);
    return this.getById(habitId, userId);
  }

  static async delete(habitId: string, userId: string) {
    const habit = await Habit.findOne({ where: { id: habitId, user_id: userId } });
    if (!habit) throw new Error('Hábito no encontrado');
    await habit.destroy();
    return { message: 'Hábito eliminado correctamente' };
  }

  // Get habits with their logs for the current week
  static async getWeeklyHabits(userId: string, weekStartDate?: string) {
    const now = new Date();
    // Get Monday of current week
    const startOfWeek = weekStartDate
      ? new Date(weekStartDate)
      : new Date(now.setDate(now.getDate() - now.getDay() + 1));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const startStr = startOfWeek.toISOString().split('T')[0];
    const endStr = endOfWeek.toISOString().split('T')[0];

    const habits = await Habit.findAll({
      where: { user_id: userId },
      include: [
        {
          model: HabitLog,
          as: 'logs',
          where: {
            date: {
              [Op.between]: [startStr, endStr],
            },
          },
          required: false,
        },
      ],
      order: [['created_at', 'ASC']],
    });

    // Build week grid for each habit
    return habits.map(habit => {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const log = (habit as any).logs?.find((l: any) => l.date === dateStr);

        weekDays.push({
          date: dateStr,
          dayIndex: i,
          is_completed: log ? log.is_completed : false,
          log_id: log?.id || null,
        });
      }

      return {
        ...habit.toJSON(),
        week: weekDays,
      };
    });
  }

  // Toggle a habit log for a specific date
  static async toggleLog(habitId: string, userId: string, date: string) {
    const habit = await Habit.findOne({ where: { id: habitId, user_id: userId } });
    if (!habit) throw new Error('Hábito no encontrado');

    const existingLog = await HabitLog.findOne({
      where: { habit_id: habitId, date },
    });

    if (existingLog) {
      if (existingLog.is_completed) {
        await existingLog.destroy();
        return { date, is_completed: false, action: 'removed' };
      } else {
        await existingLog.update({ is_completed: true });
        return { date, is_completed: true, action: 'completed' };
      }
    } else {
      await HabitLog.create({
        habit_id: habitId,
        date,
        is_completed: true,
      });
      return { date, is_completed: true, action: 'created' };
    }
  }
}
