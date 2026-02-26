import { useState } from "react";
import { CardGrid, StatCard, DataTable } from "../../components/bento";
import type { DataTableColumn, MenuAction } from "../../components/bento";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  FileWarning,
  CheckCircle,
  ExternalLink,
  Eye,
} from "lucide-react";
import { KycManagementSkeleton } from "../../components/ChineseSkeleton";
import { DetailModal } from "../../components/DetailModal";
import { useKycListQuery, useUpdateKycMutation } from "../../hooks/useKyc";
import type { KycRecord, KycStatus } from "../../services/kycService";

export default function KycManagement() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [viewRecord, setViewRecord] = useState<KycRecord | null>(null);

  // Build filter param for backend (key:value format)
  const filterParam = statusFilter ? `status:${statusFilter}` : undefined;

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

  if (isLoading) return <KycManagementSkeleton />;

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
        actions={(row: KycRecord): MenuAction[] | null => {
          const items: MenuAction[] = [
            {
              label: "View Details",
              icon: <Eye size={14} />,
              variant: "default",
              onClick: () => setViewRecord(row),
            },
          ];
          if (row.documentUrl) {
            items.push({
              label: "View Document",
              icon: <ExternalLink size={14} />,
              variant: "default",
              onClick: () => window.open(row.documentUrl!, "_blank", "noopener,noreferrer"),
            });
          }
          if (row.status === "PENDING" || row.status === "REQUIRES_MORE_INFO") {
            items.push({
              label: "Approve",
              icon: <CheckCircle size={14} />,
              variant: "success",
              separator: !!row.documentUrl,
              disabled: updateKyc.isPending,
              onClick: () => handleAction(row.id, "APPROVED"),
            });
            items.push({
              label: "Reject",
              icon: <ShieldAlert size={14} />,
              variant: "danger",
              disabled: updateKyc.isPending,
              onClick: () => handleAction(row.id, "REJECTED"),
            });
          }
          if (row.status === "PENDING") {
            items.push({
              label: "Request More Info",
              icon: <FileWarning size={14} />,
              variant: "warning",
              disabled: updateKyc.isPending,
              onClick: () => handleAction(row.id, "REQUIRES_MORE_INFO"),
            });
          }
          return items.length > 0 ? items : null;
        }}
      />

      {/* KYC Detail Modal */}
      {viewRecord && (
        <DetailModal
          isOpen={!!viewRecord}
          onClose={() => setViewRecord(null)}
          title="KYC Submission Details"
          sections={[
            {
              title: "Application",
              fields: [
                {
                  label: "User ID",
                  value: (
                    <span className="font-mono text-xs">{viewRecord.userId}</span>
                  ),
                  wide: true,
                },
                {
                  label: "Document Type",
                  value: viewRecord.documentType
                    .replace(/_/g, " ")
                    .replace(":", " #"),
                },
                { label: "Status", value: viewRecord.status },
              ],
            },
            {
              title: "Documents",
              fields: [
                {
                  label: "ID Document",
                  value: viewRecord.documentUrl ? (
                    <a
                      href={viewRecord.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue-light underline underline-offset-2 flex items-center gap-1"
                    >
                      <ExternalLink size={11} /> View
                    </a>
                  ) : null,
                },
                {
                  label: "Selfie",
                  value: viewRecord.selfieUrl ? (
                    <a
                      href={viewRecord.selfieUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue-light underline underline-offset-2 flex items-center gap-1"
                    >
                      <ExternalLink size={11} /> View
                    </a>
                  ) : null,
                },
                {
                  label: "Notes",
                  value: viewRecord.notes,
                  wide: true,
                },
              ],
            },
            {
              title: "Timeline",
              fields: [
                {
                  label: "Submitted",
                  value: viewRecord.submittedAt
                    ? new Date(viewRecord.submittedAt).toLocaleString()
                    : null,
                },
                {
                  label: "Reviewed",
                  value: viewRecord.reviewedAt
                    ? new Date(viewRecord.reviewedAt).toLocaleString()
                    : null,
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
}
