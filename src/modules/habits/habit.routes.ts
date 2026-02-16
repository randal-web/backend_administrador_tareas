import { Router, type RequestHandler } from 'express';
import { HabitController } from './habit.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router: Router = Router();

router.use(authMiddleware as RequestHandler);

router.post('/', HabitController.create as RequestHandler);
router.get('/', HabitController.getAll as RequestHandler);
router.get('/weekly', HabitController.getWeekly as RequestHandler);
router.get('/:id', HabitController.getById as RequestHandler);
router.put('/:id', HabitController.update as RequestHandler);
router.delete('/:id', HabitController.delete as RequestHandler);
router.post('/:id/toggle', HabitController.toggleLog as RequestHandler);

export default router;
