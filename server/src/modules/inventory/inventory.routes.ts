import { Router } from 'express';
import { getInventory, adjustInventory } from './inventory.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

// =========================
// INVENTORY LOGS
// =========================
router.get('/', authenticate, authorize(['admin', 'staff']), getInventory);

// =========================
// STOCK ADJUSTMENT
// =========================
router.post('/adjust', authenticate, authorize(['admin']), adjustInventory);

export default router;
