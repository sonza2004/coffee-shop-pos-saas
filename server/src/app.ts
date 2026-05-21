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

dotenv.config();

const app = express();

// =========================
// Core Middleware
// =========================
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// =========================
// Health Check
// =========================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'coffee-pos-api' });
});

// =========================
// Module Routes
// =========================
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/payments', paymentRoutes);
app.use('/orders', orderRoutes);

// =========================
// TODO: Future Modules
// =========================
// app.use('/finance', financeRoutes);

// =========================
// Error Handler
// =========================
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal Server Error'
  });
});

export default app;
