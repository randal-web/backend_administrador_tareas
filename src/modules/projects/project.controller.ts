import { Request, Response } from 'express';
import { ProjectService } from './project.service';

export class ProjectController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectService.create(req.user!.id, req.body);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await ProjectService.getAll(req.user!.id);
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectService.getById(req.params.id as string as string, req.user!.id);
      res.json(project);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectService.update(req.params.id as string as string, req.user!.id, req.body);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await ProjectService.delete(req.params.id as string as string, req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getProjectTasks(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as string | undefined;
      const tasks = await ProjectService.getProjectTasks(req.params.id as string as string, req.user!.id, status);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getProjectBoard(req: Request, res: Response): Promise<void> {
    try {
      const board = await ProjectService.getProjectBoard(req.params.id as string as string, req.user!.id);
      res.json(board);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getProjectGantt(req: Request, res: Response): Promise<void> {
    try {
      const gantt = await ProjectService.getProjectGantt(req.params.id as string as string, req.user!.id);
      res.json(gantt);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
