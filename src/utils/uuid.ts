// File: src/utils/uuid.ts

/**
 * Generates a UUID string. Uses crypto.randomUUID() where available,
 * falls back to a Math.random()-based implementation for older browsers.
 *
 * Note: crypto.randomUUID() requires a secure context (HTTPS) and is
 * available in all modern browsers since ~2021. The fallback is NOT
 * cryptographically secure but sufficient for local-only IDs.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: RFC4122-like v4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
