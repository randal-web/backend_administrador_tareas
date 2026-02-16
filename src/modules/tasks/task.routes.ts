import { Router, type RequestHandler } from 'express';
import { TaskController } from './task.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router: Router = Router();

router.use(authMiddleware as RequestHandler);

// Tasks CRUD
router.post('/', TaskController.create as RequestHandler);
router.get('/', TaskController.getAll as RequestHandler);
router.get('/date', TaskController.getByDate as RequestHandler);
router.get('/upcoming', TaskController.getUpcoming as RequestHandler);
router.get('/summary', TaskController.getDaySummary as RequestHandler);
router.get('/:id', TaskController.getById as RequestHandler);
router.put('/:id', TaskController.update as RequestHandler);
router.delete('/:id', TaskController.delete as RequestHandler);
router.patch('/:id/status', TaskController.toggleStatus as RequestHandler);

// Subtasks
router.post('/:id/subtasks', TaskController.addSubtask as RequestHandler);
router.patch('/:id/subtasks/:subtaskId/toggle', TaskController.toggleSubtask as RequestHandler);
router.delete('/:id/subtasks/:subtaskId', TaskController.deleteSubtask as RequestHandler);

// Comments
router.post('/:id/comments', TaskController.addComment as RequestHandler);
router.delete('/:id/comments/:commentId', TaskController.deleteComment as RequestHandler);

export default router;
