// lib/flow.ts
import { supabaseAdmin } from './db';
import { MOCK_USER_ID } from './user';
import { assignVariant, Variant } from './ab';

export type Cancellation = {
  id: string;
  user_id: string;
  downsell_variant: Variant;
  reason: string | null;
  accepted_downsell: boolean | null;
  created_at: string;
};

export async function ensureActiveCancellation(): Promise<Cancellation> {
  const userId = MOCK_USER_ID;

  // Grab the latest cancellation attempt
  const { data: existing, error: selErr } = await supabaseAdmin
    .from('cancellations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (selErr) throw selErr;

  if (existing && existing.length > 0) {
    return existing[0] as Cancellation;
  }

  // Create fresh with a deterministic A/B
  const variant = assignVariant();

  const { data: created, error: insErr } = await supabaseAdmin
    .from('cancellations')
    .insert({
      user_id: userId,
      downsell_variant: variant,
      reason: null,
      accepted_downsell: null,
    })
    .select()
    .single();

  if (insErr) throw insErr;

  // Also mark subscription as pending_cancellation
  const { error: upErr } = await supabaseAdmin
    .from('subscriptions')
    .update({ pending_cancellation: true })
    .eq('user_id', userId);
  if (upErr) throw upErr;

  return created as Cancellation;
}

export async function getLatestCancellation(): Promise<Cancellation> {
  const { data, error } = await supabaseAdmin
    .from('cancellations')
    .select('*')
    .eq('user_id', MOCK_USER_ID)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data as Cancellation;
}

export async function saveReason(reason: string) {
  const c = await getLatestCancellation();
  const { error } = await supabaseAdmin
    .from('cancellations')
    .update({ reason })
    .eq('id', c.id);
  if (error) throw error;
}

export async function acceptDownsell() {
  const c = await getLatestCancellation();
  const { error: upd } = await supabaseAdmin
    .from('cancellations')
    .update({ accepted_downsell: true })
    .eq('id', c.id);
  if (upd) throw upd;

  // User stays active; clear pending flag
  const { error: sub } = await supabaseAdmin
    .from('subscriptions')
    .update({ pending_cancellation: false })
    .eq('user_id', MOCK_USER_ID);
  if (sub) throw sub;
}

export async function confirmCancellation() {
  const c = await getLatestCancellation();
  const { error: upd } = await supabaseAdmin
    .from('cancellations')
    .update({ accepted_downsell: false })
    .eq('id', c.id);
  if (upd) throw upd;

  // Actually cancel subscription
  const { error: sub } = await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'canceled', pending_cancellation: false })
    .eq('user_id', MOCK_USER_ID);
  if (sub) throw sub;
}
