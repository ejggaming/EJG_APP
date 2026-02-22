import { useState } from "react";
import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  FileWarning,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Spinner from "../../components/Spinner";
import { useKycListQuery, useUpdateKycMutation } from "../../hooks/useKyc";
import type { KycRecord, KycStatus } from "../../services/kycService";

export default function KycManagement() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Build filter param for backend
  const filterParam = statusFilter
    ? JSON.stringify([{ status: statusFilter }])
    : undefined;

  // Fetch all KYC records (or filtered by status)
  const {
    data: kycData,
    isLoading,
    refetch,
  } = useKycListQuery({
    ...(filterParam ? { filter: filterParam } : {}),
    pagination: "true",
    document: "true",
    count: "true",
  });

  const updateKyc = useUpdateKycMutation();

  const records: KycRecord[] = kycData?.kycs ?? [];
  const totalCount = kycData?.count ?? 0;

  // Compute stats from current visible data
  // (when no filter is active these represent all records)
  const pendingCount = records.filter((r) => r.status === "PENDING").length;
  const approvedCount = records.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = records.filter((r) => r.status === "REJECTED").length;
  const moreInfoCount = records.filter(
    (r) => r.status === "REQUIRES_MORE_INFO",
  ).length;

  const handleAction = (id: string, status: KycStatus) => {
    updateKyc.mutate(
      { id, status },
      { onSuccess: () => refetch() },
    );
  };

  if (isLoading) return <Spinner />;

  // Status badge renderer
  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: {
        bg: "bg-brand-gold/10",
        text: "text-brand-gold",
        label: "Pending",
      },
      APPROVED: {
        bg: "bg-brand-green/10",
        text: "text-brand-green-light",
        label: "Approved",
      },
      REJECTED: {
        bg: "bg-brand-red/10",
        text: "text-brand-red-light",
        label: "Rejected",
      },
      REQUIRES_MORE_INFO: {
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        label: "More Info",
      },
    };
    const s = map[status] ?? {
      bg: "bg-text-muted/10",
      text: "text-text-muted",
      label: status,
    };
    return (
      <span
        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${s.bg} ${s.text}`}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          KYC Management
        </h1>
        <p className="text-text-muted mt-1">
          Review and manage identity verification submissions
        </p>
      </div>

      {/* Stats */}
      <CardGrid>
        <StatCard
          label="Total Submissions"
          value={totalCount}
          icon={<ShieldCheck size={18} />}
          color="blue"
        />
        <StatCard
          label="Pending Review"
          value={pendingCount}
          icon={<Clock size={18} />}
          color="orange"
        />
        <StatCard
          label="Approved"
          value={approvedCount}
          icon={<CheckCircle size={18} />}
          color="green"
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          icon={<ShieldAlert size={18} />}
          color="red"
        />
      </CardGrid>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-elevated border border-border-default rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="REQUIRES_MORE_INFO">Requires More Info</option>
        </select>

        {moreInfoCount > 0 && !statusFilter && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400">
            {moreInfoCount} need more info
          </span>
        )}
      </div>

      {/* KYC DataTable */}
      <DataTable
        title="KYC Submissions"
        columns={
          [
            {
              key: "userId",
              label: "User ID",
              sortable: true,
              render: (v: string) => (
                <span className="font-mono text-xs text-text-muted">
                  {v.slice(-8)}
                </span>
              ),
            },
            {
              key: "documentType",
              label: "Document",
              sortable: true,
              render: (v: string) => (
                <span className="text-sm capitalize">
                  {v.replace(/_/g, " ").replace(":", " #")}
                </span>
              ),
            },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (v: string) => statusBadge(v),
            },
            {
              key: "documentUrl",
              label: "ID Doc",
              render: (v: string | null) =>
                v ? (
                  <a
                    href={v}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-0.5 bg-brand-blue/10 text-brand-blue-light rounded-lg hover:bg-brand-blue/15 transition-colors inline-flex items-center gap-1"
                  >
                    <ExternalLink size={11} />
                    View
                  </a>
                ) : (
                  <span className="text-xs text-text-muted">—</span>
                ),
            },
            {
              key: "selfieUrl",
              label: "Selfie",
              render: (v: string | null) =>
                v ? (
                  <a
                    href={v}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-0.5 bg-brand-blue/10 text-brand-blue-light rounded-lg hover:bg-brand-blue/15 transition-colors inline-flex items-center gap-1"
                  >
                    <ExternalLink size={11} />
                    View
                  </a>
                ) : (
                  <span className="text-xs text-text-muted">—</span>
                ),
            },
            {
              key: "notes",
              label: "Notes",
              render: (v: string | null) => (
                <span className="text-xs text-text-muted max-w-[160px] truncate block">
                  {v ?? "—"}
                </span>
              ),
            },
            {
              key: "submittedAt",
              label: "Submitted",
              sortable: true,
              render: (v: string | null) =>
                v ? new Date(v).toLocaleDateString() : "—",
            },
            {
              key: "reviewedAt",
              label: "Reviewed",
              sortable: true,
              render: (v: string | null) =>
                v ? new Date(v).toLocaleDateString() : "—",
            },
          ] satisfies DataTableColumn[]
        }
        data={records}
        pageSize={10}
        exportable
        actions={(row: KycRecord) => (
          <>
            {row.status === "PENDING" && (
              <>
                <button
                  className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green-light rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                  disabled={updateKyc.isPending}
                  onClick={() => handleAction(row.id, "APPROVED")}
                >
                  <CheckCircle size={14} />
                  Approve
                </button>
                <button
                  className="text-xs px-2.5 py-1 bg-brand-red/10 text-brand-red-light rounded-lg hover:bg-brand-red/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                  disabled={updateKyc.isPending}
                  onClick={() => handleAction(row.id, "REJECTED")}
                >
                  <ShieldAlert size={14} />
                  Reject
                </button>
                <button
                  className="text-xs px-2.5 py-1 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                  disabled={updateKyc.isPending}
                  onClick={() => handleAction(row.id, "REQUIRES_MORE_INFO")}
                >
                  <FileWarning size={14} />
                  More Info
                </button>
              </>
            )}
            {row.status === "REQUIRES_MORE_INFO" && (
              <>
                <button
                  className="text-xs px-2.5 py-1 bg-brand-green/10 text-brand-green-light rounded-lg hover:bg-brand-green/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                  disabled={updateKyc.isPending}
                  onClick={() => handleAction(row.id, "APPROVED")}
                >
                  <CheckCircle size={14} />
                  Approve
                </button>
                <button
                  className="text-xs px-2.5 py-1 bg-brand-red/10 text-brand-red-light rounded-lg hover:bg-brand-red/15 flex items-center gap-1 transition-colors disabled:opacity-50"
                  disabled={updateKyc.isPending}
                  onClick={() => handleAction(row.id, "REJECTED")}
                >
                  <ShieldAlert size={14} />
                  Reject
                </button>
              </>
            )}
            {row.documentUrl && (
              <a
                href={row.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2.5 py-1 bg-brand-blue/10 text-brand-blue-light rounded-lg hover:bg-brand-blue/15 flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={14} />
                View Doc
              </a>
            )}
          </>
        )}
      />
    </div>
  );
}
