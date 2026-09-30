import React from 'react';

export function Skeleton({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`animate-pulse bg-[#E5E9E6] rounded-md ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1B2A22]/10 bg-white p-4 h-[126px] flex flex-col justify-between shadow-xs">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-7 w-32 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function ChartWidgetSkeleton() {
  return (
    <div className="bg-white border border-kolo-hairline rounded-xl p-5 shadow-xs flex flex-col justify-between h-[360px]">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>
      <div className="h-[260px] flex items-end justify-between gap-3 px-2 pb-2">
        {[45, 60, 35, 75, 55, 85, 95].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton
              className="w-full rounded-t-md"
              style={{ height: `${h * 2.2}px` }}
            />
            <Skeleton className="h-2.5 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentOrdersWidgetSkeleton() {
  return (
    <div className="bg-white border border-[#D9CFB8] rounded-xl p-5 shadow-xs flex flex-col justify-between h-[360px]">
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-12 rounded-sm" />
        </div>
        <div className="space-y-3.5 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-[#FAF9F5]">
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-2.5 w-20" />
              </div>
              <div className="flex flex-col items-end space-y-1.5">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3 w-10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-3 border-t border-[#D9CFB8] flex justify-between items-center">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-[14px_8px] border-b border-[#eef1ef]">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
