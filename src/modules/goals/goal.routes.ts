import { Router } from 'express';
import { GoalController } from './goal.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router: Router = Router();

router.use(authMiddleware);

router.get('/', GoalController.getAll);
router.post('/', GoalController.create);
router.put('/:id', GoalController.update);
router.delete('/:id', GoalController.delete);
router.patch('/:id/toggle', GoalController.toggle);

export default router;
