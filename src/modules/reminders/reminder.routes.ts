import { Router, type RequestHandler } from 'express';
import { ReminderController } from './reminder.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router: Router = Router();

router.use(authMiddleware as RequestHandler);

router.post('/', ReminderController.create as RequestHandler);
router.get('/', ReminderController.getAll as RequestHandler);
router.get('/archived', ReminderController.getArchived as RequestHandler);
router.get('/:id', ReminderController.getById as RequestHandler);
router.put('/:id', ReminderController.update as RequestHandler);
router.delete('/:id', ReminderController.delete as RequestHandler);
router.patch('/:id/toggle', ReminderController.toggleComplete as RequestHandler);

export default router;
