import { Router, type RequestHandler } from 'express';
import { NotificationController } from './notification.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router: Router = Router();

router.use(authMiddleware as RequestHandler);

router.get('/', NotificationController.getAll as RequestHandler);
router.get('/unread-count', NotificationController.getUnreadCount as RequestHandler);
router.post('/generate', NotificationController.generate as RequestHandler);
router.patch('/read-all', NotificationController.markAllAsRead as RequestHandler);
router.patch('/:id/read', NotificationController.markAsRead as RequestHandler);
router.delete('/all', NotificationController.deleteAll as RequestHandler);
router.delete('/:id', NotificationController.delete as RequestHandler);

export default router;
