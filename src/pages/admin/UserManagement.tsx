import { useState, useEffect } from "react";
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
} from "lucide-react";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import { useKycListQuery, useUpdateKycMutation } from "../../hooks/useKyc";
import { useAllUsersQuery } from "../../hooks/useAdmin";
import type { AdminUser } from "../../hooks/useAdmin";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  // Debounce search — only update query after 400ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Real user list
  const {
    data: usersData,
    isLoading,
    refetch: refetchUsers,
  } = useAllUsersQuery({
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    limit: 100,
  });

  // Real KYC pending submissions
  const { data: kycData, isLoading: isKycLoading } = useKycListQuery({
    filter: '[{"status":"PENDING"}]',
    pagination: "true",
    document: "true",
    count: "true",
  });
  const updateKyc = useUpdateKycMutation();

  const users = usersData?.users ?? [];
  const totalUsers = usersData?.count ?? 0;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const suspendedUsers = users.filter((u) => u.status === "suspended").length;
  const kycPending = kycData?.count ?? 0;

  if (isLoading) return <Spinner />;

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

      {/* KYC Review Queue — real data */}
      <div className="bg-surface-card border border-border-default rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              KYC Review Queue
            </h2>
            <p className="text-sm text-text-muted">
              Pending identity verifications
            </p>
          </div>
          {kycPending > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold">
              {kycPending} pending
            </span>
          )}
        </div>

        {isKycLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
          </div>
        ) : !kycData?.kycs?.length ? (
          <p className="text-center text-text-muted text-sm py-8">
            No pending KYC submissions
          </p>
        ) : (
          <div className="space-y-2">
            {kycData.kycs.map((kyc) => (
              <div
                key={kyc.id}
                className="flex items-center justify-between p-3 bg-surface-elevated rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    Doc:{" "}
                    <span className="text-text-muted">
                      {kyc.documentType.replace(":", " #").replace("_", " ")}
                    </span>
                  </p>
                  <p className="text-xs text-text-muted font-mono mt-0.5">
                    UID: {kyc.userId} ·{" "}
                    {kyc.submittedAt
                      ? new Date(kyc.submittedAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  {kyc.documentUrl && (
                    <a
                      href={kyc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2.5 py-1 bg-brand-blue/10 text-brand-blue-light rounded-lg hover:bg-brand-blue/15 transition-colors"
                    >
                      View ID
                    </a>
                  )}
                  {kyc.selfieUrl && (
                    <a
                      href={kyc.selfieUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2.5 py-1 bg-brand-blue/10 text-brand-blue-light rounded-lg hover:bg-brand-blue/15 transition-colors"
                    >
                      Selfie
                    </a>
                  )}
                  <button
                    className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green-light rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                    disabled={updateKyc.isPending}
                    onClick={() =>
                      updateKyc.mutate(
                        { id: kyc.id, status: "APPROVED" },
                        { onSuccess: () => refetchUsers() },
                      )
                    }
                  >
                    <CheckCircle size={13} />
                    Approve
                  </button>
                  <button
                    className="text-xs px-2.5 py-1 bg-brand-red/10 text-brand-red-light rounded-lg hover:bg-brand-red/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                    disabled={updateKyc.isPending}
                    onClick={() =>
                      updateKyc.mutate(
                        { id: kyc.id, status: "REJECTED" },
                        { onSuccess: () => refetchUsers() },
                      )
                    }
                  >
                    <ShieldAlert size={13} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
              <>
                <button
                  className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green-light rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                  disabled={updateKyc.isPending}
                  onClick={() =>
                    updateKyc.mutate(
                      { id: row.kyc!.id, status: "APPROVED" },
                      { onSuccess: () => refetchUsers() },
                    )
                  }
                >
                  <CheckCircle size={14} />
                  Approve KYC
                </button>
                <button
                  className="text-xs px-2.5 py-1 bg-brand-red/10 text-brand-red-light rounded-lg hover:bg-brand-red/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                  disabled={updateKyc.isPending}
                  onClick={() =>
                    updateKyc.mutate(
                      { id: row.kyc!.id, status: "REJECTED" },
                      { onSuccess: () => refetchUsers() },
                    )
                  }
                >
                  <ShieldAlert size={14} />
                  Reject KYC
                </button>
              </>
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
