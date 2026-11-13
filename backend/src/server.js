import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import prisma from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Render / Cloudflare deployments
app.set('trust proxy', 1);

// HTTP Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Allow configured origins or any verified cloudflare pages URL
    if (
      allowedOrigins.includes(origin) || 
      origin.endsWith('.pages.dev') ||
      origin.includes('modera')
    ) {
      return callback(null, true);
    }
    
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error('Cross-Origin Request Blocked: Origin not authorized by MODÉRA Security Policy.'));
    }

    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Request Logger
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all standard API routes
app.use('/api', apiLimiter);

// OpenAPI / Swagger Documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.warn('[Swagger] Documentation file openapi.yaml not loaded or formatted.');
}

// Mount Main API Router
app.use('/api', routes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    brand: 'MODÉRA Luxury Fashion',
    tagline: 'Artisanal Elegance. Modern Silhouette.',
    status: 'ONLINE',
    docs: '/api/docs',
    health: '/api/health',
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  MODÉRA Luxury Fashion API Server Active`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  API Base: http://localhost:${PORT}/api`);
  console.log(`  Swagger Docs: http://localhost:${PORT}/api/docs`);
  console.log(`====================================================`);
});

// Graceful Process Termination
const handleGracefulShutdown = async (signal) => {
  console.log(`[MODÉRA] Received ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('[MODÉRA] Database connections closed cleanly.');
      process.exit(0);
    } catch (err) {
      console.error('[MODÉRA] Error during database disconnect:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

export default app;

