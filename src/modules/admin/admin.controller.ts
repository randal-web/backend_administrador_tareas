import { Request, Response } from 'express';
import { User } from '../auth/user.model';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'full_name', 'role', 'is_beta_tester', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

export const updateUserPermissions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_beta_tester, role } = req.body;
    
    const user = await User.findByPk(id as string);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    await user.update({ is_beta_tester, role });
    res.json({ message: 'Permisos actualizados correctamente', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al actualizar permisos', error: error.message });
  }
};