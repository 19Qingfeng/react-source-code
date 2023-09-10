export function schedulerCallback(callback) {
  requestIdleCallback(callback);
}
