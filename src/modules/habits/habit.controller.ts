import { Request, Response } from 'express';
import { HabitService } from './habit.service';

export class HabitController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const habit = await HabitService.create(req.user!.id, req.body);
      res.status(201).json(habit);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const habits = await HabitService.getAll(req.user!.id);
      res.json(habits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const habit = await HabitService.getById(req.params.id as string as string, req.user!.id);
      res.json(habit);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const habit = await HabitService.update(req.params.id as string as string, req.user!.id, req.body);
      res.json(habit);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await HabitService.delete(req.params.id as string as string, req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getWeekly(req: Request, res: Response): Promise<void> {
    try {
      const weekStart = req.query.week_start as string | undefined;
      const habits = await HabitService.getWeeklyHabits(req.user!.id, weekStart);
      res.json(habits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async toggleLog(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.body;
      if (!date) {
        res.status(400).json({ message: 'La fecha es requerida' });
        return;
      }
      const result = await HabitService.toggleLog(req.params.id as string as string, req.user!.id, date);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
