/**
 * Pure domain function. No framework or DB imports.
 * Maps a Mongoose connection readyState integer to a status descriptor.
 *
 * readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */

const STATE_MAP = {
  0: { status: 'disconnected', httpStatus: 503 },
  1: { status: 'connected', httpStatus: 200 },
  2: { status: 'connecting', httpStatus: 503 },
  3: { status: 'disconnecting', httpStatus: 503 },
};

export function mapConnectionState(readyState) {
  return STATE_MAP[readyState] ?? { status: 'unknown', httpStatus: 503 };
}
