import { Router } from 'express';
import { getAllUsers, updateUserPermissions, getAuditLogs } from './admin.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router: Router = Router();

// All routes require authentication and admin role
router.use(authMiddleware as any);
router.use(adminMiddleware as any);

router.get('/users', getAllUsers);
router.patch('/users/:id/permissions', updateUserPermissions);

// Audit & Activity
router.get('/audit', getAuditLogs);

export default router;
