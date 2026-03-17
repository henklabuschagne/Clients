// ─── Form Validation Utilities ─────────────────────────
// Reusable validators for inline form fields across all sections.

export type ValidationResult = { valid: true } | { valid: false; message: string };

export function validateEmail(value: string): ValidationResult {
  if (!value) return { valid: true }; // empty is handled by required check
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) return { valid: false, message: 'Invalid email format' };
  return { valid: true };
}

export function validateIPAddress(value: string): ValidationResult {
  if (!value) return { valid: true };
  // IPv4
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4.test(value)) {
    const parts = value.split('.').map(Number);
    if (parts.every(p => p >= 0 && p <= 255)) return { valid: true };
    return { valid: false, message: 'Each octet must be 0-255' };
  }
  // IPv6 (simplified)
  const ipv6 = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  if (ipv6.test(value)) return { valid: true };
  return { valid: false, message: 'Invalid IP address format' };
}

export function validateHostnameOrIP(value: string): ValidationResult {
  if (!value) return { valid: true };
  // Allow IP addresses
  const ipResult = validateIPAddress(value);
  if (ipResult.valid) return { valid: true };
  // Allow hostnames/domains
  const hostname = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
  if (hostname.test(value)) return { valid: true };
  return { valid: false, message: 'Invalid hostname or IP address' };
}

export function validatePort(value: string): ValidationResult {
  if (!value) return { valid: true };
  const port = parseInt(value, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    return { valid: false, message: 'Port must be 1-65535' };
  }
  return { valid: true };
}

export function validateUrl(value: string): ValidationResult {
  if (!value) return { valid: true };
  try {
    new URL(value);
    return { valid: true };
  } catch {
    return { valid: false, message: 'Invalid URL format' };
  }
}

export function validatePhone(value: string): ValidationResult {
  if (!value) return { valid: true };
  // Allow digits, spaces, dashes, parens, plus sign, dots
  const pattern = /^[+]?[\d\s\-().]{7,20}$/;
  if (!pattern.test(value)) return { valid: false, message: 'Invalid phone format' };
  return { valid: true };
}

export function validateRequired(value: string | undefined | null, label: string): ValidationResult {
  if (!value || !value.trim()) return { valid: false, message: `${label} is required` };
  return { valid: true };
}

export function validateVersion(value: string): ValidationResult {
  if (!value) return { valid: true };
  // Allow semver-like: v1.0.0, 1.0.0, 2.5, etc.
  const pattern = /^v?\d+(\.\d+)*([.-][a-zA-Z0-9]+)*$/;
  if (!pattern.test(value)) return { valid: false, message: 'Invalid version format (e.g. 1.0.0)' };
  return { valid: true };
}

/** Run all validators, returning the first error or valid */
export function validate(value: string, ...validators: ((v: string) => ValidationResult)[]): ValidationResult {
  for (const v of validators) {
    const result = v(value);
    if (!result.valid) return result;
  }
  return { valid: true };
}
