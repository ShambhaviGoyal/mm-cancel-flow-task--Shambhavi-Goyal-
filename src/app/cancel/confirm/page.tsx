// app/cancel/confirm/page.tsx
import Progress from '@/components/Progress';
import { getOrSetCsrf } from '@/lib/csrf';

export default async function Confirm() {
  const csrf = getOrSetCsrf();
  return (
    <main className="mx-auto max-w-xl px-4 pb-16">
      <Progress step="confirm" />
      <h1 className="mt-6 text-2xl font-semibold">Confirm cancellation</h1>
      <p className="mt-2 text-sm text-gray-600">
        Your access ends at the end of the current billing period. You can re-subscribe any time.
      </p>

      <form method="POST" action="/api/cancel/confirm" className="mt-8 space-y-4">
        <input type="hidden" name="csrf" value={csrf} />
        <button
          className="w-full rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90"
          type="submit"
        >
          Confirm cancellation
        </button>
      </form>
    </main>
  );
}
