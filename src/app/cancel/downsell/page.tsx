// app/cancel/downsell/page.tsx
import Image from 'next/image';
import Progress from '@/components/Progress';
import { getLatestCancellation } from '@/lib/flow';
import { getOrSetCsrf } from '@/lib/csrf';

const prices = {
  current: { low: 2500, high: 2900 }, // $25 / $29 plans
  bOffer:  { low: 1500, high: 1900 }, // $15 / $19 for Variant B
};

function fmt(cents: number) {
  return `$${(cents/100).toFixed(0)}`;
}

export default async function Downsell() {
  const csrf = getOrSetCsrf();
  const c = await getLatestCancellation();

  const isB = c.downsell_variant === 'B';

  return (
    <main className="mx-auto max-w-xl px-4 pb-16">
      <Progress step="downsell" />

      <div className="flex items-center gap-3 py-6">
        <Image src="/images/profile.jpg" alt="" width={48} height={48} className="rounded-full" />
        <div>
          <p className="text-sm text-gray-600">We’d hate to see you go.</p>
          <h1 className="text-xl font-semibold">Can we make it more affordable?</h1>
        </div>
      </div>

      <div className="rounded-2xl border p-4">
        {isB ? (
          <div>
            <p className="mb-2">Special keep-you discount:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>Plan ${fmt(prices.current.low)} → <strong>{fmt(prices.bOffer.low)}</strong></li>
              <li>Plan ${fmt(prices.current.high)} → <strong>{fmt(prices.bOffer.high)}</strong></li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              Discount applies immediately; you can still cancel later anytime.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-700">
              We don’t have a discount on this visit, but you can review your plan or continue to cancel.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <form method="POST" action="/api/cancel/accept-downsell">
          <input type="hidden" name="csrf" value={csrf} />
          <button
            className="w-full rounded-2xl border px-5 py-3 hover:bg-gray-50 sm:w-auto"
            type="submit"
            disabled={!isB}
            aria-disabled={!isB}
          >
            {isB ? 'Apply discount & stay' : 'Manage plan (stub)'}
          </button>
        </form>

        <a
          href="/cancel/confirm"
          className="w-full rounded-2xl bg-black px-5 py-3 text-center text-white hover:opacity-90 sm:w-auto"
        >
          Continue to cancel
        </a>
      </div>
    </main>
  );
}
