import { Card, Badge, Button } from "../../components";
import { formatCurrency } from "../../utils";
import toast from "react-hot-toast";

const PENDING_WITHDRAWALS = [
  {
    id: "1",
    user: "Jose Garcia",
    mobile: "09221111222",
    amount: 15000,
    method: "GCash",
    account: "09221111222",
    date: "Feb 19, 2026 10:30 AM",
  },
  {
    id: "2",
    user: "Maria Santos",
    mobile: "09171234567",
    amount: 5000,
    method: "Maya",
    account: "09171234567",
    date: "Feb 19, 2026 9:15 AM",
  },
  {
    id: "3",
    user: "Pedro Reyes",
    mobile: "09189876543",
    amount: 3000,
    method: "Bank",
    account: "1234-5678-9012",
    date: "Feb 18, 2026 4:00 PM",
  },
];

const RECENT_TRANSACTIONS = [
  {
    id: "1",
    type: "deposit" as const,
    user: "Anna Cruz",
    amount: 1000,
    method: "GCash",
    status: "completed" as const,
    date: "Feb 19, 2026 10:45 AM",
  },
  {
    id: "2",
    type: "payout" as const,
    user: "Jose Garcia",
    amount: 5000,
    method: "Auto",
    status: "completed" as const,
    date: "Feb 19, 2026 11:05 AM",
  },
  {
    id: "3",
    type: "withdraw" as const,
    user: "Rosa Bautista",
    amount: 2000,
    method: "Maya",
    status: "completed" as const,
    date: "Feb 19, 2026 8:30 AM",
  },
  {
    id: "4",
    type: "commission" as const,
    user: "Ricardo Dalisay",
    amount: 480,
    method: "Auto",
    status: "completed" as const,
    date: "Feb 19, 2026 11:05 AM",
  },
  {
    id: "5",
    type: "deposit" as const,
    user: "Pedro Reyes",
    amount: 500,
    method: "Bank",
    status: "pending" as const,
    date: "Feb 18, 2026 5:00 PM",
  },
];

const txBadge = {
  deposit: { variant: "green" as const, label: "Deposit" },
  withdraw: { variant: "red" as const, label: "Withdraw" },
  payout: { variant: "gold" as const, label: "Payout" },
  commission: { variant: "blue" as const, label: "Commission" },
};

export default function FinanceManagement() {
  const handleApprove = (id: string) => {
    toast.success(`Withdrawal ${id} approved`);
  };

  const handleReject = (id: string) => {
    toast.error(`Withdrawal ${id} rejected`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Financial Management
        </h1>
        <p className="text-text-muted text-sm">
          Manage deposits, withdrawals, and settlements
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <p className="text-xl font-bold text-brand-green">
            {formatCurrency(245000)}
          </p>
          <p className="text-xs text-text-muted">Total Deposits Today</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-red">
            {formatCurrency(23000)}
          </p>
          <p className="text-xs text-text-muted">Pending Withdrawals</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-gold">
            {formatCurrency(162350)}
          </p>
          <p className="text-xs text-text-muted">Bet Revenue Today</p>
        </Card>
        <Card>
          <p className="text-xl font-bold text-brand-blue">
            {formatCurrency(48705)}
          </p>
          <p className="text-xs text-text-muted">Gov't Share (30%)</p>
        </Card>
      </div>

      {/* Pending Withdrawals */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Pending Withdrawals
        </h2>
        <div className="space-y-2">
          {PENDING_WITHDRAWALS.map((w) => (
            <Card key={w.id}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-bold">
                    {w.user[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {w.user}
                    </p>
                    <p className="text-xs text-text-muted">
                      {w.mobile} · {w.method} → {w.account}
                    </p>
                    <p className="text-[10px] text-text-muted">{w.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-brand-gold">
                    {formatCurrency(w.amount)}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="green"
                      onClick={() => handleApprove(w.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(w.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {PENDING_WITHDRAWALS.length === 0 && (
            <Card className="text-center py-8">
              <p className="text-text-muted">No pending withdrawals</p>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Recent Transactions
        </h2>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-text-muted uppercase border-b border-border-default">
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">User</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Method</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_TRANSACTIONS.map((tx) => {
                const style = txBadge[tx.type];
                return (
                  <tr key={tx.id} className="border-b border-border-default/30">
                    <td className="py-2.5 pr-4">
                      <Badge variant={style.variant}>{style.label}</Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-text-primary">{tx.user}</td>
                    <td className="py-2.5 pr-4 text-brand-gold font-semibold">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-2.5 pr-4 text-text-secondary">
                      {tx.method}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge
                        variant={tx.status === "completed" ? "green" : "gold"}
                      >
                        {tx.status === "completed" ? "Done" : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-text-muted text-xs whitespace-nowrap">
                      {tx.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
