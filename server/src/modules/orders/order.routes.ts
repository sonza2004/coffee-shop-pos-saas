import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from './order.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

// =========================
// CREATE ORDER (CUSTOMER)
// =========================
router.post('/', authenticate, authorize(['customer']), createOrder);

// =========================
// GET MY ORDERS
// =========================
router.get('/me', authenticate, getMyOrders);

// =========================
// GET ORDER BY ID
// =========================
router.get('/:id', authenticate, getOrderById);

export default router;
