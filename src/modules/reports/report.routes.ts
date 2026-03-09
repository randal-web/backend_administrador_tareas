import { Router } from 'express';
import { getReports, createReport, deleteReport } from './report.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { betaTesterMiddleware } from '../../middleware/beta-tester.middleware';

const router: Router = Router();

router.use(authMiddleware as any);
router.use(betaTesterMiddleware);

router.get('/', getReports);
router.post('/', createReport);
router.delete('/:id', deleteReport);

export default router;