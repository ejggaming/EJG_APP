import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import { DataTable } from "../../components/bento";
import type { DataTableColumn } from "../../components/bento";
import {
  DateRangeFilter,
  getInitialDateRange,
} from "../../components/DateRangeFilter";
import type { DateRange } from "../../components/DateRangeFilter";
import { Button } from "../../components";
import apiClient from "../../services/apiClient";
import toast from "react-hot-toast";

type AuditEntry = {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  userId: string | null;
  userEmail: string;
  userRole: string | null;
  newValue: Record<string, any> | null;
  oldValue: Record<string, any> | null;
  ipAddress: string | null;
  hasHash: boolean;
  createdAt: string;
};

type VerifyResult = {
  valid: boolean;
  totalChecked: number;
  brokenAt: string | null;
  brokenReason: string | null;
};

const ACTION_COLORS: Record<string, string> = {
  SUSPICIOUS_TRANSACTION_ALERT: "text-brand-red bg-brand-red/10",
  TRANSACTION_APPROVED: "text-brand-green bg-brand-green/10",
  TRANSACTION_REJECTED: "text-brand-gold bg-brand-gold/10",
};

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "text-brand-red bg-brand-red/10",
  HIGH: "text-orange-400 bg-orange-400/10",
  MEDIUM: "text-brand-gold bg-brand-gold/10",
  LOW: "text-brand-green bg-brand-green/10",
};

const ACTION_LABELS: Record<string, string> = {
  SUSPICIOUS_TRANSACTION_ALERT: "Alert",
  TRANSACTION_APPROVED: "Approved",
  TRANSACTION_REJECTED: "Rejected",
};

const ACTION_OPTIONS = [
  { value: "", label: "All Actions" },
  { value: "SUSPICIOUS_TRANSACTION_ALERT", label: "Suspicious Alerts" },
  { value: "TRANSACTION_APPROVED", label: "Approvals" },
  { value: "TRANSACTION_REJECTED", label: "Rejections" },
];

export default function AuditLog() {
  const [dateRange, setDateRange] = useState<DateRange>(getInitialDateRange("month"));
  const [actionFilter, setActionFilter] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [verifying, setVerifying] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-audit-logs", dateRange.from, dateRange.to, actionFilter],
    queryFn: async () => {
      const params: Record<string, string> = { limit: "100" };
      if (dateRange.from) params.from = dateRange.from;
      if (dateRange.to) params.to = dateRange.to;
      if (actionFilter) params.action = actionFilter;
      const res = await apiClient.get("/reports/audit-logs", { params });
      return res.data.data as {
        logs: AuditEntry[];
        count: number;
      };
    },
  });

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await apiClient.get("/reports/audit/verify");
      const result = res.data.data as VerifyResult;
      setVerifyResult(result);
      if (result.valid) {
        toast.success(`Chain intact — ${result.totalChecked} entries verified`);
      } else {
        toast.error(`Chain broken at entry: ${result.brokenAt}`);
      }
    } catch {
      toast.error("Failed to verify audit chain");
    } finally {
      setVerifying(false);
    }
  };

  const columns: DataTableColumn[] = [
    {
      key: "createdAt",
      label: "Timestamp",
      sortable: true,
      render: (v: string) => (
        <span className="text-xs text-text-muted font-mono whitespace-nowrap">
          {new Date(v).toLocaleString("en-US", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      sortable: true,
      render: (v: string) => {
        const color = ACTION_COLORS[v] ?? "text-text-secondary bg-surface-elevated";
        const label = ACTION_LABELS[v] ?? v.replace(/_/g, " ");
        return (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${color}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: "newValue",
      label: "Severity / Details",
      sortable: false,
      render: (v: Record<string, any> | null, row: AuditEntry) => {
        if (!v) return <span className="text-text-muted text-xs">—</span>;
        const severity = v.severity as string | undefined;
        const amount = v.amount ?? v.newBalance;
        return (
          <div className="flex items-center gap-2 flex-wrap">
            {severity && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${SEVERITY_COLORS[severity] ?? "text-text-muted"}`}>
                {severity}
              </span>
            )}
            {amount != null && (
              <span className="text-xs text-text-secondary font-mono">₱{Number(amount).toLocaleString()}</span>
            )}
            {v.reasons?.[0] && (
              <span className="text-[11px] text-text-muted truncate max-w-[180px]" title={v.reasons.join("; ")}>
                {v.reasons[0]}
              </span>
            )}
            {row.action === "TRANSACTION_APPROVED" && (
              <span className="text-[11px] text-brand-green">Balance → ₱{Number(v.newBalance ?? 0).toLocaleString()}</span>
            )}
            {row.action === "TRANSACTION_REJECTED" && v.reason && (
              <span className="text-[11px] text-brand-gold">{v.reason}</span>
            )}
          </div>
        );
      },
    },
    {
      key: "resource",
      label: "Resource",
      sortable: true,
      render: (v: string) => (
        <span className="text-[11px] text-text-secondary font-medium">{v}</span>
      ),
    },
    {
      key: "userEmail",
      label: "Actor",
      sortable: true,
      render: (v: string) => (
        <span className="text-xs text-text-secondary truncate max-w-[140px] block">{v}</span>
      ),
    },
    {
      key: "hasHash",
      label: "Chain",
      sortable: false,
      align: "right" as const,
      render: (v: boolean) =>
        v ? (
          <span className="inline-flex items-center gap-1 text-[10px] text-brand-green font-semibold">
            <ShieldCheck size={12} /> Signed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
            <Shield size={12} /> Legacy
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Audit Log</h1>
          <p className="text-text-muted mt-1">
            Tamper-proof record of all critical system actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw size={13} className="mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            variant={verifyResult === null ? "outline" : verifyResult.valid ? "green" : "danger"}
            onClick={handleVerify}
            isLoading={verifying}
          >
            {verifyResult?.valid ? (
              <><ShieldCheck size={13} className="mr-1" /> Chain Valid</>
            ) : verifyResult && !verifyResult.valid ? (
              <><ShieldAlert size={13} className="mr-1" /> Chain Broken</>
            ) : (
              <><Shield size={13} className="mr-1" /> Verify Chain</>
            )}
          </Button>
        </div>
      </div>

      {/* Chain verification result banner */}
      {verifyResult && (
        <div
          className={`rounded-xl px-4 py-3 border text-sm flex items-start gap-3 ${
            verifyResult.valid
              ? "bg-brand-green/5 border-brand-green/20 text-brand-green-light"
              : "bg-brand-red/5 border-brand-red/20 text-brand-red-light"
          }`}
        >
          {verifyResult.valid ? (
            <ShieldCheck size={18} className="mt-0.5 shrink-0" />
          ) : (
            <ShieldAlert size={18} className="mt-0.5 shrink-0" />
          )}
          <div>
            <p className="font-semibold">
              {verifyResult.valid
                ? `Audit chain intact — ${verifyResult.totalChecked} signed entries verified`
                : "Audit chain integrity violation detected"}
            </p>
            {!verifyResult.valid && (
              <p className="text-xs mt-0.5 opacity-80">{verifyResult.brokenReason}</p>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface-card border border-border-default rounded-2xl px-4 py-3 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-0">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>
        <div className="shrink-0">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:border-brand-gold"
          >
            {ACTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Entries",
            value: data?.count ?? 0,
            color: "text-text-primary",
          },
          {
            label: "Suspicious Alerts",
            value: data?.logs.filter((l) => l.action === "SUSPICIOUS_TRANSACTION_ALERT").length ?? 0,
            color: "text-brand-red",
          },
          {
            label: "Signed Entries",
            value: data?.logs.filter((l) => l.hasHash).length ?? 0,
            color: "text-brand-green",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-card border border-border-default rounded-xl p-4">
            <p className="text-xs text-text-muted mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Log Table */}
      <DataTable
        title="Audit Entries"
        columns={columns}
        data={isLoading ? [] : (data?.logs ?? [])}
        pageSize={20}
        exportable
      />
    </div>
  );
}
