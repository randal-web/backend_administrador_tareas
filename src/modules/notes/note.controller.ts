import { Request, Response } from 'express';
import { NoteService } from './note.service';

export class NoteController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const note = await NoteService.create(req.user!.id, req.body);
      res.status(201).json(note);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const notes = await NoteService.getAll(req.user!.id);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const note = await NoteService.getById(req.params.id, req.user!.id);
      res.json(note);
    } catch (error: any) {
      if (error?.status === 404 || error?.name === 'NotFoundError') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const note = await NoteService.update(req.params.id, req.user!.id, req.body);
      res.json(note);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await NoteService.delete(req.params.id, req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async togglePin(req: Request, res: Response): Promise<void> {
    try {
      const note = await NoteService.togglePin(req.params.id, req.user!.id);
      res.json(note);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async toggleImportant(req: Request, res: Response): Promise<void> {
    try {
      const note = await NoteService.toggleImportant(req.params.id, req.user!.id);
      res.json(note);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getImportant(req: Request, res: Response): Promise<void> {
    try {
      const notes = await NoteService.getImportant(req.user!.id);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
