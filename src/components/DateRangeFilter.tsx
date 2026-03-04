import { Calendar } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DatePreset = "today" | "week" | "month" | "year" | "custom";

export interface DateRange {
  preset: DatePreset;
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function datesForPreset(preset: Exclude<DatePreset, "custom">): { from: string; to: string } {
  const to = todayStr();
  const now = new Date();

  switch (preset) {
    case "today":
      return { from: to, to };
    case "week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 6);
      return { from: d.toISOString().split("T")[0], to };
    }
    case "month":
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0],
        to,
      };
    case "year":
      return {
        from: new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0],
        to,
      };
  }
}

/** Create an initial DateRange value for a given preset. */
export function getInitialDateRange(preset: DatePreset = "today"): DateRange {
  if (preset === "custom") {
    const d = todayStr();
    return { preset: "custom", from: d, to: d };
  }
  return { preset, ...datesForPreset(preset) };
}

/** Human-readable label for the selected range. */
export function dateRangeLabel(range: DateRange): string {
  const fmt = (s: string) =>
    new Date(s + "T00:00:00").toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  if (range.preset === "today") return fmt(range.from);
  return `${fmt(range.from)} – ${fmt(range.to)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "custom", label: "Custom" },
];

export function DateRangeFilter({ value, onChange }: Props) {
  const handlePreset = (preset: DatePreset) => {
    if (preset === "custom") {
      onChange({ ...value, preset: "custom" });
    } else {
      onChange({ preset, ...datesForPreset(preset) });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Preset toggle buttons */}
      <div className="flex overflow-hidden rounded-xl border border-border-default bg-surface-elevated">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => handlePreset(p.key)}
            className={`px-3.5 py-1.5 text-xs font-medium transition-colors ${
              value.preset === p.key
                ? "bg-brand-red text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-card"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom date pickers */}
      {value.preset === "custom" && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-surface-elevated border border-border-default rounded-xl px-2.5 py-1.5">
            <Calendar size={13} className="text-text-muted shrink-0" />
            <input
              type="date"
              value={value.from}
              max={value.to}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
              className="bg-transparent text-xs text-text-primary focus:outline-none w-28 [color-scheme:dark]"
            />
          </div>
          <span className="text-text-muted text-xs font-medium">to</span>
          <div className="flex items-center gap-1.5 bg-surface-elevated border border-border-default rounded-xl px-2.5 py-1.5">
            <Calendar size={13} className="text-text-muted shrink-0" />
            <input
              type="date"
              value={value.to}
              min={value.from}
              max={todayStr()}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
              className="bg-transparent text-xs text-text-primary focus:outline-none w-28 [color-scheme:dark]"
            />
          </div>
        </div>
      )}

      {/* Date label for non-custom presets */}
      {value.preset !== "custom" && (
        <span className="text-[11px] text-text-muted">
          {dateRangeLabel(value)}
        </span>
      )}
    </div>
  );
}
