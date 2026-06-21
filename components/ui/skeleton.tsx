"use client";

/**
 * Loading skeleton components
 * Used while data is loading
 */

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-24 mb-4"></div>
      <div className="h-8 bg-slate-700 rounded w-32"></div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-32 mb-4"></div>
      <div className="h-64 bg-slate-700 rounded"></div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-32 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-700 rounded"></div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonLine() {
  return <div className="h-4 bg-slate-700 rounded w-full mb-2 animate-pulse"></div>;
}

export function SkeletonGrid({ columns = 3, rows = 3 }: { columns?: number; rows?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {[...Array(rows)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonCard;
