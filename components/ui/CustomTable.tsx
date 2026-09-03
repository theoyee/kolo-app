'use client';

import React from 'react';

/**
 * Same token system as the rest of the site (see theme/tailwind.config.ts
 * and theme/kolo-colors.ts).
 *
 * Design choices, on purpose:
 * - Header labels are lowercase mono, never uppercase-tracked.
 * - Rows are separated by hairlines only — no zebra striping.
 * - Any column marked `mono` renders with tabular-nums, matching every
 *   other figure on the site (prices, stats, transaction amounts).
 * - An optional `footer` row gets the double-border "ledger total" treatment
 *   already used for the pricing stamp and the Problem section's highlight card.
 */

export type Column<T> = {
  /** Key into the row object for the default cell value; also used as React key. */
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  /** Render numeric/figure columns with font-mono + tabular-nums. */
  mono?: boolean;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
};

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  /** Small mono label above the table, e.g. "recent activity". */
  eyebrow?: string;
  /** Bold title above the table, e.g. "Recent orders". */
  title?: string;
  /** Shown in place of rows when `data` is empty. */
  emptyMessage?: string;
  /** Rendered as a double-bordered total/summary row beneath the body. */
  footer?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export function Table<T>({
  columns,
  data,
  rowKey,
  eyebrow,
  title,
  emptyMessage = 'no records yet',
  footer,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="border border-kolo-hairline bg-white rounded-xl">
      {(eyebrow || title) && (
        <div className="border-b border-kolo-hairline px-5 py-4">
          {eyebrow && <p className="font-mono text-[11px] text-kolo-currency">{eyebrow}</p>}
          {title && (
            <h3 className={`text-[15px] font-bold text-kolo-ink ${eyebrow ? 'mt-1' : ''}`}>
              {title}
            </h3>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-kolo-hairline">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={`whitespace-nowrap px-5 py-3 font-mono text-xs font-normal text-kolo-muted-light ${alignClass[col.align ?? 'left']
                    }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center font-mono text-sm text-kolo-muted-light"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-b border-kolo-hairline/50 transition-colors last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-kolo-paper-alt/50' : ''
                    }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-5 py-3.5 text-sm text-kolo-ink ${alignClass[col.align ?? 'left']
                        } ${col.mono ? 'font-mono tabular-nums' : ''}`}
                    >
                      {col.render
                        ? col.render(row, i)
                        : (row as unknown as Record<string, React.ReactNode>)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>

          {footer && (
            <tfoot>
              <tr className="border-t-2 border-double border-kolo-hairline">
                <td colSpan={columns.length} className="px-5 py-4">
                  {footer}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}