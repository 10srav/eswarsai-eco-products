export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-forest-deep text-bone">
      <div className="flex flex-col items-center gap-6">
        <div className="h-1 w-40 overflow-hidden rounded-full bg-bone/15">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-leaf" />
        </div>
        <p className="eyebrow opacity-70">Loading…</p>
      </div>
    </div>
  );
}
