import { useState } from "react";
import { Card, Badge, Button, Input, Modal } from "../../components";
import toast from "react-hot-toast";

interface Draw {
  id: string;
  time: string;
  date: string;
  status: "scheduled" | "open" | "closed" | "drawn" | "published";
  winningNumbers?: [number, number];
  totalBets: number;
  totalStake: number;
  winners: number;
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
    winners: 3,
  },
  {
    id: "2",
    time: "4:00 PM",
    date: "Feb 19, 2026",
    status: "open",
    totalBets: 892,
    totalStake: 44600,
    winners: 0,
  },
  {
    id: "3",
    time: "9:00 PM",
    date: "Feb 19, 2026",
    status: "scheduled",
    totalBets: 0,
    totalStake: 0,
    winners: 0,
  },
  {
    id: "4",
    time: "11:00 AM",
    date: "Feb 20, 2026",
    status: "scheduled",
    totalBets: 0,
    totalStake: 0,
    winners: 0,
  },
  {
    id: "5",
    time: "4:00 PM",
    date: "Feb 20, 2026",
    status: "scheduled",
    totalBets: 0,
    totalStake: 0,
    winners: 0,
  },
  {
    id: "6",
    time: "9:00 PM",
    date: "Feb 20, 2026",
    status: "scheduled",
    totalBets: 0,
    totalStake: 0,
    winners: 0,
  },
];

const statusStyles = {
  scheduled: { variant: "gray" as const, label: "Scheduled" },
  open: { variant: "gold" as const, label: "Open" },
  closed: { variant: "red" as const, label: "Closed" },
  drawn: { variant: "blue" as const, label: "Drawn" },
  published: { variant: "green" as const, label: "Published" },
};

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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Draw Management
        </h1>
        <p className="text-text-muted text-sm">
          Manage draw schedules and encode results
        </p>
      </div>

      {/* Today overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <p className="text-xl font-bold text-brand-green">
            {MOCK_DRAWS.filter((d) => d.status === "published").length}
          </p>
          <p className="text-xs text-text-muted">Published</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-gold">
            {MOCK_DRAWS.filter((d) => d.status === "open").length}
          </p>
          <p className="text-xs text-text-muted">Open</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-text-muted">
            {MOCK_DRAWS.filter((d) => d.status === "scheduled").length}
          </p>
          <p className="text-xs text-text-muted">Scheduled</p>
        </Card>
      </div>

      {/* Draws */}
      <div className="space-y-2">
        {MOCK_DRAWS.map((draw) => {
          const style = statusStyles[draw.status];
          return (
            <Card key={draw.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      {draw.time} Draw
                    </p>
                    <p className="text-xs text-text-muted">{draw.date}</p>
                  </div>
                  <Badge variant={style.variant}>{style.label}</Badge>
                </div>
                {draw.winningNumbers && (
                  <div className="flex gap-1.5">
                    {draw.winningNumbers.map((n) => (
                      <span
                        key={n}
                        className="w-10 h-10 rounded-full bg-brand-red text-white text-sm font-bold flex items-center justify-center border-2 border-brand-gold"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-text-muted">Total Bets</p>
                  <p className="text-text-primary font-medium">
                    {draw.totalBets.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Total Stake</p>
                  <p className="text-brand-gold font-medium">
                    ₱{draw.totalStake.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Winners</p>
                  <p className="text-brand-green font-medium">{draw.winners}</p>
                </div>
              </div>
              {(draw.status === "open" || draw.status === "closed") && (
                <div className="flex gap-2 mt-3">
                  {draw.status === "open" && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => toast.success("Bets locked")}
                    >
                      Lock Bets
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="gold"
                    onClick={() => handleEncode(draw)}
                  >
                    Encode Result
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Encode Modal */}
      <Modal
        isOpen={showEncode}
        onClose={() => setShowEncode(false)}
        title="Encode Draw Result"
      >
        <div className="space-y-4">
          <Card className="text-center">
            <p className="text-sm text-text-muted">
              {selectedDraw?.time} Draw — {selectedDraw?.date}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {selectedDraw?.totalBets.toLocaleString()} bets · ₱
              {selectedDraw?.totalStake.toLocaleString()} stake
            </p>
          </Card>

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

          <Card className="border border-brand-gold/30 text-center">
            <p className="text-xs text-brand-gold">
              ⚠️ This action is irreversible. Ensure the numbers are correct
              before publishing.
            </p>
          </Card>

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
