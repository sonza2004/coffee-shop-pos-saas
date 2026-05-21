import { Router } from 'express';
import { getDailyReport, getMonthlySummary } from './finance.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

// =========================
// FINANCE REPORTING (ADMIN ONLY)
// =========================
router.get('/daily-report', authenticate, authorize(['admin']), getDailyReport);
router.get('/monthly-summary', authenticate, authorize(['admin']), getMonthlySummary);

export default router;
