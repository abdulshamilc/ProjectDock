import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env.js';
import { notFoundHandler, errorHandler } from './shared/middleware/errorHandler.js';
import { createContainer } from './container.js';

export function createApp() {
  const app = express();
  const { routers } = createContainer();

  // --- Global middleware ---
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());

  if (!env.isTest) {
    app.use(morgan('dev'));
  }

  // --- Routes ---
  app.use('/api/v1/health', routers.health);

  // --- Error handling ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
