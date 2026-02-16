import { Project, ProjectCreationAttributes } from './project.model';
import { Task } from '../tasks/task.model';
import { Subtask } from '../tasks/subtask.model';
import { Op } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProjectService {
  static async create(userId: string, data: Partial<ProjectCreationAttributes>) {
    const project = await Project.create({
      ...data,
      user_id: userId,
      name: data.name!,
    });
    return project;
  }

  static async getAll(userId: string) {
    const projects = await Project.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    // Add task counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.count({ where: { project_id: project.id } });
        const doneTasks = await Task.count({ where: { project_id: project.id, status: 'DONE' } });
        const pendingTasks = totalTasks - doneTasks;

        return {
          ...project.toJSON(),
          total_tasks: totalTasks,
          done_tasks: doneTasks,
          pending_tasks: pendingTasks,
        };
      })
    );

    return projectsWithCounts;
  }

  static async getById(projectId: string, userId: string) {
    const project = await Project.findOne({
      where: { id: projectId, user_id: userId },
    });
    if (!project) throw new Error('Proyecto no encontrado');

    const totalTasks = await Task.count({ where: { project_id: project.id } });
    const doneTasks = await Task.count({ where: { project_id: project.id, status: 'DONE' } });

    return {
      ...project.toJSON(),
      total_tasks: totalTasks,
      done_tasks: doneTasks,
      pending_tasks: totalTasks - doneTasks,
    };
  }

  static async update(projectId: string, userId: string, data: Partial<ProjectCreationAttributes>) {
    const project = await Project.findOne({ where: { id: projectId, user_id: userId } });
    if (!project) throw new Error('Proyecto no encontrado');
    await project.update(data);
    return this.getById(projectId, userId);
  }

  static async delete(projectId: string, userId: string) {
    const project = await Project.findOne({ where: { id: projectId, user_id: userId } });
    if (!project) throw new Error('Proyecto no encontrado');
    await project.destroy();
    return { message: 'Proyecto eliminado correctamente' };
  }

  static async getProjectTasks(projectId: string, userId: string, status?: string) {
    const project = await Project.findOne({ where: { id: projectId, user_id: userId } });
    if (!project) throw new Error('Proyecto no encontrado');

    const where: any = { project_id: projectId, user_id: userId };
    if (status) where.status = status;

    return Task.findAll({
      where,
      include: [
        { model: Subtask, as: 'subtasks' },
      ],
      order: [['status', 'ASC'], ['priority', 'DESC'], ['start_date', 'ASC']],
    });
  }

  // Get tasks grouped by status for the kanban/board view
  static async getProjectBoard(projectId: string, userId: string) {
    const project = await Project.findOne({ where: { id: projectId, user_id: userId } });
    if (!project) throw new Error('Proyecto no encontrado');

    const tasks = await Task.findAll({
      where: { project_id: projectId, user_id: userId },
      include: [{ model: Subtask, as: 'subtasks' }],
      order: [['priority', 'DESC'], ['created_at', 'ASC']],
    });

    return {
      TODO: tasks.filter(t => t.status === 'TODO'),
      IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
      REVIEW: tasks.filter(t => t.status === 'REVIEW'),
      DONE: tasks.filter(t => t.status === 'DONE'),
    };
  }

  // Gantt data: tasks with start/end dates
  static async getProjectGantt(projectId: string, userId: string) {
    const project = await Project.findOne({ where: { id: projectId, user_id: userId } });
    if (!project) throw new Error('Proyecto no encontrado');

    const tasks = await Task.findAll({
      where: {
        project_id: projectId,
        user_id: userId,
        start_date: { [Op.ne]: null },
      },
      order: [['start_date', 'ASC']],
    });

    return tasks.map(t => ({
      id: t.id,
      title: t.title,
      start_date: t.start_date,
      end_date: t.end_date || t.start_date,
      status: t.status,
      priority: t.priority,
    }));
  }
}
