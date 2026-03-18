import { Request, Response } from 'express';
import { GoalService } from './goal.service';

export class GoalController {
  static async create(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

      const goal = await GoalService.create({ ...req.body, user_id });
      res.status(201).json(goal);
    } catch (error: any) {
      console.error('Error in GoalController:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

      const goals = await GoalService.findAllByUser(user_id);
      res.json(goals);
    } catch (error: any) {
      console.error('Error in GoalController:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user_id = req.user?.id;
      if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

      const goal = await GoalService.update(id, user_id, req.body);
      if (!goal) return res.status(404).json({ message: 'Goal not found' });

      res.json(goal);
    } catch (error: any) {
      console.error('Error in GoalController:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user_id = req.user?.id;
      if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

      const success = await GoalService.delete(id, user_id);
      if (!success) return res.status(404).json({ message: 'Goal not found' });

      res.status(204).send();
    } catch (error: any) {
      console.error('Error in GoalController:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async toggle(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user_id = req.user?.id;
      if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

      const goal = await GoalService.toggleCompletion(id, user_id);
      if (!goal) return res.status(404).json({ message: 'Goal not found' });

      res.json(goal);
    } catch (error: any) {
      console.error('Error in GoalController:', error);
      res.status(500).json({ message: error.message });
    }
  }
}
