import { Router } from 'express';
import { getMyNotifications, markRead, deleteNotif, sendGlobalNotification } from './notification.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

router.get('/', getMyNotifications);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotif);

// Admin-only (In a real app, check for is_admin)
router.post('/global', sendGlobalNotification);

export default router;