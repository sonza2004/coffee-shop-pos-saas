import { Router } from 'express';
import { uploadSlip, approvePayment, rejectPayment } from './payment.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

// =========================
// CUSTOMER UPLOAD
// =========================
router.post('/slip', authenticate, authorize(['customer', 'staff', 'admin']), uploadSlip);

// =========================
// ADMIN REVIEW
// =========================
router.patch('/:id/approve', authenticate, authorize(['admin']), approvePayment);
router.patch('/:id/reject', authenticate, authorize(['admin']), rejectPayment);

export default router;
