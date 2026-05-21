import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load env
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
// TODO: Route Modules
// =========================
// app.use('/auth', authRoutes);
// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);
// app.use('/payments', paymentRoutes);
// app.use('/inventory', inventoryRoutes);
// app.use('/finance', financeRoutes);

// =========================
// Error Handler (basic)
// =========================
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal Server Error'
  });
});

export default app;
