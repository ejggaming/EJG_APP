import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import { formatCurrency } from "../../utils";
import {
  Users,
  Dices,
  Wallet,
  UserPlus,
  ShieldCheck,
  Mail,
  Phone,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

/* ── Customers (from /api/agent's bettor list + KYC + Wallet) ── */
const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Maria Santos",
    mobile: "09171234567",
    email: "maria@email.com",
    totalBets: 89,
    totalSpent: 4500,
    walletBalance: 1250,
    status: "active" as const,
    kycStatus: "APPROVED" as const,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastBet: "12-35 (₱50) · 11:00 AM",
    joined: "Jan 15, 2026",
  },
  {
    id: "2",
    name: "Pedro Reyes",
    mobile: "09189876543",
    email: "pedro@email.com",
    totalBets: 56,
    totalSpent: 2800,
    walletBalance: 800,
    status: "active" as const,
    kycStatus: "APPROVED" as const,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastBet: "7-23 (₱100) · 11:00 AM",
    joined: "Jan 20, 2026",
  },
  {
    id: "3",
    name: "Anna Cruz",
    mobile: "09201234567",
    email: "anna@email.com",
    totalBets: 34,
    totalSpent: 1700,
    walletBalance: 300,
    status: "active" as const,
    kycStatus: "APPROVED" as const,
    isEmailVerified: true,
    isPhoneVerified: false,
    lastBet: "19-31 (₱20) · 4:00 PM",
    joined: "Feb 01, 2026",
  },
  {
    id: "4",
    name: "Jose Garcia",
    mobile: "09221111222",
    email: "jose@email.com",
    totalBets: 120,
    totalSpent: 6000,
    walletBalance: 2100,
    status: "active" as const,
    kycStatus: "PENDING" as const,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastBet: "3-28 (₱50) · 11:00 AM",
    joined: "Dec 10, 2025",
  },
  {
    id: "5",
    name: "Rosa Bautista",
    mobile: "09339998877",
    email: "rosa@email.com",
    totalBets: 12,
    totalSpent: 600,
    walletBalance: 50,
    status: "inactive" as const,
    kycStatus: "APPROVED" as const,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastBet: "5-18 (₱10) · 9:00 PM",
    joined: "Feb 10, 2026",
  },
  {
    id: "6",
    name: "Carlos Mendoza",
    mobile: "09451112233",
    email: "carlos@email.com",
    totalBets: 0,
    totalSpent: 0,
    walletBalance: 0,
    status: "pending" as const,
    kycStatus: "PENDING" as const,
    isEmailVerified: false,
    isPhoneVerified: false,
    lastBet: "—",
    joined: "Feb 18, 2026",
  },
  {
    id: "7",
    name: "Elena Flores",
    mobile: "09561234567",
    email: "elena@email.com",
    totalBets: 3,
    totalSpent: 150,
    walletBalance: 0,
    status: "active" as const,
    kycStatus: "REJECTED" as const,
    isEmailVerified: true,
    isPhoneVerified: false,
    lastBet: "22-30 (₱50) · 4:00 PM",
    joined: "Feb 15, 2026",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-brand-green/20 text-brand-green",
  inactive: "bg-gray-500/20 text-gray-400",
  pending: "bg-brand-gold/20 text-brand-gold",
};
const statusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
};

const kycColors: Record<string, string> = {
  APPROVED: "bg-brand-green/20 text-brand-green",
  PENDING: "bg-brand-gold/20 text-brand-gold",
  REJECTED: "bg-brand-red/20 text-brand-red",
  REQUIRES_MORE_INFO: "bg-blue-500/20 text-blue-400",
};

/* ── Agent referral link (for customer recruitment) ── */
const REFERRAL_CODE = "AGT-COBR-00123";
const REFERRAL_LINK = `https://jueteng.app/register?ref=${REFERRAL_CODE}`;

export default function AgentCustomers() {
  const activeCount = MOCK_CUSTOMERS.filter(
    (c) => c.status === "active",
  ).length;
  const totalBets = MOCK_CUSTOMERS.reduce((a, c) => a + c.totalBets, 0);
  const totalSpent = MOCK_CUSTOMERS.reduce((a, c) => a + c.totalSpent, 0);
  const pendingKyc = MOCK_CUSTOMERS.filter(
    (c) => c.kycStatus === "PENDING",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Customers</h1>
          <p className="text-text-muted mt-1">
            {MOCK_CUSTOMERS.length} registered · {activeCount} active
          </p>
        </div>
        <button className="bg-brand-gold text-white px-4 py-2 rounded-xl font-medium hover:bg-brand-gold/80 flex items-center gap-2 transition-colors">
          <UserPlus size={18} />
          Add Customer
        </button>
      </div>

      {/* Referral Link */}
      <div className="card-3d p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider">
            Referral Link
          </p>
          <p className="text-sm text-text-primary font-mono mt-0.5 truncate max-w-xs">
            {REFERRAL_LINK}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-lg bg-brand-gold/10 text-brand-gold text-xs font-bold">
            {REFERRAL_CODE}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(REFERRAL_LINK);
              toast.success("Referral link copied!");
            }}
            className="p-2 rounded-lg bg-surface-elevated text-text-secondary hover:text-brand-gold transition-colors"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <CardGrid>
        <StatCard
          label="Active"
          value={activeCount}
          icon={<Users size={20} />}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          label="Total Bets"
          value={totalBets}
          icon={<Dices size={20} />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={<Wallet size={20} />}
          color="orange"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label="Pending KYC"
          value={pendingKyc}
          icon={<ShieldCheck size={20} />}
          color="purple"
        />
      </CardGrid>

      {/* Customers DataTable */}
      <DataTable
        title="Customer List"
        columns={
          [
            {
              key: "name",
              label: "Customer",
              sortable: true,
              render: (v: string, row: (typeof MOCK_CUSTOMERS)[0]) => (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-xs font-bold shrink-0">
                    {v[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {v}
                    </p>
                    <p className="text-[10px] text-text-muted">{row.mobile}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[v]}`}
                >
                  {statusLabels[v]}
                </span>
              ),
            },
            {
              key: "kycStatus",
              label: "KYC",
              sortable: true,
              render: (v: string, row: (typeof MOCK_CUSTOMERS)[0]) => (
                <div className="flex items-center gap-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${kycColors[v] ?? ""}`}
                  >
                    {v}
                  </span>
                  <div className="flex gap-0.5 ml-1">
                    <Mail
                      size={10}
                      className={
                        row.isEmailVerified
                          ? "text-brand-green"
                          : "text-gray-500"
                      }
                    />
                    <Phone
                      size={10}
                      className={
                        row.isPhoneVerified
                          ? "text-brand-green"
                          : "text-gray-500"
                      }
                    />
                  </div>
                </div>
              ),
            },
            {
              key: "totalBets",
              label: "Bets",
              align: "right" as const,
              sortable: true,
              render: (v: number) => <span className="font-mono">{v}</span>,
            },
            {
              key: "totalSpent",
              label: "Spent",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="font-semibold text-brand-gold">
                  {formatCurrency(v)}
                </span>
              ),
            },
            {
              key: "walletBalance",
              label: "Balance",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="text-sm text-text-primary">
                  {formatCurrency(v)}
                </span>
              ),
            },
            {
              key: "lastBet",
              label: "Last Bet",
              sortable: false,
              render: (v: string) => (
                <span className="text-xs text-text-muted">{v}</span>
              ),
            },
            { key: "joined", label: "Joined", sortable: true },
          ] satisfies DataTableColumn[]
        }
        data={MOCK_CUSTOMERS}
        pageSize={10}
        exportable
      />
    </div>
  );
}
