// app/cancel/reason/page.tsx
import Image from 'next/image';
import { getOrSetCsrf } from '@/lib/csrf';
import Progress from '@/components/Progress';

// we keep the options client-safe by echoing their text back as plain text later (no HTML)
const REASONS = [
  'Too expensive',
  'Missing features',
  'Buggy or unreliable',
  'Temporary break',
  'Other',
];

export default async function Reason() {
  const csrf = getOrSetCsrf();

  return (
    <main className="mx-auto max-w-xl px-4 pb-16">
      <Progress step="reason" />
      <div className="flex justify-center py-6">
        <Image src="/images/main.png" alt="" width={96} height={96} className="rounded-full" />
      </div>

      <h1 className="text-2xl font-semibold mb-4 text-center">Before you go, what’s the main reason?</h1>

      <form method="POST" action="/api/cancel/reason" className="space-y-4">
        <input type="hidden" name="csrf" value={csrf} />
        <fieldset className="space-y-2">
          {REASONS.map((r) => (
            <label key={r} className="flex items-center gap-3 p-3 border rounded-xl">
              <input type="radio" name="reason" value={r} required className="h-4 w-4" />
              <span>{r}</span>
            </label>
          ))}
        </fieldset>

        <label className="block">
          <span className="text-sm text-gray-600">Additional details (optional)</span>
          <textarea
            name="details"
            rows={3}
            className="mt-1 w-full rounded-xl border p-3"
            placeholder="Tell us anything that would help us improve."
            maxLength={500}
          />
        </label>

        <div className="flex justify-end">
          <button
            className="rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90"
            type="submit"
          >
            Continue
          </button>
        </div>
      </form>
    </main>
  );
}
