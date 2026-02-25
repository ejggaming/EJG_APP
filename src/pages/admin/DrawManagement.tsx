import { useState, useEffect } from "react";
import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import { Input, Modal } from "../../components";
import { DrawManagementSkeleton } from "../../components/ChineseSkeleton";
import {
  CheckCircle,
  Clock,
  Lock,
  LockOpen,
  CalendarDays,
  Dices,
  Banknote,
  BarChart3,
  Plus,
} from "lucide-react";
import { Button } from "../../components";
import toast from "react-hot-toast";
import {
  useAdminDrawsQuery,
  useUpdateDrawMutation,
  useCreateDrawMutation,
  useDrawSchedulesQuery,
  useSettleDrawMutation,
  drawTypeLabel,
} from "../../hooks/useBet";
import type { JuetengDraw } from "../../services/betService";

const STATUS_COLORS: Record<string, string> = {
  SETTLED: "text-brand-green bg-brand-green/10",
  DRAWN: "text-brand-blue bg-brand-blue/10",
  OPEN: "text-brand-gold bg-brand-gold/10",
  CLOSED: "text-brand-red bg-brand-red/10",
  SCHEDULED: "text-text-muted bg-white/5",
  CANCELLED: "text-orange-400 bg-orange-400/10",
};

export default function DrawManagement() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminDrawsQuery({ page, limit: 20 });
  const updateDraw = useUpdateDrawMutation();
  const settleDraw = useSettleDrawMutation();
  const createDraw = useCreateDrawMutation();
  const { data: schedules = [] } = useDrawSchedulesQuery();

  const [showEncode, setShowEncode] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState<JuetengDraw | null>(null);
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");

  // Create draw state
  const [showCreate, setShowCreate] = useState(false);
  const [createDate, setCreateDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [createType, setCreateType] = useState<"MORNING" | "AFTERNOON" | "EVENING">(
    "MORNING",
  );

  const draws = data?.draws ?? [];

  // When schedules load, default createType to the first active schedule
  useEffect(() => {
    const firstActive = schedules.find((s) => s.isActive);
    if (firstActive) setCreateType(firstActive.drawType);
  }, [schedules]);

  if (isLoading) return <DrawManagementSkeleton />;

  const handleCreate = () => {
    const schedule = schedules.find((s) => s.drawType === createType);
    if (!schedule) {
      toast.error("No active schedule found for the selected draw type");
      return;
    }
    // Combine selected date + schedule time → ISO string
    const scheduledAt = new Date(
      `${createDate}T${schedule.scheduledTime}:00`,
    ).toISOString();

    createDraw.mutate(
      { scheduleId: schedule.id, drawDate: createDate, drawType: createType, scheduledAt },
      {
        onSuccess: () => {
          toast.success(`${drawTypeLabel(createType)} draw created for ${createDate}`);
          setShowCreate(false);
        },
      },
    );
  };

  const handleEncode = (draw: JuetengDraw) => {
    setSelectedDraw(draw);
    setNum1("");
    setNum2("");
    setShowEncode(true);
  };

  const handleSubmitResult = async () => {
    if (!selectedDraw) return;
    const n1 = parseInt(num1);
    const n2 = parseInt(num2);
    if (!n1 || !n2 || n1 < 1 || n1 > 37 || n2 < 1 || n2 > 37) {
      toast.error("Enter valid numbers between 1-37");
      return;
    }
    if (n1 === n2) {
      toast.error("Numbers must be different");
      return;
    }

    const combinationKey = [n1, n2].sort((a, b) => a - b).join("-");

    updateDraw.mutate(
      {
        id: selectedDraw.id,
        data: {
          number1: n1,
          number2: n2,
          combinationKey,
          status: "DRAWN",
        } as Partial<JuetengDraw>,
      },
      {
        onSuccess: () => {
          toast.success(`Draw result encoded: ${n1} - ${n2}`);
          setShowEncode(false);
        },
      },
    );
  };

  // Stats
  const settled = draws.filter(
    (d) => d.status === "SETTLED" || d.status === "DRAWN",
  ).length;
  const open = draws.filter((d) => d.status === "OPEN").length;
  const scheduled = draws.filter((d) => d.status === "SCHEDULED").length;
  const totalStake = draws.reduce((a, d) => a + d.totalStake, 0);
  const totalPayout = draws.reduce((a, d) => a + d.totalPayout, 0);
  const totalBetsCount = draws.reduce((a, d) => a + d.totalBets, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Draw Management
          </h1>
          <p className="text-text-muted mt-1">
            Manage draw schedules, encode results, and monitor bets
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreate(true)}
        >
          <Plus size={15} />
          Create Draw
        </Button>
      </div>

      {/* Summary Stats */}
      <CardGrid columns={6}>
        <StatCard
          label="Settled / Drawn"
          value={settled}
          icon={<CheckCircle size={18} />}
          color="green"
        />
        <StatCard
          label="Open"
          value={open}
          icon={<Dices size={18} />}
          color="orange"
        />
        <StatCard
          label="Scheduled"
          value={scheduled}
          icon={<Clock size={18} />}
          color="blue"
        />
        <StatCard
          label="Total Stakes"
          value={`₱${totalStake.toLocaleString()}`}
          icon={<CalendarDays size={18} />}
          color="purple"
        />
        <StatCard
          label="Total Payouts"
          value={`₱${totalPayout.toLocaleString()}`}
          icon={<Banknote size={18} />}
          color="red"
        />
        <StatCard
          label="Total Bets"
          value={totalBetsCount.toLocaleString()}
          icon={<BarChart3 size={18} />}
          color="blue"
        />
      </CardGrid>

      {/* Draws DataTable */}
      <DataTable
          title="All Draws"
          columns={
            [
              {
                key: "drawDate",
                label: "Date",
                sortable: true,
                render: (v: string) =>
                  new Date(v).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
              },
              {
                key: "drawType",
                label: "Draw Time",
                sortable: true,
                render: (v: "MORNING" | "AFTERNOON" | "EVENING") =>
                  `${drawTypeLabel(v)} Draw`,
              },
              {
                key: "status",
                label: "Status",
                sortable: true,
                render: (v: string) => {
                  const color =
                    STATUS_COLORS[v] ?? "text-text-muted bg-white/5";
                  return (
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${color}`}
                    >
                      {v.toLowerCase()}
                    </span>
                  );
                },
              },
              {
                key: "number1",
                label: "Result",
                searchable: false,
                sortable: false,
                render: (_v: number | null, row: JuetengDraw) =>
                  row.number1 != null && row.number2 != null ? (
                    <div className="flex gap-1">
                      <span className="w-7 h-7 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center border border-brand-gold">
                        {row.number1}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center border border-brand-gold">
                        {row.number2}
                      </span>
                    </div>
                  ) : (
                    <span className="text-text-muted text-xs">—</span>
                  ),
              },
              {
                key: "totalBets",
                label: "Bets",
                align: "right" as const,
                sortable: true,
                render: (v: number) => v.toLocaleString(),
              },
              {
                key: "totalStake",
                label: "Stake",
                align: "right" as const,
                sortable: true,
                render: (v: number) => (
                  <span className="text-brand-gold font-medium">
                    ₱{v.toLocaleString()}
                  </span>
                ),
              },
              {
                key: "totalPayout",
                label: "Payout",
                align: "right" as const,
                sortable: true,
                render: (v: number) => (
                  <span
                    className={
                      v > 0
                        ? "text-brand-red-light font-medium"
                        : "text-text-muted"
                    }
                  >
                    {v > 0 ? `-₱${v.toLocaleString()}` : "—"}
                  </span>
                ),
              },
              {
                key: "grossProfit",
                label: "Profit",
                align: "right" as const,
                sortable: true,
                render: (v: number) => (
                  <span
                    className={
                      v > 0
                        ? "text-brand-green font-medium"
                        : v < 0
                          ? "text-brand-red-light font-medium"
                          : "text-text-muted"
                    }
                  >
                    {v !== 0
                      ? `${v > 0 ? "+" : "-"}₱${Math.abs(v).toLocaleString()}`
                      : "—"}
                  </span>
                ),
              },
              {
                key: "scheduledAt",
                label: "Scheduled",
                sortable: true,
                render: (v: string) =>
                  new Date(v).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }),
              },
            ] satisfies DataTableColumn[]
          }
          data={draws}
          pageSize={20}
          exportable
          actions={(row: JuetengDraw) => (
            <>
              {/* SCHEDULED → Open for bets */}
              {row.status === "SCHEDULED" && (
                <button
                  className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors"
                  onClick={() =>
                    updateDraw.mutate(
                      {
                        id: row.id,
                        data: {
                          status: "OPEN",
                          openedAt: new Date().toISOString(),
                        } as Partial<JuetengDraw>,
                      },
                      { onSuccess: () => toast.success("Draw opened for bets") },
                    )
                  }
                  disabled={updateDraw.isPending}
                >
                  <Dices size={14} />
                  Open
                </button>
              )}
              {/* OPEN → Close (lock bets) */}
              {row.status === "OPEN" && (
                <button
                  className="text-xs px-2.5 py-1 bg-brand-red/10 text-brand-red-light rounded-lg hover:bg-brand-red/15 flex items-center gap-1 transition-colors"
                  onClick={() =>
                    updateDraw.mutate(
                      {
                        id: row.id,
                        data: {
                          status: "CLOSED",
                          closedAt: new Date().toISOString(),
                        } as Partial<JuetengDraw>,
                      },
                      { onSuccess: () => toast.success("Draw closed — bets locked") },
                    )
                  }
                  disabled={updateDraw.isPending}
                >
                  <Lock size={14} />
                  Close
                </button>
              )}
              {/* CLOSED → Re-open */}
              {row.status === "CLOSED" && (
                <button
                  className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors"
                  onClick={() =>
                    updateDraw.mutate(
                      {
                        id: row.id,
                        data: {
                          status: "OPEN",
                          openedAt: new Date().toISOString(),
                          closedAt: null,
                        } as Partial<JuetengDraw>,
                      },
                      { onSuccess: () => toast.success("Draw re-opened for bets") },
                    )
                  }
                  disabled={updateDraw.isPending}
                >
                  <LockOpen size={14} />
                  Open
                </button>
              )}
              {/* OPEN or CLOSED → Encode result */}
              {(row.status === "OPEN" || row.status === "CLOSED") && (
                <button
                  className="text-xs px-2.5 py-1 bg-brand-gold/10 text-brand-gold-light rounded-lg hover:bg-brand-gold/15 flex items-center gap-1 transition-colors"
                  onClick={() => handleEncode(row)}
                >
                  <Dices size={14} />
                  Encode
                </button>
              )}
              {/* DRAWN → Settle (pay winners + commissions) */}
              {row.status === "DRAWN" && (
                <button
                  className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                  onClick={() =>
                    settleDraw.mutate(row.id, {
                      onSuccess: () => toast.success("Draw settled — commissions paid"),
                    })
                  }
                  disabled={settleDraw.isPending}
                >
                  <CheckCircle size={14} />
                  Settle
                </button>
              )}
            </>
          )}
        />

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="text-sm text-text-muted">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Draw Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Draw"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={createDate}
              onChange={(e) => setCreateDate(e.target.value)}
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-muted font-medium">
                Draw Type
              </label>
              <div className="flex gap-2">
                {schedules.filter((s) => s.isActive).map((s) => (
                  <button
                    key={s.drawType}
                    type="button"
                    onClick={() => setCreateType(s.drawType)}
                    className={`flex-1 text-xs py-2 px-3 rounded-lg border transition-colors ${
                      createType === s.drawType
                        ? "bg-brand-gold/15 text-brand-gold border-brand-gold/40"
                        : "bg-white/5 text-text-muted border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {drawTypeLabel(s.drawType)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {schedules.find((s) => s.drawType === createType) && (
            <div className="card-3d p-3 text-center">
              <p className="text-xs text-text-muted">
                Scheduled at{" "}
                <span className="text-brand-gold font-medium">
                  {drawTypeLabel(createType)}
                </span>{" "}
                on{" "}
                <span className="text-text-primary font-medium">
                  {new Date(createDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              isLoading={createDraw.isPending}
              onClick={handleCreate}
            >
              Create Draw
            </Button>
          </div>
        </div>
      </Modal>

      {/* Encode Modal */}
      <Modal
        isOpen={showEncode}
        onClose={() => setShowEncode(false)}
        title="Encode Draw Result"
      >
        <div className="space-y-4">
          <div className="card-3d p-4 text-center">
            <p className="text-sm text-text-muted">
              {selectedDraw
                ? `${drawTypeLabel(selectedDraw.drawType)} Draw — ${new Date(
                    selectedDraw.drawDate,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`
                : ""}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {selectedDraw?.totalBets.toLocaleString()} bets · ₱
              {selectedDraw?.totalStake.toLocaleString()} stake
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Number 1"
              type="number"
              placeholder="1-37"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
            />
            <Input
              label="Number 2"
              type="number"
              placeholder="1-37"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
            />
          </div>

          {num1 && num2 && (
            <div className="flex items-center justify-center gap-3 py-3">
              <span className="w-14 h-14 rounded-full bg-brand-red text-white text-xl font-bold flex items-center justify-center border-3 border-brand-gold">
                {num1}
              </span>
              <span className="text-brand-gold text-xl font-bold">—</span>
              <span className="w-14 h-14 rounded-full bg-brand-red text-white text-xl font-bold flex items-center justify-center border-3 border-brand-gold">
                {num2}
              </span>
            </div>
          )}

          <div className="card-3d p-3 text-center border-brand-gold/30">
            <p className="text-xs text-brand-gold">
              This action is irreversible. Ensure the numbers are correct before
              publishing.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowEncode(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              isLoading={updateDraw.isPending}
              onClick={handleSubmitResult}
            >
              Publish Result
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
