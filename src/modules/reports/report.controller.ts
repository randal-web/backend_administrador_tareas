import { Request, Response } from 'express';
import Report from './report.model';

export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const reports = await Report.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener reportes', error: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const report = await Report.create({ ...req.body, user_id: userId });
    res.status(201).json(report);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear reporte', error: error.message });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const report = await Report.findOne({ where: { id, user_id: userId } });
    
    if (!report) {
      res.status(404).json({ message: 'Reporte no encontrado' });
      return;
    }

    await report.destroy();
    res.json({ message: 'Reporte eliminado' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al eliminar reporte', error: error.message });
  }
};
