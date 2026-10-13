import { EventEmitter } from 'node:events';

/**
 * Tiny in-process event bus for cross-module reactions.
 * Modules emit events (e.g. 'project.created') and other modules
 * subscribe without direct coupling.
 */
export function createEventBus() {
  const emitter = new EventEmitter();

  return {
    on(event, listener) {
      emitter.on(event, listener);
    },
    emit(event, payload) {
      emitter.emit(event, payload);
    },
    off(event, listener) {
      emitter.off(event, listener);
    },
    removeAllListeners(event) {
      emitter.removeAllListeners(event);
    },
  };
}
