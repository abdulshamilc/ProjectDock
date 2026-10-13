import { AppError } from '../errors.js';

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(req, res, next) {
  const error = new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND');
  next(error);
}

/**
 * Central error handler. Maps domain errors to JSON responses.
 * Express requires the 4-arg signature to recognise this as an error handler.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err instanceof AppError ? err.status : 500;
  const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR';
  const message = err instanceof AppError ? err.message : 'An unexpected error occurred';

  if (status === 500) {
    console.error('Unhandled error:', err);
  }

  res.status(status).json({ message, code });
}
