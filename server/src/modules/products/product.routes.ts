import { Router } from 'express';
import { getProducts, createProduct, updateProduct } from './product.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

// =========================
// PUBLIC / BASIC ACCESS
// =========================
router.get('/', getProducts);

// =========================
// ADMIN ONLY
// =========================
router.post('/', authenticate, authorize(['admin']), createProduct);
router.put('/:id', authenticate, authorize(['admin']), updateProduct);

export default router;
