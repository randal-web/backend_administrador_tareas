import { Op } from 'sequelize';
import { Task, TaskCreationAttributes } from './task.model';
import { Subtask } from './subtask.model';
import { TaskComment } from './task-comment.model';
import { Project } from '../projects/project.model';

export class TaskService {
  static async create(userId: string, data: Partial<TaskCreationAttributes>) {
    const task = await Task.create({
      ...data,
      user_id: userId,
      title: data.title!,
    });

    // Create subtasks if provided
    if (data && 'subtasks' in data && Array.isArray((data as any).subtasks)) {
      const subtasks = (data as any).subtasks as { title: string }[];
      for (const st of subtasks) {
        await Subtask.create({ task_id: task.id, title: st.title });
      }
    }

    return this.getById(task.id, userId);
  }

  static async getById(taskId: string, userId: string) {
    const { User } = require('../auth/user.model');
    const task = await Task.findOne({
      where: { id: taskId, user_id: userId },
      include: [
        { model: Subtask, as: 'subtasks' },
        {
          model: TaskComment,
          as: 'comments',
          include: [{
            model: User,
            as: 'commentUser',
            attributes: ['id', 'full_name', 'avatar_url']
          }]
        },
        { model: Project, as: 'project', attributes: ['id', 'name', 'color_hex'] },
      ],
    });
    if (!task) throw new Error('Tarea no encontrada');
    return task;
  }

  static async getByDate(userId: string, date: string) {
    return Task.findAll({
      where: {
        user_id: userId,
        [Op.or]: [
          { start_date: date },
          {
            start_date: { [Op.lte]: date },
            end_date: { [Op.gte]: date },
          },
        ],
      },
      include: [
        { model: Subtask, as: 'subtasks' },
        { model: Project, as: 'project', attributes: ['id', 'name', 'color_hex'] },
      ],
      order: [['priority', 'DESC'], ['created_at', 'ASC']],
    });
  }

  static async getUpcoming(userId: string, fromDate: string, days: number = 7) {
    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + days);
    const toDateStr = toDate.toISOString().split('T')[0];

    return Task.findAll({
      where: {
        user_id: userId,
        status: { [Op.ne]: 'DONE' },
        [Op.or]: [
          // Tasks that start in the upcoming range
          {
            start_date: {
              [Op.gt]: fromDate,
              [Op.lte]: toDateStr,
            },
          },
          // Tasks that started before but end within or after the range
          {
            start_date: { [Op.lte]: toDateStr },
            end_date: { [Op.gt]: fromDate },
          },
        ],
      },
      include: [
        { model: Subtask, as: 'subtasks' },
        { model: Project, as: 'project', attributes: ['id', 'name', 'color_hex'] },
      ],
      order: [['start_date', 'ASC'], ['priority', 'DESC']],
    });
  }

  static async getAll(userId: string, filters?: {
    category?: string;
    status?: string;
    project_id?: string;
    priority?: string;
  }) {
    const where: any = { user_id: userId };

    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;
    if (filters?.project_id) where.project_id = filters.project_id;
    if (filters?.priority) where.priority = filters.priority;

    return Task.findAll({
      where,
      include: [
        { model: Subtask, as: 'subtasks' },
        { model: Project, as: 'project', attributes: ['id', 'name', 'color_hex'] },
      ],
      order: [['start_date', 'ASC'], ['priority', 'DESC']],
    });
  }

  static async update(taskId: string, userId: string, data: Partial<TaskCreationAttributes>) {
    const task = await Task.findOne({ where: { id: taskId, user_id: userId } });
    if (!task) throw new Error('Tarea no encontrada');

    await task.update(data);
    return this.getById(taskId, userId);
  }

  static async delete(taskId: string, userId: string) {
    const task = await Task.findOne({ where: { id: taskId, user_id: userId } });
    if (!task) throw new Error('Tarea no encontrada');
    await task.destroy();
    return { message: 'Tarea eliminada correctamente' };
  }

  static async toggleStatus(taskId: string, userId: string, status: string) {
    const task = await Task.findOne({ where: { id: taskId, user_id: userId } });
    if (!task) throw new Error('Tarea no encontrada');
    await task.update({ status: status as any });
    return this.getById(taskId, userId);
  }

  // Subtasks
  static async addSubtask(taskId: string, userId: string, title: string) {
    const task = await Task.findOne({ where: { id: taskId, user_id: userId } });
    if (!task) throw new Error('Tarea no encontrada');

    const subtask = await Subtask.create({ task_id: taskId, title });
    return subtask;
  }

  static async toggleSubtask(subtaskId: string, userId: string) {
    const subtask = await Subtask.findByPk(subtaskId, {
      include: [{ model: Task, as: 'task' }],
    });
    if (!subtask) throw new Error('Subtarea no encontrada');

    const task = (subtask as any).task;
    if (task.user_id !== userId) throw new Error('No autorizado');

    await subtask.update({ is_completed: !subtask.is_completed });

    // Check if all subtasks are completed -> auto-update parent task
    const allSubtasks = await Subtask.findAll({ where: { task_id: subtask.task_id } });
    const allCompleted = allSubtasks.every(s => s.id === subtaskId ? !subtask.is_completed : s.is_completed);

    // If toggling ON and all completed, move task to REVIEW
    if (!subtask.is_completed && allCompleted) {
      await Task.update({ status: 'REVIEW' }, { where: { id: subtask.task_id } });
    }

    return subtask;
  }

  static async deleteSubtask(subtaskId: string, userId: string) {
    const subtask = await Subtask.findByPk(subtaskId, {
      include: [{ model: Task, as: 'task' }],
    });
    if (!subtask) throw new Error('Subtarea no encontrada');

    const task = (subtask as any).task;
    if (task.user_id !== userId) throw new Error('No autorizado');

    await subtask.destroy();
    return { message: 'Subtarea eliminada correctamente' };
  }

  // Comments
  static async addComment(taskId: string, userId: string, content: string) {
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) throw new Error('Tarea no encontrada');

    const comment = await TaskComment.create({ task_id: taskId, user_id: userId, content });
    // Recuperar el comentario con el usuario asociado
    const { User } = require('../auth/user.model');
    const commentWithUser = await TaskComment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        as: 'commentUser',
        attributes: ['id', 'full_name', 'avatar_url']
      }]
    });
    return commentWithUser;
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await TaskComment.findOne({ where: { id: commentId, user_id: userId } });
    if (!comment) throw new Error('Comentario no encontrado');
    await comment.destroy();
    return { message: 'Comentario eliminado correctamente' };
  }

  // Dashboard summary
  static async getDaySummary(userId: string, date: string) {
    const tasks = await this.getByDate(userId, date);
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'DONE').length;
    const pending = total - completed;

    return { total, completed, pending, date };
  }
}
