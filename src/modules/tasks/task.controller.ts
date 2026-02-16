import { Request, Response } from 'express';
import { TaskService } from './task.service';

export class TaskController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await TaskService.create(req.user!.id, req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await TaskService.getById(req.params.id as string as string, req.user!.id);
      res.json(task);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getByDate(req: Request, res: Response): Promise<void> {
    try {
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const tasks = await TaskService.getByDate(req.user!.id, date);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUpcoming(req: Request, res: Response): Promise<void> {
    try {
      const fromDate = req.query.from as string || new Date().toISOString().split('T')[0];
      const days = parseInt(req.query.days as string) || 7;
      const tasks = await TaskService.getUpcoming(req.user!.id, fromDate, days);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        category: req.query.category as string,
        status: req.query.status as string,
        project_id: req.query.project_id as string,
        priority: req.query.priority as string,
      };
      const tasks = await TaskService.getAll(req.user!.id, filters);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await TaskService.update(req.params.id as string as string, req.user!.id, req.body);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await TaskService.delete(req.params.id as string as string, req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async toggleStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const task = await TaskService.toggleStatus(req.params.id as string as string, req.user!.id, status);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Subtasks
  static async addSubtask(req: Request, res: Response): Promise<void> {
    try {
      const subtask = await TaskService.addSubtask(req.params.id as string as string, req.user!.id, req.body.title);
      res.status(201).json(subtask);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async toggleSubtask(req: Request, res: Response): Promise<void> {
    try {
      const subtask = await TaskService.toggleSubtask(req.params.subtaskId as string as string, req.user!.id);
      res.json(subtask);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteSubtask(req: Request, res: Response): Promise<void> {
    try {
      const result = await TaskService.deleteSubtask(req.params.subtaskId as string as string, req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // Comments
  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const comment = await TaskService.addComment(req.params.id as string as string, req.user!.id, req.body.content);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const result = await TaskService.deleteComment(req.params.commentId as string as string, req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // Dashboard summary
  static async getDaySummary(req: Request, res: Response): Promise<void> {
    try {
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const summary = await TaskService.getDaySummary(req.user!.id, date);
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
