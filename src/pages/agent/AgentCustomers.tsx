import { useState } from "react";
import { Card, Badge, Button, Input } from "../../components";
import { formatCurrency } from "../../utils";

const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Maria Santos",
    mobile: "09171234567",
    totalBets: 89,
    totalSpent: 4500,
    status: "active" as const,
    joined: "Jan 15, 2026",
  },
  {
    id: "2",
    name: "Pedro Reyes",
    mobile: "09189876543",
    totalBets: 56,
    totalSpent: 2800,
    status: "active" as const,
    joined: "Jan 20, 2026",
  },
  {
    id: "3",
    name: "Anna Cruz",
    mobile: "09201234567",
    totalBets: 34,
    totalSpent: 1700,
    status: "active" as const,
    joined: "Feb 01, 2026",
  },
  {
    id: "4",
    name: "Jose Garcia",
    mobile: "09221111222",
    totalBets: 120,
    totalSpent: 6000,
    status: "active" as const,
    joined: "Dec 10, 2025",
  },
  {
    id: "5",
    name: "Rosa Bautista",
    mobile: "09339998877",
    totalBets: 12,
    totalSpent: 600,
    status: "inactive" as const,
    joined: "Feb 10, 2026",
  },
  {
    id: "6",
    name: "Carlos Mendoza",
    mobile: "09451112233",
    totalBets: 0,
    totalSpent: 0,
    status: "pending" as const,
    joined: "Feb 18, 2026",
  },
];

const statusBadge = {
  active: { variant: "green" as const, label: "Active" },
  inactive: { variant: "gray" as const, label: "Inactive" },
  pending: { variant: "gold" as const, label: "Pending KYC" },
};

export default function AgentCustomers() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search),
  );

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">My Customers</h1>
          <p className="text-text-muted text-sm">
            {MOCK_CUSTOMERS.length} registered
          </p>
        </div>
        <Button variant="gold" size="sm">
          + Add Customer
        </Button>
      </div>

      <Input
        label=""
        placeholder="Search by name or mobile..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center">
          <p className="text-lg font-bold text-brand-green">
            {MOCK_CUSTOMERS.filter((c) => c.status === "active").length}
          </p>
          <p className="text-[10px] text-text-muted">Active</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-bold text-text-primary">
            {MOCK_CUSTOMERS.reduce((a, c) => a + c.totalBets, 0)}
          </p>
          <p className="text-[10px] text-text-muted">Total Bets</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-bold text-brand-gold">
            {formatCurrency(
              MOCK_CUSTOMERS.reduce((a, c) => a + c.totalSpent, 0),
            )}
          </p>
          <p className="text-[10px] text-text-muted">Total Spent</p>
        </Card>
      </div>

      {/* Customer List */}
      <div className="space-y-2">
        {filtered.map((customer) => {
          const badge = statusBadge[customer.status];
          return (
            <Card
              key={customer.id}
              className="hover:bg-surface-elevated transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                  {customer.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {customer.name}
                    </p>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <p className="text-xs text-text-muted">{customer.mobile}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-gold">
                    {formatCurrency(customer.totalSpent)}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {customer.totalBets} bets
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-text-muted py-8">No customers found</p>
        )}
      </div>
    </div>
  );
}
