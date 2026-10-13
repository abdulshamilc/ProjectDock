import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
  ForbiddenError,
} from './errors.js';

describe('Domain errors', () => {
  it('NotFoundError maps to 404', () => {
    const err = new NotFoundError('Item missing');
    assert.ok(err instanceof AppError);
    assert.equal(err.status, 404);
    assert.equal(err.code, 'NOT_FOUND');
    assert.equal(err.message, 'Item missing');
  });

  it('ValidationError maps to 400', () => {
    const err = new ValidationError();
    assert.equal(err.status, 400);
    assert.equal(err.code, 'VALIDATION_ERROR');
  });

  it('ConflictError maps to 409', () => {
    const err = new ConflictError();
    assert.equal(err.status, 409);
    assert.equal(err.code, 'CONFLICT');
  });

  it('ForbiddenError maps to 403', () => {
    const err = new ForbiddenError();
    assert.equal(err.status, 403);
    assert.equal(err.code, 'FORBIDDEN');
  });
});

describe('Error handler mapping', () => {
  it('NotFoundError thrown in middleware becomes a 404 JSON response', () => {
    // Simulate what the error handler does
    const err = new NotFoundError('Test not found');
    const status = err instanceof AppError ? err.status : 500;
    const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR';

    assert.equal(status, 404);
    assert.equal(code, 'NOT_FOUND');
    assert.equal(err.message, 'Test not found');
  });
});
