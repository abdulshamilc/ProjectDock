import { mapConnectionState } from './domain/healthStatus.js';

/**
 * Use-case layer. Dependencies are injected via factory — no express, no mongoose.
 */
export function createHealthService({ repo, clock = Date }) {
  return {
    getHealth() {
      const readyState = repo.getConnectionState();
      const { status, httpStatus } = mapConnectionState(readyState);

      return {
        status,
        httpStatus,
        db: status,
        uptime: process.uptime(),
        timestamp: clock.now(),
      };
    },
  };
}
