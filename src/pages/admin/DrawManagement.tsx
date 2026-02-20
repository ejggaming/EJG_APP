import { useState } from "react";
import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import { Input, Modal } from "../../components";
import {
  CheckCircle,
  Clock,
  Lock,
  CalendarDays,
  Dices,
  AlertTriangle,
  Banknote,
} from "lucide-react";
import { Button } from "../../components";
import toast from "react-hot-toast";

interface Draw {
  id: string;
  time: string;
  date: string;
  status: "scheduled" | "open" | "closed" | "drawn" | "published" | "locked";
  winningNumbers?: [number, number];
  totalBets: number;
  totalStake: number;
  totalPayout: number;
  winners: number;
  disputes: number;
  cutoffTime: string;
  encodedBy?: string;
  approvedBy?: string;
}

const MOCK_DRAWS: Draw[] = [
  {
    id: "1",
    time: "11:00 AM",
    date: "Feb 19, 2026",
    status: "published",
    winningNumbers: [12, 35],
    totalBets: 1245,
    totalStake: 62250,
    totalPayout: 21000,
    winners: 3,
    disputes: 1,
    cutoffTime: "10:45 AM",
    encodedBy: "Admin Juan",
    approvedBy: "Admin Maria",
  },
  {
    id: "2",
    time: "4:00 PM",
    date: "Feb 19, 2026",
    status: "open",
    totalBets: 892,
    totalStake: 44600,
    totalPayout: 0,
    winners: 0,
    disputes: 0,
    cutoffTime: "3:45 PM",
  },
  {
    id: "3",
    time: "9:00 PM",
    date: "Feb 19, 2026",
    status: "scheduled",
    totalBets: 0,
    totalStake: 0,
    totalPayout: 0,
    winners: 0,
    disputes: 0,
    cutoffTime: "8:45 PM",
  },
  {
    id: "4",
    time: "11:00 AM",
    date: "Feb 18, 2026",
    status: "published",
    winningNumbers: [7, 22],
    totalBets: 1580,
    totalStake: 79000,
    totalPayout: 35000,
    winners: 5,
    disputes: 0,
    cutoffTime: "10:45 AM",
    encodedBy: "Admin Juan",
    approvedBy: "Admin Maria",
  },
  {
    id: "5",
    time: "4:00 PM",
    date: "Feb 18, 2026",
    status: "published",
    winningNumbers: [19, 31],
    totalBets: 1120,
    totalStake: 56000,
    totalPayout: 14000,
    winners: 2,
    disputes: 2,
    cutoffTime: "3:45 PM",
    encodedBy: "Admin Pedro",
    approvedBy: "Admin Juan",
  },
  {
    id: "6",
    time: "9:00 PM",
    date: "Feb 18, 2026",
    status: "published",
    winningNumbers: [3, 28],
    totalBets: 980,
    totalStake: 49000,
    totalPayout: 7000,
    winners: 1,
    disputes: 0,
    cutoffTime: "8:45 PM",
    encodedBy: "Admin Maria",
    approvedBy: "Admin Juan",
  },
  {
    id: "7",
    time: "11:00 AM",
    date: "Feb 20, 2026",
    status: "scheduled",
    totalBets: 0,
    totalStake: 0,
    totalPayout: 0,
    winners: 0,
    disputes: 0,
    cutoffTime: "10:45 AM",
  },
];

export default function DrawManagement() {
  const [showEncode, setShowEncode] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEncode = (draw: Draw) => {
    setSelectedDraw(draw);
    setNum1("");
    setNum2("");
    setShowEncode(true);
  };

  const handleSubmitResult = async () => {
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

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(`Draw result encoded: ${n1} - ${n2}`);
    setIsSubmitting(false);
    setShowEncode(false);
  };

  const published = MOCK_DRAWS.filter((d) => d.status === "published").length;
  const open = MOCK_DRAWS.filter((d) => d.status === "open").length;
  const scheduled = MOCK_DRAWS.filter((d) => d.status === "scheduled").length;

  const totalStake = MOCK_DRAWS.reduce((a, d) => a + d.totalStake, 0);
  const totalPayout = MOCK_DRAWS.reduce((a, d) => a + d.totalPayout, 0);
  const totalDisputes = MOCK_DRAWS.reduce((a, d) => a + d.disputes, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Draw Management
        </h1>
        <p className="text-text-muted mt-1">
          Manage draw schedules, encode results, and handle disputes
        </p>
      </div>

      {/* Summary Stats */}
      <CardGrid columns={6}>
        <StatCard
          label="Published"
          value={published}
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
          label="Disputes"
          value={totalDisputes}
          icon={<AlertTriangle size={18} />}
          color="red"
        />
      </CardGrid>

      {/* Draws DataTable */}
      <DataTable
        title="All Draws"
        columns={
          [
            {
              key: "date",
              label: "Date",
              sortable: true,
            },
            {
              key: "time",
              label: "Draw Time",
              sortable: true,
            },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "published"
                    ? "text-brand-green bg-brand-green/10"
                    : v === "open"
                      ? "text-brand-gold bg-brand-gold/10"
                      : v === "closed"
                        ? "text-brand-red bg-brand-red/10"
                        : v === "locked"
                          ? "text-orange-400 bg-orange-400/10"
                          : v === "drawn"
                            ? "text-brand-blue bg-brand-blue/10"
                            : "text-text-muted bg-white/5";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${color}`}
                  >
                    {v}
                  </span>
                );
              },
            },
            {
              key: "winningNumbers",
              label: "Result",
              searchable: false,
              sortable: false,
              render: (v: [number, number] | undefined) =>
                v ? (
                  <div className="flex gap-1">
                    {v.map((n) => (
                      <span
                        key={n}
                        className="w-7 h-7 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center border border-brand-gold"
                      >
                        {n}
                      </span>
                    ))}
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
              key: "winners",
              label: "Winners",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span
                  className={
                    v > 0 ? "text-brand-green font-medium" : "text-text-muted"
                  }
                >
                  {v}
                </span>
              ),
            },
            {
              key: "disputes",
              label: "Disputes",
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
                  {v > 0 ? v : "—"}
                </span>
              ),
            },
            {
              key: "cutoffTime",
              label: "Cutoff",
              sortable: true,
            },
            {
              key: "encodedBy",
              label: "Encoded By",
              sortable: true,
              render: (v: string | undefined) => (
                <span className={v ? "text-text-primary" : "text-text-muted"}>
                  {v || "—"}
                </span>
              ),
            },
            {
              key: "approvedBy",
              label: "Approved By",
              sortable: true,
              render: (v: string | undefined) => (
                <span
                  className={v ? "text-brand-green-light" : "text-text-muted"}
                >
                  {v || "—"}
                </span>
              ),
            },
          ] satisfies DataTableColumn[]
        }
        data={MOCK_DRAWS}
        pageSize={10}
        exportable
        actions={(row: Draw) => (
          <>
            {row.status === "open" && (
              <button
                className="text-xs px-2.5 py-1 bg-brand-red/10 text-brand-red-light rounded-lg hover:bg-brand-red/15 flex items-center gap-1 transition-colors"
                onClick={() => toast.success("Bets locked")}
              >
                <Lock size={14} />
                Lock
              </button>
            )}
            {(row.status === "open" || row.status === "closed") && (
              <button
                className="text-xs px-2.5 py-1 bg-brand-gold/10 text-brand-gold-light rounded-lg hover:bg-brand-gold/15 flex items-center gap-1 transition-colors"
                onClick={() => handleEncode(row)}
              >
                <Dices size={14} />
                Encode
              </button>
            )}
          </>
        )}
      />

      {/* Encode Modal */}
      <Modal
        isOpen={showEncode}
        onClose={() => setShowEncode(false)}
        title="Encode Draw Result"
      >
        <div className="space-y-4">
          <div className="card-3d p-4 text-center">
            <p className="text-sm text-text-muted">
              {selectedDraw?.time} Draw — {selectedDraw?.date}
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
              isLoading={isSubmitting}
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
