import { useState } from "react";
import { Card, Badge, Button, Input } from "../../components";
import toast from "react-hot-toast";

interface UserRow {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: string;
  kycStatus: "approved" | "pending" | "rejected" | "none";
  status: "active" | "suspended" | "inactive";
  joined: string;
  totalBets: number;
}

const MOCK_USERS: UserRow[] = [
  {
    id: "1",
    name: "Maria Santos",
    mobile: "09171234567",
    email: "maria@mail.com",
    role: "PLAYER",
    kycStatus: "approved",
    status: "active",
    joined: "Jan 15, 2026",
    totalBets: 89,
  },
  {
    id: "2",
    name: "Pedro Reyes",
    mobile: "09189876543",
    email: "pedro@mail.com",
    role: "PLAYER",
    kycStatus: "approved",
    status: "active",
    joined: "Jan 20, 2026",
    totalBets: 56,
  },
  {
    id: "3",
    name: "Anna Cruz",
    mobile: "09201234567",
    email: "anna@mail.com",
    role: "PLAYER",
    kycStatus: "pending",
    status: "active",
    joined: "Feb 01, 2026",
    totalBets: 34,
  },
  {
    id: "4",
    name: "Jose Garcia",
    mobile: "09221111222",
    email: "jose@mail.com",
    role: "PLAYER",
    kycStatus: "approved",
    status: "active",
    joined: "Dec 10, 2025",
    totalBets: 120,
  },
  {
    id: "5",
    name: "Rosa Bautista",
    mobile: "09339998877",
    email: "rosa@mail.com",
    role: "PLAYER",
    kycStatus: "none",
    status: "inactive",
    joined: "Feb 10, 2026",
    totalBets: 12,
  },
  {
    id: "6",
    name: "Carlos Mendoza",
    mobile: "09451112233",
    email: "carlos@mail.com",
    role: "PLAYER",
    kycStatus: "rejected",
    status: "suspended",
    joined: "Feb 18, 2026",
    totalBets: 0,
  },
];

const kycBadge = {
  approved: { variant: "green" as const, label: "Verified" },
  pending: { variant: "gold" as const, label: "Pending" },
  rejected: { variant: "red" as const, label: "Rejected" },
  none: { variant: "gray" as const, label: "No KYC" },
};

const statusBadge = {
  active: { variant: "green" as const, label: "Active" },
  suspended: { variant: "red" as const, label: "Suspended" },
  inactive: { variant: "gray" as const, label: "Inactive" },
};

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = MOCK_USERS.filter((u) => {
    const match =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search);
    if (filter === "all") return match;
    if (filter === "pending_kyc") return match && u.kycStatus === "pending";
    if (filter === "suspended") return match && u.status === "suspended";
    return match;
  });

  const handleAction = (_userId: string, action: string) => {
    toast.success(`User ${action} successfully`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            User Management
          </h1>
          <p className="text-text-muted text-sm">
            {MOCK_USERS.length} total users
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            label=""
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "pending_kyc", label: "Pending KYC" },
            { key: "suspended", label: "Suspended" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-brand-red text-white"
                  : "bg-surface-elevated text-text-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table - desktop */}
      <div className="hidden md:block">
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-text-muted uppercase border-b border-border-default">
                <th className="pb-3 pr-4">User</th>
                <th className="pb-3 pr-4">Mobile</th>
                <th className="pb-3 pr-4">KYC</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Bets</th>
                <th className="pb-3 pr-4">Joined</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const kyc = kycBadge[u.kycStatus];
                const status = statusBadge[u.status];
                return (
                  <tr key={u.id} className="border-b border-border-default/30">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-bold text-xs">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">
                      {u.mobile}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={kyc.variant}>{kyc.label}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">
                      {u.totalBets}
                    </td>
                    <td className="py-3 pr-4 text-text-muted text-xs">
                      {u.joined}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {u.kycStatus === "pending" && (
                          <Button
                            size="sm"
                            variant="green"
                            onClick={() => handleAction(u.id, "KYC approved")}
                          >
                            Approve
                          </Button>
                        )}
                        {u.status === "active" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleAction(u.id, "suspended")}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleAction(u.id, "activated")}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Card list - mobile */}
      <div className="md:hidden space-y-2">
        {filtered.map((u) => {
          const kyc = kycBadge[u.kycStatus];
          const status = statusBadge[u.status];
          return (
            <Card key={u.id}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-bold">
                  {u.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {u.name}
                  </p>
                  <p className="text-xs text-text-muted">{u.mobile}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={kyc.variant}>{kyc.label}</Badge>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {u.kycStatus === "pending" && (
                  <Button
                    size="sm"
                    variant="green"
                    onClick={() => handleAction(u.id, "KYC approved")}
                  >
                    Approve KYC
                  </Button>
                )}
                {u.status === "active" ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleAction(u.id, "suspended")}
                  >
                    Suspend
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAction(u.id, "activated")}
                  >
                    Activate
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
