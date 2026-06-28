/**
 * Helper utility to escape HTML tags to prevent XSS (Cross-Site Scripting) attacks.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Recursively sanitize all string properties in a request body/object.
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result = (Array.isArray(obj) ? [] : {}) as any;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (typeof val === 'string') {
        result[key] = escapeHtml(val).trim();
      } else if (typeof val === 'object' && val !== null) {
        result[key] = sanitizeObject(val);
      } else {
        result[key] = val;
      }
    }
  }

  return result as T;
}
