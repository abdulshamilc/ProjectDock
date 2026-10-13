import { createEventBus } from './shared/events.js';
import {
  createHealthRepository,
  createHealthService,
  createHealthController,
  createHealthRouter,
} from './modules/health/index.js';

/**
 * Composition root — creates all repositories, services, controllers, and routers,
 * wiring dependencies in one place so the rest of the code stays decoupled.
 *
 * Planned ports (implement none yet):
 *   aiClient    — Claude API adapter
 *   tokenStore  — token persistence (MongoDB TTL index)
 *   mailer      — email sending (Nodemailer)
 *   jobQueue    — scheduled jobs (node-cron)
 *   realtime    — WebSocket push (Socket.io)
 */
export function createContainer() {
  const events = createEventBus();

  // --- Health module ---
  const healthRepo = createHealthRepository();
  const healthService = createHealthService({ repo: healthRepo, clock: Date });
  const healthController = createHealthController(healthService);
  const healthRouter = createHealthRouter(healthController);

  return {
    events,
    routers: {
      health: healthRouter,
    },
  };
}
