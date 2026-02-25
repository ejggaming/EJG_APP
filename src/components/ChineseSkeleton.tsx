import React from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   CHINESE-THEMED SKELETON SYSTEM
   Gold shimmer animation on dark surfaces with subtle corner ornaments.
───────────────────────────────────────────────────────────────────────────── */

const KEYFRAMES = `
@keyframes cnShimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
`;

/* ── Base shimmer bone ── */
function Bone({
  className = "",
  rounded = "rounded-lg",
  style,
  delay = 0,
}: {
  className?: string;
  rounded?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <div
      className={`${rounded} ${className}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(110,50,5,0.13) 0%, rgba(200,140,30,0.26) 50%, rgba(110,50,5,0.13) 100%)",
        backgroundSize: "200% 100%",
        animation: `cnShimmer 1.7s ease-in-out ${delay}ms infinite`,
        ...style,
      }}
    />
  );
}

/* ── Corner bracket ornaments ── */
function Corners() {
  return (
    <>
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-amber-700/20 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-700/20 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber-700/20 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber-700/20 pointer-events-none" />
    </>
  );
}

/* ── Stat card skeleton ── */
function SkeletonStatCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="card-3d relative p-4 overflow-hidden">
      <Corners />
      <div className="flex items-start gap-3">
        <Bone className="w-10 h-10 shrink-0" rounded="rounded-xl" delay={delay} />
        <div className="flex-1 space-y-2 pt-0.5">
          <Bone className="h-3 w-20" delay={delay + 60} />
          <Bone className="h-6 w-28" delay={delay + 120} />
          <Bone className="h-2.5 w-14" delay={delay + 180} style={{ opacity: 0.6 }} />
        </div>
      </div>
    </div>
  );
}

/* ── Stat card row ── */
function StatRow({
  count = 4,
  gridClass,
}: {
  count?: number;
  gridClass?: string;
}) {
  const grid =
    gridClass ??
    (count === 6
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      : count === 3
        ? "grid-cols-3"
        : "grid-cols-2 sm:grid-cols-4");
  return (
    <div className={`grid gap-3 ${grid}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} delay={i * 80} />
      ))}
    </div>
  );
}

/* ── Hero card skeleton ── */
function SkeletonHero({
  dark = true,
  rows = 2,
  buttons = 2,
}: {
  dark?: boolean;
  rows?: number;
  buttons?: number;
}) {
  return (
    <div
      className="card-3d relative overflow-hidden p-5 sm:p-6"
      style={
        dark
          ? {
              background:
                "linear-gradient(135deg, rgba(80,20,5,0.95) 0%, rgba(130,45,10,0.95) 50%, rgba(80,20,5,0.95) 100%)",
            }
          : undefined
      }
    >
      <Corners />
      <div className="space-y-3">
        <Bone className="h-3 w-24" style={{ opacity: 0.5 }} />
        <Bone className="h-9 w-40" />
        {Array.from({ length: rows }).map((_, i) => (
          <Bone key={i} className="h-3 w-32" style={{ opacity: 0.45 }} delay={i * 60} />
        ))}
        {buttons > 0 && (
          <div className="flex gap-2 pt-1">
            {Array.from({ length: buttons }).map((_, i) => (
              <Bone key={i} className="h-8 w-24" rounded="rounded-lg" delay={i * 80} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Table skeleton ── */
function SkeletonTable({
  rows = 5,
  cols = 4,
  withTitle = true,
}: {
  rows?: number;
  cols?: number;
  withTitle?: boolean;
}) {
  const colW = ["w-24", "w-32", "w-20", "w-28", "w-16", "w-20", "w-24"];
  return (
    <div className="card-3d relative overflow-hidden">
      <Corners />
      {withTitle && (
        <div className="px-5 py-4 border-b border-border-subtle flex items-center gap-3 flex-wrap">
          <Bone className="h-5 w-40" />
          <div className="ml-auto flex gap-2">
            <Bone className="h-7 w-20" rounded="rounded-lg" />
            <Bone className="h-7 w-20" rounded="rounded-lg" />
          </div>
        </div>
      )}
      {/* header */}
      <div className="flex gap-4 px-5 py-3 border-b border-border-subtle">
        {Array.from({ length: cols }).map((_, i) => (
          <Bone
            key={i}
            className={`h-3 ${colW[i % colW.length]}`}
            style={{ opacity: 0.45 }}
            delay={i * 40}
          />
        ))}
      </div>
      {/* rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 px-5 py-3.5 border-b border-border-subtle last:border-0"
          style={{ opacity: 1 - r * 0.07 }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Bone
              key={c}
              className={`h-3.5 ${c === 0 ? "w-28" : colW[(c + 1) % colW.length]}`}
              delay={(r * cols + c) * 35}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Chart card skeleton ── */
function SkeletonChart() {
  return (
    <div className="card-3d relative overflow-hidden p-5">
      <Corners />
      <div className="mb-4 space-y-1.5">
        <Bone className="h-4 w-36" />
        <Bone className="h-3 w-24" style={{ opacity: 0.45 }} />
      </div>
      {/* bars */}
      <div className="flex items-end gap-1.5 h-28">
        {[55, 75, 42, 88, 60, 70, 82, 38, 72, 50, 65, 80].map((h, i) => (
          <Bone
            key={i}
            className="flex-1"
            rounded="rounded-t-sm"
            style={{ height: `${h}%`, opacity: 0.65 }}
            delay={i * 70}
          />
        ))}
      </div>
      {/* x-axis */}
      <div className="flex gap-2 mt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bone key={i} className="flex-1 h-2.5" style={{ opacity: 0.3 }} />
        ))}
      </div>
    </div>
  );
}

/* ── Donut chart skeleton ── */
function SkeletonDonut() {
  return (
    <div className="card-3d relative overflow-hidden p-5">
      <Corners />
      <div className="mb-4 space-y-1.5">
        <Bone className="h-4 w-36" />
        <Bone className="h-3 w-24" style={{ opacity: 0.45 }} />
      </div>
      <div className="flex items-center gap-6">
        <Bone className="w-36 h-36 shrink-0" rounded="rounded-full" />
        <div className="space-y-3 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Bone className="w-2.5 h-2.5 shrink-0" rounded="rounded-full" />
              <Bone className="h-3 flex-1" delay={i * 60} />
              <Bone className="h-3 w-14" delay={i * 60 + 30} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Transaction row skeleton ── */
function SkeletonTxRow({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0">
      <Bone className="w-10 h-10 shrink-0" rounded="rounded-xl" delay={delay} />
      <div className="flex-1 space-y-1.5">
        <Bone className="h-3.5 w-32" delay={delay + 50} />
        <Bone className="h-2.5 w-20" style={{ opacity: 0.5 }} delay={delay + 80} />
      </div>
      <div className="text-right space-y-1.5">
        <Bone className="h-3.5 w-16 ml-auto" delay={delay + 50} />
        <Bone className="h-2.5 w-10 ml-auto" style={{ opacity: 0.4 }} delay={delay + 80} />
      </div>
    </div>
  );
}

/* ── Bet card skeleton ── */
function SkeletonBetCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="card-3d relative overflow-hidden p-4">
      <Corners />
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <Bone className="h-4 w-16" rounded="rounded-full" delay={delay} />
            <Bone className="h-4 w-14" rounded="rounded-full" delay={delay + 40} />
          </div>
          <Bone className="h-3 w-28" delay={delay + 80} />
          <Bone className="h-3 w-20" style={{ opacity: 0.5 }} delay={delay + 110} />
        </div>
        <div className="text-right space-y-1.5">
          <Bone className="h-4 w-16 ml-auto" delay={delay} />
          <Bone className="h-3 w-10 ml-auto" style={{ opacity: 0.5 }} delay={delay + 50} />
        </div>
      </div>
    </div>
  );
}

/* ── Result card skeleton ── */
function SkeletonResultCard({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div
        className="card-3d relative overflow-hidden p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(80,10,10,0.9) 0%, rgba(120,20,20,0.9) 100%)",
        }}
      >
        <Corners />
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <Bone className="w-14 h-14" rounded="rounded-2xl" />
            <Bone className="w-14 h-14" rounded="rounded-2xl" delay={120} />
          </div>
          <div className="space-y-2">
            <Bone className="h-4 w-24" />
            <Bone className="h-3 w-16" style={{ opacity: 0.5 }} delay={60} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="card-3d relative overflow-hidden p-4">
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <Bone className="w-10 h-10" rounded="rounded-xl" />
          <Bone className="w-10 h-10" rounded="rounded-xl" delay={100} />
        </div>
        <div className="flex-1 space-y-1.5">
          <Bone className="h-3 w-20" />
          <Bone className="h-2.5 w-14" style={{ opacity: 0.5 }} delay={60} />
        </div>
        <Bone className="h-5 w-16" rounded="rounded-full" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE-LEVEL SKELETON EXPORTS
═══════════════════════════════════════════════════════════════════════════ */

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-5">
      <style>{KEYFRAMES}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-7 w-44" />
          <Bone className="h-3 w-64" style={{ opacity: 0.45 }} />
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Bone className="h-9 w-28" rounded="rounded-xl" />
          <Bone className="h-9 w-28" rounded="rounded-xl" delay={80} />
        </div>
      </div>
      {/* date filter */}
      <div className="card-3d px-4 py-3">
        <Bone className="h-8 w-full" rounded="rounded-lg" />
      </div>
      <StatRow count={6} />
      {/* charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonDonut />
        <div className="card-3d relative overflow-hidden p-5">
          <Corners />
          <Bone className="h-4 w-40 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTxRow key={i} delay={i * 90} />
          ))}
        </div>
      </div>
      <SkeletonTable rows={5} cols={5} />
    </div>
  );
}

export function DrawManagementSkeleton() {
  return (
    <div className="space-y-5">
      <style>{KEYFRAMES}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-7 w-52" />
          <Bone className="h-3 w-56" style={{ opacity: 0.45 }} />
        </div>
        <Bone className="h-9 w-36" rounded="rounded-xl" />
      </div>
      <StatRow count={6} />
      <SkeletonTable rows={8} cols={6} />
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="space-y-5">
      <style>{KEYFRAMES}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-7 w-32" />
          <Bone className="h-3 w-72" style={{ opacity: 0.45 }} />
        </div>
        <div className="flex gap-2">
          <Bone className="h-9 w-28" rounded="rounded-xl" />
          <Bone className="h-9 w-20" rounded="rounded-xl" delay={80} />
        </div>
      </div>
      <div className="card-3d px-4 py-3">
        <Bone className="h-8 w-full" rounded="rounded-lg" />
      </div>
      <StatRow count={6} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable rows={5} cols={6} />
      <SkeletonTable rows={5} cols={5} />
    </div>
  );
}

export function AgentDashboardSkeleton() {
  return (
    <div className="space-y-5">
      <style>{KEYFRAMES}</style>
      <SkeletonHero rows={2} buttons={2} />
      <StatRow count={6} />
      {/* Today's draws mini grid */}
      <div className="space-y-3">
        <Bone className="h-5 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-3d relative overflow-hidden p-4">
              <Corners />
              <div className="space-y-2">
                <Bone className="h-4 w-24" delay={i * 70} />
                <Bone className="h-3 w-20" style={{ opacity: 0.5 }} delay={i * 70 + 50} />
                <div className="flex gap-4 pt-1">
                  <Bone className="h-3 w-16" delay={i * 70 + 100} />
                  <Bone className="h-3 w-16" delay={i * 70 + 140} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SkeletonTable rows={5} cols={5} />
    </div>
  );
}

export function AgentCommissionsSkeleton() {
  return (
    <div className="space-y-5">
      <style>{KEYFRAMES}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-7 w-44" />
          <Bone className="h-3 w-56" style={{ opacity: 0.45 }} />
        </div>
        <Bone className="h-9 w-28" rounded="rounded-xl" />
      </div>
      <StatRow count={4} />
      <SkeletonTable rows={8} cols={5} />
    </div>
  );
}

export function AgentWalletSkeleton() {
  return (
    <div className="space-y-4">
      <style>{KEYFRAMES}</style>
      <SkeletonHero rows={1} buttons={2} />
      {/* Withdrawal section */}
      <div className="card-3d relative overflow-hidden p-5">
        <Corners />
        <Bone className="h-4 w-32 mb-4" />
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Bone key={i} className="h-12" rounded="rounded-xl" delay={i * 70} />
            ))}
          </div>
          <Bone className="h-10 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <Bone className="h-10" />
            <Bone className="h-10" delay={60} />
          </div>
          <Bone className="h-9 w-full" rounded="rounded-lg" />
        </div>
      </div>
      <SkeletonTable rows={6} cols={4} />
    </div>
  );
}

export function WalletSkeleton() {
  return (
    <div className="space-y-4">
      <style>{KEYFRAMES}</style>
      <SkeletonHero rows={1} buttons={2} />
      <StatRow count={3} gridClass="grid-cols-3" />
      <div className="card-3d relative overflow-hidden p-5">
        <Corners />
        <Bone className="h-4 w-32 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonTxRow key={i} delay={i * 90} />
        ))}
      </div>
    </div>
  );
}

export function BetHistorySkeleton() {
  return (
    <div className="space-y-4">
      <style>{KEYFRAMES}</style>
      <div className="space-y-1.5">
        <Bone className="h-6 w-36" />
        <Bone className="h-3 w-40" style={{ opacity: 0.45 }} />
      </div>
      {/* balance card */}
      <div className="card-3d relative overflow-hidden p-4">
        <Corners />
        <div className="flex items-center gap-3">
          <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
          <div className="space-y-1.5">
            <Bone className="h-3 w-24" />
            <Bone className="h-6 w-28" delay={60} />
          </div>
        </div>
      </div>
      {/* 2-col stats */}
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-3d relative overflow-hidden p-4 text-center">
            <Corners />
            <Bone className="h-5 w-16 mx-auto" delay={i * 60} />
            <Bone className="h-3 w-20 mx-auto mt-2" style={{ opacity: 0.45 }} delay={i * 60 + 80} />
          </div>
        ))}
      </div>
      {/* bet cards */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBetCard key={i} delay={i * 80} />
        ))}
      </div>
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-4">
      <style>{KEYFRAMES}</style>
      <div className="space-y-1.5">
        <Bone className="h-6 w-36" />
        <Bone className="h-3 w-44" style={{ opacity: 0.45 }} />
      </div>
      {/* tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Bone key={i} className="h-8 w-20" rounded="rounded-full" delay={i * 60} />
        ))}
      </div>
      <SkeletonResultCard featured />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonResultCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function UserManagementSkeleton() {
  return (
    <div className="space-y-5">
      <style>{KEYFRAMES}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-7 w-44" />
          <Bone className="h-3 w-64" style={{ opacity: 0.45 }} />
        </div>
        <Bone className="h-9 w-32" rounded="rounded-xl" />
      </div>
      <StatRow count={4} />
      {/* search bar */}
      <div className="card-3d px-4 py-3 flex gap-3">
        <Bone className="h-9 flex-1" rounded="rounded-lg" />
        <Bone className="h-9 w-28" rounded="rounded-lg" delay={60} />
      </div>
      <SkeletonTable rows={7} cols={5} withTitle={false} />
    </div>
  );
}

export function KycManagementSkeleton() {
  return (
    <div className="space-y-5">
      <style>{KEYFRAMES}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-7 w-48" />
          <Bone className="h-3 w-60" style={{ opacity: 0.45 }} />
        </div>
        <Bone className="h-9 w-28" rounded="rounded-xl" />
      </div>
      <StatRow count={4} />
      {/* status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-8 w-24" rounded="rounded-lg" delay={i * 60} />
        ))}
      </div>
      <SkeletonTable rows={7} cols={5} withTitle={false} />
    </div>
  );
}

export function FinanceSkeleton() {
  return (
    <div className="space-y-5">
      <style>{KEYFRAMES}</style>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Bone className="h-7 w-52" />
          <Bone className="h-3 w-64" style={{ opacity: 0.45 }} />
        </div>
        <Bone className="h-9 w-32" rounded="rounded-xl" />
      </div>
      <StatRow count={4} />
      {/* pending approvals */}
      <div className="card-3d relative overflow-hidden p-5">
        <Corners />
        <div className="flex items-center justify-between mb-4">
          <Bone className="h-5 w-40" />
          <Bone className="h-7 w-24" rounded="rounded-lg" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0"
          >
            <Bone className="w-10 h-10 shrink-0" rounded="rounded-xl" delay={i * 80} />
            <div className="flex-1 space-y-1.5">
              <Bone className="h-3.5 w-40" delay={i * 80 + 50} />
              <Bone className="h-2.5 w-24" style={{ opacity: 0.5 }} delay={i * 80 + 90} />
            </div>
            <div className="flex gap-2">
              <Bone className="h-7 w-16" rounded="rounded-lg" delay={i * 80 + 40} />
              <Bone className="h-7 w-16" rounded="rounded-lg" delay={i * 80 + 80} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable rows={6} cols={5} />
    </div>
  );
}

export function SystemSettingsSkeleton() {
  return (
    <div className="space-y-5">
      <style>{KEYFRAMES}</style>
      <div className="space-y-2">
        <Bone className="h-7 w-44" />
        <Bone className="h-3 w-60" style={{ opacity: 0.45 }} />
      </div>
      {Array.from({ length: 3 }).map((_, s) => (
        <div key={s} className="card-3d relative overflow-hidden p-5">
          <Corners />
          <Bone className="h-5 w-40 mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Bone className="h-3 w-24" style={{ opacity: 0.45 }} delay={i * 50} />
                <Bone className="h-9 w-full" delay={i * 50 + 60} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationsSkeleton() {
  return (
    <div className="space-y-3">
      <style>{KEYFRAMES}</style>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card-3d relative overflow-hidden p-4">
          <Corners />
          <div className="flex items-start gap-3">
            <Bone className="w-9 h-9 shrink-0" rounded="rounded-xl" delay={i * 60} />
            <div className="flex-1 space-y-1.5">
              <Bone className="h-3.5 w-40" delay={i * 60 + 50} />
              <Bone className="h-3 w-56" style={{ opacity: 0.5 }} delay={i * 60 + 90} />
              <Bone className="h-2.5 w-20" style={{ opacity: 0.35 }} delay={i * 60 + 120} />
            </div>
            <Bone className="h-7 w-16 shrink-0" rounded="rounded-lg" delay={i * 60} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function KycUploadSkeleton() {
  return (
    <div className="space-y-4">
      <style>{KEYFRAMES}</style>
      <div className="space-y-2">
        <Bone className="h-6 w-36" />
        <Bone className="h-3 w-52" style={{ opacity: 0.45 }} />
      </div>
      <div className="card-3d relative overflow-hidden p-5 space-y-4">
        <Corners />
        <Bone className="h-5 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Bone className="h-3 w-24" style={{ opacity: 0.45 }} delay={i * 60} />
            <Bone className="h-10 w-full" delay={i * 60 + 50} />
          </div>
        ))}
        {/* upload boxes */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Bone key={i} className="h-32" rounded="rounded-xl" delay={i * 100} />
          ))}
        </div>
        <Bone className="h-10 w-full" rounded="rounded-lg" />
      </div>
    </div>
  );
}
