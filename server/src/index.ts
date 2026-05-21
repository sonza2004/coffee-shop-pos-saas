import dotenv from 'dotenv';
import app from './app';

// =========================
// Environment Setup
// =========================
dotenv.config();

const PORT = process.env.PORT || 4000;

// =========================
// Server Start
// =========================
const server = app.listen(PORT, () => {
  console.log(`🚀 Coffee POS API running on port ${PORT}`);
});

// =========================
// Graceful Shutdown
// =========================
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});
