// app/cancel/start/page.tsx
import { redirect } from 'next/navigation';
import { ensureActiveCancellation } from '@/lib/flow';

export default async function Start() {
  await ensureActiveCancellation();
  redirect('/cancel/reason');
}
