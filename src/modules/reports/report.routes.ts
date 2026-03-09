import { Router, type RequestHandler } from 'express';
import * as ReportController from './report.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router: Router = Router();

router.use(authMiddleware as RequestHandler);

router.get('/', ReportController.getAll as RequestHandler);
router.post('/', ReportController.create as RequestHandler);
router.delete('/:id', ReportController.deleteReport as RequestHandler);

export default router;
