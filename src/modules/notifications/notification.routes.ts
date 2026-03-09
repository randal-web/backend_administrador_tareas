import { Router } from 'express';
import { getMyNotifications, markRead, deleteNotif, sendGlobalNotification } from './notification.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { activeUserMiddleware } from '../../middleware/active-user.middleware';
import { auditMiddleware } from '../../middleware/audit.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router: Router = Router();

router.use(authMiddleware as any);
router.use(activeUserMiddleware as any);
router.use(auditMiddleware as any);

router.get('/', getMyNotifications);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotif);

// Admin-only protection
router.post('/global', adminMiddleware as any, sendGlobalNotification);

export default router;
