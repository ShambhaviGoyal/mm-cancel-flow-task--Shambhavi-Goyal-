// lib/ab.ts
import crypto from 'crypto';

export type Variant = 'A' | 'B';

// Secure 50/50 split using Node crypto (server-side only)
export function assignVariant(): Variant {
  // 0 or 1 with equal probability
  const n = crypto.randomInt(0, 2);
  return n === 0 ? 'A' : 'B';
}
