import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Routes
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import paymentRoutes from './modules/payments/payment.routes';
import orderRoutes from './modules/orders/order.routes';
import financeRoutes from './modules/finance/finance.routes';
import { AppError } from './utils/appError';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'coffee-pos-api' });
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/payments', paymentRoutes);
app.use('/orders', orderRoutes);
app.use('/finance', financeRoutes);

// =========================
// ERROR HANDLER (FINAL)
// =========================
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  return res.status(500).json({
    error: {
      message: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    },
  });
});

export default app;
