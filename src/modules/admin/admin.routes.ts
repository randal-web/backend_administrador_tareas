import { Router } from 'express';
import { getAllUsers, updateUserPermissions } from './admin.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router = Router();

router.use(authMiddleware as any);
router.use(adminMiddleware);

router.get('/users', getAllUsers);
router.patch('/users/:id/permissions', updateUserPermissions);

export default router;