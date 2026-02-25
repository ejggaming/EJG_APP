import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import {
  Users,
  UserPlus,
  Lock,
  Edit2,
  ShieldAlert,
  Ban,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { UserManagementSkeleton } from "../../components/ChineseSkeleton";
import toast from "react-hot-toast";
import { useAllUsersQuery } from "../../hooks/useAdmin";
import type { AdminUser } from "../../hooks/useAdmin";

export default function UserManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  // Debounce search — only update query after 400ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Real user list
  const { data: usersData, isLoading } = useAllUsersQuery({
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    limit: 100,
  });

  const users = usersData?.users ?? [];
  const totalUsers = usersData?.count ?? 0;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const suspendedUsers = users.filter((u) => u.status === "suspended").length;
  // Derived from the already-loaded users list — always consistent with the table
  const kycPending = users.filter((u) => u.kyc?.status === "PENDING").length;

  if (isLoading) return <UserManagementSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            User Management
          </h1>
          <p className="text-text-muted mt-1">
            Manage platform users and access permissions
          </p>
        </div>
        <button className="bg-brand-red text-white px-4 py-2 rounded-xl font-medium hover:bg-brand-red-dark flex items-center gap-2 transition-colors">
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* Key Stats */}
      <CardGrid>
        <StatCard
          label="Total Users"
          value={totalUsers}
          icon={<Users size={18} />}
          color="blue"
        />
        <StatCard
          label="Active Users"
          value={activeUsers}
          icon={<Users size={18} />}
          color="green"
        />
        <StatCard
          label="KYC Pending"
          value={kycPending}
          icon={<ShieldAlert size={18} />}
          color="orange"
        />
        <StatCard
          label="Suspended"
          value={suspendedUsers}
          icon={<Lock size={18} />}
          color="red"
        />
      </CardGrid>

      {/* KYC notification banner — redirect to KYC page */}
      {kycPending > 0 && (
        <button
          onClick={() => navigate("/admin/kyc")}
          className="w-full flex items-center justify-between px-4 py-3 bg-brand-gold/10 border border-brand-gold/30 rounded-xl hover:bg-brand-gold/15 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold" />
            </span>
            <span className="text-sm font-medium text-brand-gold">
              {kycPending} KYC submission{kycPending !== 1 ? "s" : ""} pending review
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-brand-gold/80 group-hover:text-brand-gold transition-colors">
            Review in KYC Management
            <ArrowRight size={14} />
          </span>
        </button>
      )}

      {/* Search / Filter Bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by email, username, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-surface-elevated border border-border-default rounded-xl px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-surface-elevated border border-border-default rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
        >
          <option value="">All Roles</option>
          <option value="PLAYER">Player</option>
          <option value="AGENT">Agent</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      {/* Users DataTable */}
      <DataTable
        title="User List"
        columns={
          [
            {
              key: "name",
              label: "User",
              sortable: true,
              render: (_: unknown, row: AdminUser) => {
                const name = row.person
                  ? `${row.person.firstName} ${row.person.lastName}`
                  : (row.userName ?? row.email);
                return (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue text-xs font-bold">
                      {name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {name}
                      </p>
                      <p className="text-[10px] text-text-muted">{row.email}</p>
                    </div>
                  </div>
                );
              },
            },
            {
              key: "phoneNumber",
              label: "Mobile",
              sortable: true,
              render: (v: string | null) => v ?? "—",
            },
            {
              key: "role",
              label: "Role",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "ADMIN" || v === "SUPER_ADMIN"
                    ? "text-purple-400 bg-purple-400/10"
                    : v === "AGENT"
                      ? "text-brand-blue bg-brand-blue/10"
                      : "text-brand-gold bg-brand-gold/10";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}
                  >
                    {v}
                  </span>
                );
              },
            },
            {
              key: "kycStatus",
              label: "KYC",
              sortable: true,
              render: (_: unknown, row: AdminUser) => {
                const status = row.kyc?.status ?? "NONE";
                const color =
                  status === "APPROVED"
                    ? "text-brand-green bg-brand-green/10"
                    : status === "PENDING"
                      ? "text-brand-gold bg-brand-gold/10"
                      : status === "REJECTED"
                        ? "text-brand-red bg-brand-red/10"
                        : "text-text-muted bg-surface-elevated";
                return (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${color}`}
                  >
                    {status}
                  </span>
                );
              },
            },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "active"
                    ? "text-brand-green bg-brand-green/10"
                    : v === "suspended"
                      ? "text-brand-red bg-brand-red/10"
                      : v === "inactive"
                        ? "text-brand-gold bg-brand-gold/10"
                        : "text-text-muted bg-surface-elevated";
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
              key: "walletBalance",
              label: "Balance",
              align: "right" as const,
              sortable: true,
              render: (_: unknown, row: AdminUser) => (
                <span className="text-brand-gold-light font-medium">
                  ₱{(row.wallet?.balance ?? 0).toLocaleString()}
                </span>
              ),
            },
            {
              key: "isEmailVerified",
              label: "Email ✓",
              sortable: true,
              render: (v: boolean) => (
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    v
                      ? "text-brand-green bg-brand-green/10"
                      : "text-brand-red bg-brand-red/10"
                  }`}
                >
                  {v ? "Yes" : "No"}
                </span>
              ),
            },
            {
              key: "lastLogin",
              label: "Last Login",
              sortable: true,
              render: (v: string | null) =>
                v ? new Date(v).toLocaleString() : "Never",
            },
            {
              key: "createdAt",
              label: "Joined",
              sortable: true,
              render: (v: string) => new Date(v).toLocaleDateString(),
            },
          ] satisfies DataTableColumn[]
        }
        data={users}
        pageSize={10}
        exportable
        actions={(row: AdminUser) => (
          <>
            {row.kyc?.status === "PENDING" && (
              <button
                onClick={() => navigate("/admin/kyc")}
                className="text-xs px-2.5 py-1 bg-brand-gold/10 text-brand-gold rounded-lg hover:bg-brand-gold/15 flex items-center gap-1 transition-colors"
              >
                <ShieldAlert size={14} />
                Review KYC
              </button>
            )}
            <button className="text-xs px-2.5 py-1 bg-brand-blue/10 text-brand-blue-light rounded-lg hover:bg-brand-blue/15 flex items-center gap-1 transition-colors">
              <Edit2 size={14} />
              Edit
            </button>
            {row.status === "active" ? (
              <button
                className="text-xs px-2.5 py-1 bg-brand-red/10 text-brand-red-light rounded-lg hover:bg-brand-red/15 flex items-center gap-1 transition-colors"
                onClick={() => toast.success(`User suspended`)}
              >
                <Ban size={14} />
                Suspend
              </button>
            ) : row.status === "suspended" ? (
              <button
                className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green-light rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors"
                onClick={() => toast.success(`User activated`)}
              >
                <CheckCircle size={14} />
                Activate
              </button>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
