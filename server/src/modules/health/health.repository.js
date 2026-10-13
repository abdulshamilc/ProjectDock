import mongoose from 'mongoose';

/**
 * Repository layer — the ONLY place that touches Mongoose in this module.
 * Returns plain data, never Mongoose documents.
 */
export function createHealthRepository() {
  return {
    getConnectionState() {
      return mongoose.connection.readyState;
    },
  };
}
