import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHealthService } from './health.service.js';

describe('healthService', () => {
  const fixedTime = 1700000000000;
  const fakeClock = { now: () => fixedTime };

  it('returns connected when repo says readyState 1', () => {
    const fakeRepo = { getConnectionState: () => 1 };
    const service = createHealthService({ repo: fakeRepo, clock: fakeClock });
    const result = service.getHealth();

    assert.equal(result.status, 'connected');
    assert.equal(result.db, 'connected');
    assert.equal(result.httpStatus, 200);
    assert.equal(result.timestamp, fixedTime);
    assert.equal(typeof result.uptime, 'number');
  });

  it('returns disconnected when repo says readyState 0', () => {
    const fakeRepo = { getConnectionState: () => 0 };
    const service = createHealthService({ repo: fakeRepo, clock: fakeClock });
    const result = service.getHealth();

    assert.equal(result.status, 'disconnected');
    assert.equal(result.httpStatus, 503);
  });
});
