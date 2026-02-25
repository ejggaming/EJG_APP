import { useState, useMemo, useCallback } from "react";
import { cn } from "../utils/cn";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ── Types ── */
export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T = any> {
  title?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
  pageSize?: number;
  exportable?: boolean;
  importable?: boolean;
  onImport?: (file: File) => void;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

/* ── Component ── */
export function DataTable<T extends Record<string, any>>({
  title,
  columns,
  data,
  actions,
  pageSize = 10,
  exportable = true,
  importable = false,
  onImport,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {},
  );
  const [globalSearch, setGlobalSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ── sort toggle ── */
  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        if (sortDir === "asc") setSortDir("desc");
        else if (sortDir === "desc") {
          setSortKey(null);
          setSortDir(null);
        }
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
      setPage(1);
    },
    [sortKey, sortDir],
  );

  /* ── filter + sort pipeline ── */
  const processed = useMemo(() => {
    let rows = [...data];

    // global search
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) =>
          String(row[col.key] ?? "")
            .toLowerCase()
            .includes(q),
        ),
      );
    }

    // per-column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value.trim()) {
        const q = value.toLowerCase();
        rows = rows.filter((row) =>
          String(row[key] ?? "")
            .toLowerCase()
            .includes(q),
        );
      }
    });

    // sort
    if (sortKey && sortDir) {
      rows.sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, globalSearch, columnFilters, sortKey, sortDir, columns]);

  /* ── pagination ── */
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const paginated = processed.slice((page - 1) * pageSize, page * pageSize);

  /* ── CSV export ── */
  const handleExport = useCallback(() => {
    const header = columns.map((c) => c.label).join(",");
    const rows = processed.map((row) =>
      columns
        .map((c) => {
          const val = String(row[c.key] ?? "").replace(/,/g, "");
          return `"${val}"`;
        })
        .join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title?.replace(/\s+/g, "_") ?? "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [columns, processed, title]);

  /* ── CSV import ── */
  const handleImportClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onImport) onImport(file);
    };
    input.click();
  }, [onImport]);

  const setColFilter = useCallback((key: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  return (
    <div className={cn("card-3d p-5", className)}>
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        {title && (
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        )}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Global search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search…"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue/40 w-44"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
              }}
            />
          </div>

          {exportable && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-text-secondary hover:text-text-primary transition-colors glass-btn"
            >
              <Download size={13} />
              Export
            </button>
          )}

          {importable && (
            <button
              onClick={handleImportClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-text-secondary hover:text-text-primary transition-colors glass-btn"
            >
              <Upload size={13} />
              Import
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="overflow-x-auto overscroll-x-contain rounded-lg touch-pan-x"
        style={{ border: "1px solid var(--glass-divider)" }}
      >
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            {/* Column headers */}
            <tr style={{ borderBottom: "1px solid var(--glass-divider)" }}>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const sortable = col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 text-xs font-medium text-text-muted text-left whitespace-nowrap",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      sortable &&
                        "cursor-pointer select-none hover:text-text-secondary",
                    )}
                    onClick={() => sortable && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortable && (
                        <span className="opacity-40">
                          {isSorted && sortDir === "asc" ? (
                            <ChevronUp size={12} />
                          ) : isSorted && sortDir === "desc" ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronsUpDown size={12} />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
              {actions && (
                <th className="px-4 py-2.5 text-xs font-medium text-text-muted text-right">
                  Actions
                </th>
              )}
            </tr>

            {/* Per-column search */}
            {columns.some((c) => c.searchable !== false) && (
              <tr style={{ borderBottom: "1px solid var(--glass-row-border)" }}>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-1.5">
                    {col.searchable !== false ? (
                      <input
                        type="text"
                        placeholder={`Filter…`}
                        value={columnFilters[col.key] ?? ""}
                        onChange={(e) => setColFilter(col.key, e.target.value)}
                        className="w-full px-2 py-1 text-[11px] rounded text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand-blue/30"
                        style={{
                          background: "var(--glass-subtle)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: "var(--glass-border-subtle)",
                        }}
                      />
                    ) : (
                      <div />
                    )}
                  </th>
                ))}
                {actions && <th className="px-4 py-1.5" />}
              </tr>
            )}
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-8 text-center text-xs text-text-muted"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => (
                <tr
                  key={idx}
                  className="last:border-0 transition-colors glass-row"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-2.5 text-text-secondary whitespace-nowrap",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-[11px] text-text-muted">
          {processed.length} row{processed.length !== 1 ? "s" : ""} · Page{" "}
          {page} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={cn(
                  "w-7 h-7 rounded-lg text-xs font-medium transition-colors",
                  page === pageNum
                    ? "bg-brand-red text-white"
                    : "text-text-muted hover:text-text-primary glass-page-btn",
                )}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
