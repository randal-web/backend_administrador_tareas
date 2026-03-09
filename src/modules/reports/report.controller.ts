import { Request, Response } from 'express';
import { ReportService } from './report.service';

export const getReports = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    console.log('Fetching reports for user:', userId);
    const reports = await ReportService.getAllByUserId(userId);
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ 
      message: 'Error al obtener los reportes', 
      error: (error as any).message,
      stack: process.env.NODE_ENV === 'development' ? (error as any).stack : undefined
    });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    console.log('Creating report for user:', userId, 'Body:', req.body);
    const report = await ReportService.create(userId, req.body);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ 
      message: 'Error al crear el reporte', 
      error: (error as any).message,
      stack: process.env.NODE_ENV === 'development' ? (error as any).stack : undefined
    });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    console.log('Deleting report:', id, 'for user:', userId);
    const success = await ReportService.delete(userId, id as string);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Reporte no encontrado' });
    }
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el reporte', 
      error: (error as any).message 
    });
  }
};