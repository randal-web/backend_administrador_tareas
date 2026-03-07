import { Request, Response } from 'express';
import { ReminderService } from './reminder.service';

export class ReminderController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const reminder = await ReminderService.create(req.user!.id, req.body);
      res.status(201).json(reminder);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const reminders = await ReminderService.getAll(req.user!.id);
      res.json(reminders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getArchived(req: Request, res: Response): Promise<void> {
    try {
      const reminders = await ReminderService.getArchived(req.user!.id);
      res.json(reminders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const reminder = await ReminderService.getById(req.params.id, req.user!.id);
      res.json(reminder);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const reminder = await ReminderService.update(req.params.id, req.user!.id, req.body);
      res.json(reminder);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await ReminderService.delete(req.params.id, req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async toggleComplete(req: Request, res: Response): Promise<void> {
    try {
      const reminder = await ReminderService.toggleComplete(req.params.id, req.user!.id);
      res.json(reminder);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
