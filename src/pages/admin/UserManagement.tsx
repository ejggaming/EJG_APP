import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

export default function UserManagement() {
  const [_search, _setSearch] = useState("");
  const [_filter, _setFilter] = useState<string>("all");

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      return {
        totalUsers: 12450,
        activeUsers: 9876,
        suspendedUsers: 234,
        newThisMonth: 445,
        kycPending: 67,
        selfExcluded: 12,
        users: [
          {
            id: 1,
            name: "Maria Santos",
            email: "user001@example.com",
            mobile: "09171234567",
            kycStatus: "Verified",
            ageVerified: true,
            status: "Active",
            accountType: "Bettor",
            walletBalance: 15230,
            totalBets: 89,
            bettingLimit: 5000,
            selfExcluded: false,
            lastLogin: "10 min ago",
            joinDate: "Jan 15, 2026",
          },
          {
            id: 2,
            name: "Pedro Reyes",
            email: "user002@example.com",
            mobile: "09189876543",
            kycStatus: "Verified",
            ageVerified: true,
            status: "Active",
            accountType: "Bettor",
            walletBalance: 8500,
            totalBets: 56,
            bettingLimit: 5000,
            selfExcluded: false,
            lastLogin: "1 hr ago",
            joinDate: "Jan 20, 2026",
          },
          {
            id: 3,
            name: "Anna Cruz",
            email: "user003@example.com",
            mobile: "09201234567",
            kycStatus: "Pending",
            ageVerified: false,
            status: "Active",
            accountType: "Bettor",
            walletBalance: 2000,
            totalBets: 34,
            bettingLimit: 1000,
            selfExcluded: false,
            lastLogin: "3 hrs ago",
            joinDate: "Feb 01, 2026",
          },
          {
            id: 4,
            name: "Jose Garcia",
            email: "user004@example.com",
            mobile: "09221111222",
            kycStatus: "Verified",
            ageVerified: true,
            status: "Active",
            accountType: "Bettor",
            walletBalance: 45000,
            totalBets: 120,
            bettingLimit: 10000,
            selfExcluded: false,
            lastLogin: "30 min ago",
            joinDate: "Dec 10, 2025",
          },
          {
            id: 5,
            name: "Rosa Bautista",
            email: "user005@example.com",
            mobile: "09339998877",
            kycStatus: "None",
            ageVerified: false,
            status: "Inactive",
            accountType: "Bettor",
            walletBalance: 0,
            totalBets: 12,
            bettingLimit: 1000,
            selfExcluded: false,
            lastLogin: "2 days ago",
            joinDate: "Feb 10, 2026",
          },
          {
            id: 6,
            name: "Carlos Mendoza",
            email: "user006@example.com",
            mobile: "09451234567",
            kycStatus: "Rejected",
            ageVerified: false,
            status: "Suspended",
            accountType: "Bettor",
            walletBalance: 500,
            totalBets: 5,
            bettingLimit: 1000,
            selfExcluded: false,
            lastLogin: "5 days ago",
            joinDate: "Feb 12, 2026",
          },
          {
            id: 7,
            name: "Elena Villanueva",
            email: "user007@example.com",
            mobile: "09561234567",
            kycStatus: "Verified",
            ageVerified: true,
            status: "Self-Excluded",
            accountType: "Bettor",
            walletBalance: 3200,
            totalBets: 220,
            bettingLimit: 5000,
            selfExcluded: true,
            lastLogin: "1 week ago",
            joinDate: "Oct 05, 2025",
          },
        ],
      };
    },
  });

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
          value={usersData?.totalUsers ?? 0}
          icon={<Users size={18} />}
          color="blue"
        />
        <StatCard
          label="Active Users"
          value={usersData?.activeUsers ?? 0}
          icon={<Users size={18} />}
          color="green"
        />
        <StatCard
          label="KYC Pending"
          value={usersData?.kycPending ?? 0}
          icon={<ShieldAlert size={18} />}
          color="orange"
        />
        <StatCard
          label="Suspended"
          value={usersData?.suspendedUsers ?? 0}
          icon={<Lock size={18} />}
          color="red"
        />
      </CardGrid>

      {/* Users DataTable */}
      <DataTable
        title="User List"
        columns={
          [
            {
              key: "name",
              label: "User",
              sortable: true,
              render: (_: any, row: any) => (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue text-xs font-bold">
                    {row.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {row.name}
                    </p>
                    <p className="text-[10px] text-text-muted">{row.email}</p>
                  </div>
                </div>
              ),
            },
            { key: "mobile", label: "Mobile", sortable: true },
            {
              key: "accountType",
              label: "Type",
              sortable: true,
              render: (v: string) => (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-brand-blue bg-brand-blue/10">
                  {v}
                </span>
              ),
            },
            {
              key: "kycStatus",
              label: "KYC",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "Verified"
                    ? "text-brand-green bg-brand-green/10"
                    : v === "Pending"
                      ? "text-brand-gold bg-brand-gold/10"
                      : v === "Rejected"
                        ? "text-brand-red bg-brand-red/10"
                        : "text-text-muted bg-surface-elevated";
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
              key: "ageVerified",
              label: "Age 18+",
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
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => {
                const color =
                  v === "Active"
                    ? "text-brand-green bg-brand-green/10"
                    : v === "Self-Excluded"
                      ? "text-brand-gold bg-brand-gold/10"
                      : v === "Suspended"
                        ? "text-brand-red bg-brand-red/10"
                        : "text-text-muted bg-surface-elevated";
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
              key: "walletBalance",
              label: "Balance",
              align: "right" as const,
              sortable: true,
              render: (v: number) => (
                <span className="text-brand-gold-light font-medium">
                  ₱{v.toLocaleString()}
                </span>
              ),
            },
            {
              key: "bettingLimit",
              label: "Bet Limit",
              align: "right" as const,
              sortable: true,
              render: (v: number) => `₱${v.toLocaleString()}`,
            },
            {
              key: "totalBets",
              label: "Total Bets",
              align: "right" as const,
              sortable: true,
            },
            { key: "lastLogin", label: "Last Login", sortable: true },
            { key: "joinDate", label: "Joined", sortable: true },
          ] satisfies DataTableColumn[]
        }
        data={usersData?.users || []}
        pageSize={10}
        exportable
        actions={(row: any) => (
          <>
            {row.kycStatus === "Pending" && (
              <>
                <button
                  className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green-light rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors"
                  onClick={() => toast.success(`KYC approved for ${row.name}`)}
                >
                  <CheckCircle size={14} />
                  Approve KYC
                </button>
                <button
                  className="text-xs px-2.5 py-1 bg-brand-red/10 text-brand-red-light rounded-lg hover:bg-brand-red/15 flex items-center gap-1 transition-colors"
                  onClick={() => toast.error(`KYC rejected for ${row.name}`)}
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
            {row.status === "Active" ? (
              <button
                className="text-xs px-2.5 py-1 bg-brand-red/10 text-brand-red-light rounded-lg hover:bg-brand-red/15 flex items-center gap-1 transition-colors"
                onClick={() => toast.success(`${row.name} suspended`)}
              >
                <Ban size={14} />
                Suspend
              </button>
            ) : row.status === "Suspended" ? (
              <button
                className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green-light rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors"
                onClick={() => toast.success(`${row.name} activated`)}
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
