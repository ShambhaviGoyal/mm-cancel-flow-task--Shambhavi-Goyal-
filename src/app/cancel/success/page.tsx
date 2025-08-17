// app/cancel/success/page.tsx
export default function Success() {
  return (
    <main className="mx-auto max-w-xl px-4 pb-16 pt-10">
      <h1 className="text-2xl font-semibold">All set</h1>
      <p className="mt-2 text-gray-700">
        We’ve processed your request. Thanks for giving us a try.
      </p>
      <a href="/" className="mt-6 inline-block rounded-2xl border px-5 py-3 hover:bg-gray-50">
        Back to home
      </a>
    </main>
  );
}
