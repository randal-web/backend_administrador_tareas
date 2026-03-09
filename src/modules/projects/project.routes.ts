import { Router, type RequestHandler } from 'express';
import { ProjectController } from './project.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { activeUserMiddleware } from '../../middleware/active-user.middleware';
import { auditMiddleware } from '../../middleware/audit.middleware';

const router: Router = Router();

router.use(authMiddleware as RequestHandler);
router.use(activeUserMiddleware as any);
router.use(auditMiddleware as any);

router.post('/', ProjectController.create as RequestHandler);
router.get('/', ProjectController.getAll as RequestHandler);
router.get('/:id', ProjectController.getById as RequestHandler);
router.put('/:id', ProjectController.update as RequestHandler);
router.delete('/:id', ProjectController.delete as RequestHandler);
router.get('/:id/tasks', ProjectController.getProjectTasks as RequestHandler);
router.get('/:id/board', ProjectController.getProjectBoard as RequestHandler);
router.get('/:id/gantt', ProjectController.getProjectGantt as RequestHandler);

export default router;
