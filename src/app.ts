import express, { type Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/error.middleware';
import { setupPassport } from './modules/auth/passport.config';

// Routes
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/tasks/task.routes';
import projectRoutes from './modules/projects/project.routes';
import habitRoutes from './modules/habits/habit.routes';

const app: Application = express();

// Trust proxy (Railway runs behind a proxy)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Logging
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: config.nodeEnv === 'production' ? 100 : 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta de nuevo más tarde.' },
});
app.use('/api/', limiter);

// Auth-specific stricter rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: config.nodeEnv === 'production' ? 20 : 200,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de autenticación, intenta de nuevo más tarde.' },
});

// CORS — Frontend (Vercel) and Backend (Railway) are on different domains
const allowedOrigins = config.nodeEnv === 'production'
  ? [config.frontendUrl]
  : [config.frontendUrl, 'http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport
setupPassport();
app.use(passport.initialize());

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/habits', habitRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use(errorHandler);

export default app;
