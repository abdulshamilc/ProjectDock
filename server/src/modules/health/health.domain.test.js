import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mapConnectionState } from './domain/healthStatus.js';

describe('healthStatus domain', () => {
  it('returns connected / 200 for readyState 1', () => {
    const result = mapConnectionState(1);
    assert.equal(result.status, 'connected');
    assert.equal(result.httpStatus, 200);
  });

  it('returns disconnected / 503 for readyState 0', () => {
    const result = mapConnectionState(0);
    assert.equal(result.status, 'disconnected');
    assert.equal(result.httpStatus, 503);
  });

  it('returns connecting / 503 for readyState 2', () => {
    const result = mapConnectionState(2);
    assert.equal(result.status, 'connecting');
    assert.equal(result.httpStatus, 503);
  });

  it('returns unknown / 503 for unrecognised state', () => {
    const result = mapConnectionState(99);
    assert.equal(result.status, 'unknown');
    assert.equal(result.httpStatus, 503);
  });
});
