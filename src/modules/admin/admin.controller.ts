import { Request, Response } from 'express';
import { User } from '../auth/user.model';
import { AuditLog } from './audit-log.model';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'full_name', 'role', 'is_beta_tester', 'is_active', 'last_active_at', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    const fixedUsers = users.map(u => {
      const userJSON = u.toJSON() as any;
      // Fallback for activity
      if (!userJSON.last_active_at) {
        userJSON.last_active_at = userJSON.created_at;
      }
      return userJSON;
    });

    res.json(fixedUsers);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

export const updateUserPermissions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_beta_tester, role, is_active } = req.body;

    const user = await User.findByPk(id as string);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    await user.update({ is_beta_tester, role, is_active });
    res.json({ message: 'Usuario actualizado correctamente', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { user_id, module, limit = 50 } = req.query;
    const where: any = {};
    
    if (user_id) where.user_id = user_id;
    if (module) where.module = module;

    const logs = await AuditLog.findAll({
      where,
      limit: Number(limit),
      order: [['created_at', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'full_name', 'email', 'avatar_url']
      }]
    });
    
    // Ensure created_at is always present in the JSON response
    const fixedLogs = logs.map(log => {
      const logJSON = log.toJSON() as any;
      // If Sequelize used 'createdAt' internally despite the config, we map it to 'created_at'
      if (!logJSON.created_at && logJSON.createdAt) {
        logJSON.created_at = logJSON.createdAt;
      }
      return logJSON;
    });
    
    res.json(fixedLogs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener logs', error: error.message });
  }
};
