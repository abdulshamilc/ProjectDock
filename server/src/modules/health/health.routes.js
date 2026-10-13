import { Router } from 'express';

export function createHealthRouter(healthController) {
  const router = Router();

  router.get('/', (req, res) => healthController.getHealth(req, res));

  return router;
}
