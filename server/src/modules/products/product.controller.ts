import { Request, Response } from 'express';
import {
  getProductsService,
  createProductService,
  updateProductService
} from './product.service';

interface AuthRequest extends Request {
  user?: any;
}

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await getProductsService();
    return res.json({ data: products });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function createProduct(req: AuthRequest, res: Response) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const product = await createProductService(req.body);
    return res.json({ data: product });
  } catch {
    return res.status(500).json({ error: 'Failed to create product' });
  }
}

export async function updateProduct(req: AuthRequest, res: Response) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;
    const product = await updateProductService(id, req.body);

    return res.json({ data: product });
  } catch {
    return res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function deleteProduct(req: AuthRequest, res: Response) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;

    const product = await updateProductService(id, {
      isActive: false
    });

    return res.json({ data: product });
  } catch {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
}
