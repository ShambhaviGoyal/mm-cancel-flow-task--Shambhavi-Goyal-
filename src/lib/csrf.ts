// lib/csrf.ts
import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'csrf_token';

export function getOrSetCsrf() {
  const bag = cookies();
  const existing = bag.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const token = crypto.randomBytes(16).toString('hex');
  bag.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/' });
  return token;
}

export function verifyCsrf(submitted: string | null | undefined) {
  const bag = cookies();
  const expected = bag.get(COOKIE_NAME)?.value;
  if (!expected || !submitted || submitted !== expected) {
    throw new Error('Bad CSRF token');
  }
}
