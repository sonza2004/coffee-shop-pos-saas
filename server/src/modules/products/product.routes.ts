import { Router } from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from './product.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

// =========================
// PUBLIC
// =========================
router.get('/', getProducts);

// =========================
// ADMIN ONLY
// =========================
router.post('/', authenticate, authorize(['admin']), createProduct);
router.put('/:id', authenticate, authorize(['admin']), updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), deleteProduct);

export default router;
