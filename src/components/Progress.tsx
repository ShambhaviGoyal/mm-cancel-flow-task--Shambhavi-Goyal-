// components/Progress.tsx
'use client';

import clsx from 'clsx';

type Step = 'reason' | 'downsell' | 'confirm';

export default function Progress({ step }: { step: Step }) {
  const items: { key: Step; label: string }[] = [
    { key: 'reason', label: 'Reason' },
    { key: 'downsell', label: 'Offer' },
    { key: 'confirm', label: 'Confirm' },
  ];

  let activeIdx = items.findIndex(i => i.key === step);
  if (activeIdx < 0) activeIdx = 0;

  return (
    <div className="mx-auto max-w-xl px-4 pt-6">
      <ol className="flex items-center justify-between">
        {items.map((it, idx) => (
          <li key={it.key} className="flex-1">
            <div className={clsx(
              'flex items-center gap-2',
              idx <= activeIdx ? 'text-black' : 'text-gray-400'
            )}>
              <div className={clsx(
                'h-2 w-full rounded-full',
                idx < activeIdx ? 'bg-black' : 'bg-gray-200'
              )}/>
              <span className="text-xs whitespace-nowrap pl-2">{it.label}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
