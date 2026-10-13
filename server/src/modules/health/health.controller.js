/**
 * HTTP-only layer. Parses the request, calls the service, sends the response.
 * Never imports models or repositories.
 */
export function createHealthController(healthService) {
  return {
    getHealth(req, res) {
      const health = healthService.getHealth();
      res.status(health.httpStatus).json({
        status: health.status,
        db: health.db,
        uptime: health.uptime,
        timestamp: health.timestamp,
      });
    },
  };
}
