import { Router, type RequestHandler } from 'express';
import { NoteController } from './note.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router: Router = Router();

router.use(authMiddleware as RequestHandler);

router.post('/', NoteController.create as RequestHandler);
router.get('/', NoteController.getAll as RequestHandler);
router.get('/:id', NoteController.getById as RequestHandler);
router.put('/:id', NoteController.update as RequestHandler);
router.delete('/:id', NoteController.delete as RequestHandler);
router.patch('/:id/pin', NoteController.togglePin as RequestHandler);

export default router;
