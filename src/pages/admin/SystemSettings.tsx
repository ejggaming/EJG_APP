import { useState, useEffect } from "react";
import { Button, Input } from "../../components";
import toast from "react-hot-toast";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { SystemSettingsSkeleton } from "../../components/ChineseSkeleton";
import {
  useDrawSchedulesQuery,
  useCreateDrawScheduleMutation,
  useUpdateDrawScheduleMutation,
  useDeleteDrawScheduleMutation,
  useGameConfigQuery,
  useUpdateGameConfigMutation,
  drawTypeLabel,
} from "../../hooks/useBet";
import type { DrawSchedule } from "../../services/betService";

type DrawType = "MORNING" | "AFTERNOON" | "EVENING";

const ALL_DRAW_TYPES: DrawType[] = ["MORNING", "AFTERNOON", "EVENING"];

export default function SystemSettings() {
  // ─── Draw Schedule state ────────────────────────────────────────────────────
  const { data: schedules = [], isLoading: schedulesLoading } = useDrawSchedulesQuery();
  const createSchedule = useCreateDrawScheduleMutation();
  const updateSchedule = useUpdateDrawScheduleMutation();
  const deleteSchedule = useDeleteDrawScheduleMutation();

  // Local edits for scheduled times (keyed by schedule id)
  const [timeEdits, setTimeEdits] = useState<Record<string, string>>({});
  // Shared cutoff — taken from first schedule, editable locally
  const [betCutoff, setBetCutoff] = useState("15");
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newDrawType, setNewDrawType] = useState<DrawType>("EVENING");
  const [newDrawTime, setNewDrawTime] = useState("21:00");

  // Sync cutoff from DB when schedules load
  useEffect(() => {
    if (schedules.length > 0 && schedules[0].cutoffMinutes !== undefined) {
      setBetCutoff(String(schedules[0].cutoffMinutes));
    }
  }, [schedules]);

  // ─── Game Config state ──────────────────────────────────────────────────────
  const { data: gameConfig, isLoading: configLoading } = useGameConfigQuery();
  const updateConfig = useUpdateGameConfigMutation();

  const [numberRange, setNumberRange] = useState("37");
  const [payoutMultiplier, setPayoutMultiplier] = useState("700");
  const [minBet, setMinBet] = useState("10");
  const [maxBet, setMaxBet] = useState("1000");

  // Financial
  const [commissionRate, setCommissionRate] = useState("15");
  const [govShare, setGovShare] = useState("0");

  // Sync game config fields from DB when loaded
  useEffect(() => {
    if (gameConfig) {
      setNumberRange(String(gameConfig.maxNumber));
      setPayoutMultiplier(String(gameConfig.payoutMultiplier));
      setMinBet(String(gameConfig.minBet));
      setMaxBet(String(gameConfig.maxBet));
      setCommissionRate(String(Math.round(gameConfig.cobradorRate * 100)));
      setGovShare(String(Math.round((gameConfig.governmentRate ?? 0) * 100)));
    }
  }, [gameConfig]);

  // ─── Other settings (UI-only for now) ──────────────────────────────────────
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [drawResultSms, setDrawResultSms] = useState(true);
  const [winnerNotification, setWinnerNotification] = useState(true);
  const [gcashEnabled, setGcashEnabled] = useState(true);
  const [mayaEnabled, setMayaEnabled] = useState(true);
  const [bankEnabled, setBankEnabled] = useState(true);
  const [autoPayoutLimit, setAutoPayoutLimit] = useState("10000");
  const [dailyBetLimit, setDailyBetLimit] = useState("5000");
  const [weeklyBetLimit, setWeeklyBetLimit] = useState("25000");
  const [monthlyBetLimit, setMonthlyBetLimit] = useState("100000");
  const [coolingPeriod, setCoolingPeriod] = useState("24");
  const [selfExclusionDays, setSelfExclusionDays] = useState("30");

  if (schedulesLoading || configLoading) return <SystemSettingsSkeleton />;

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleToggleSchedule = (schedule: DrawSchedule) => {
    updateSchedule.mutate(
      { id: schedule.id, data: { isActive: !schedule.isActive } },
      {
        onSuccess: () =>
          toast.success(
            `${drawTypeLabel(schedule.drawType)} ${!schedule.isActive ? "enabled" : "disabled"}`
          ),
      }
    );
  };

  const handleSaveDrawTimes = () => {
    const cutoff = parseInt(betCutoff);
    if (isNaN(cutoff) || cutoff < 0) {
      toast.error("Enter a valid bet cutoff (minutes)");
      return;
    }

    const promises = schedules.map((s) => {
      const newTime = timeEdits[s.id] ?? s.scheduledTime;
      return updateSchedule.mutateAsync({
        id: s.id,
        data: { scheduledTime: newTime, cutoffMinutes: cutoff },
      });
    });

    Promise.all(promises)
      .then(() => {
        setTimeEdits({});
        toast.success("Draw times saved");
      })
      .catch(() => {});
  };

  const handleDeleteSchedule = (schedule: DrawSchedule) => {
    if (!window.confirm(`Delete ${drawTypeLabel(schedule.drawType)} schedule?`)) return;
    deleteSchedule.mutate(schedule.id, {
      onSuccess: () => toast.success(`${drawTypeLabel(schedule.drawType)} schedule deleted`),
    });
  };

  const handleAddSchedule = () => {
    const exists = schedules.some((s) => s.drawType === newDrawType);
    if (exists) {
      toast.error(`${drawTypeLabel(newDrawType)} schedule already exists`);
      return;
    }
    createSchedule.mutate(
      {
        drawType: newDrawType,
        scheduledTime: newDrawTime,
        cutoffMinutes: parseInt(betCutoff) || 15,
        isActive: true,
      },
      {
        onSuccess: () => {
          toast.success(`${drawTypeLabel(newDrawType)} schedule created`);
          setShowAddSchedule(false);
          setNewDrawTime("21:00");
        },
      }
    );
  };

  const handleSaveGameConfig = () => {
    if (!gameConfig?.id) {
      toast.error("Game configuration not loaded");
      return;
    }
    updateConfig.mutate(
      {
        id: gameConfig.id,
        data: {
          maxNumber: parseInt(numberRange),
          payoutMultiplier: parseFloat(payoutMultiplier),
          minBet: parseFloat(minBet),
          maxBet: parseFloat(maxBet),
        },
      },
      { onSuccess: () => toast.success("Game configuration saved") }
    );
  };

  const handleSaveFinancial = () => {
    if (!gameConfig?.id) {
      toast.error("Game configuration not loaded");
      return;
    }
    updateConfig.mutate(
      {
        id: gameConfig.id,
        data: {
          cobradorRate: parseFloat(commissionRate) / 100,
          governmentRate: parseFloat(govShare) / 100,
        },
      },
      { onSuccess: () => toast.success("Financial settings saved") }
    );
  };

  // Available draw types not yet created
  const availableNewTypes = ALL_DRAW_TYPES.filter(
    (t) => !schedules.some((s) => s.drawType === t)
  );

  // ─── Reusable toggle component ──────────────────────────────────────────────
  const ToggleSwitch = ({
    enabled,
    onToggle,
    label,
    description,
  }: {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    description?: string;
  }) => (
    <div
      className="flex items-center justify-between p-3 rounded-lg"
      style={{
        background: "var(--glass-subtle)",
        border: "1px solid var(--glass-row-border)",
      }}
    >
      <div>
        <p className="text-sm text-text-primary font-medium">{label}</p>
        {description && (
          <p className="text-[10px] text-text-muted">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`w-10 h-6 rounded-full flex items-center transition-colors ${
          enabled ? "bg-brand-green justify-end" : "justify-start"
        }`}
        style={
          !enabled
            ? {
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }
            : undefined
        }
      >
        <div className="w-5 h-5 bg-white rounded-full mx-0.5" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          System Settings
        </h1>
        <p className="text-text-muted mt-1">
          Configure game rules, draw times, security, payments, and platform
          settings
        </p>
      </div>

      {/* ── Game Configuration ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Game Configuration
        </h2>
        <div className="card-3d p-5">
          {configLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Number Range (1 to N)"
                  type="number"
                  value={numberRange}
                  onChange={(e) => setNumberRange(e.target.value)}
                />
                <Input
                  label="Payout Multiplier (x)"
                  type="number"
                  value={payoutMultiplier}
                  onChange={(e) => setPayoutMultiplier(e.target.value)}
                />
                <Input
                  label="Minimum Bet (₱)"
                  type="number"
                  value={minBet}
                  onChange={(e) => setMinBet(e.target.value)}
                />
                <Input
                  label="Maximum Bet (₱)"
                  type="number"
                  value={maxBet}
                  onChange={(e) => setMaxBet(e.target.value)}
                />
              </div>
              <div className="mt-3 p-3 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                <p className="text-xs text-brand-blue-light">
                  Players pick 2 numbers from 1-{numberRange}. If both match the
                  draw, payout is bet × {payoutMultiplier}. Bet range: ₱{minBet} – ₱
                  {maxBet}.
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSaveGameConfig} disabled={updateConfig.isPending}>
                  {updateConfig.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Save Game Config"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Draw Schedule ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Draw Schedule
        </h2>
        <div className="card-3d p-5">
          {schedulesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {schedules.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-lg transition-colors"
                    style={{
                      background: "var(--glass-subtle)",
                      border: "1px solid var(--glass-row-border)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Toggle */}
                      <button
                        onClick={() => handleToggleSchedule(s)}
                        disabled={updateSchedule.isPending}
                        className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                          s.isActive
                            ? "bg-brand-green justify-end"
                            : "justify-start"
                        }`}
                        style={
                          !s.isActive
                            ? {
                                background: "var(--glass-bg)",
                                border: "1px solid var(--glass-border)",
                              }
                            : undefined
                        }
                      >
                        <div className="w-5 h-5 bg-white rounded-full mx-0.5" />
                      </button>
                      <span className="text-sm text-text-primary font-medium">
                        {s.drawType.charAt(0) + s.drawType.slice(1).toLowerCase()} Draw
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Time picker */}
                      <input
                        type="time"
                        value={timeEdits[s.id] ?? s.scheduledTime}
                        onChange={(e) =>
                          setTimeEdits((prev) => ({ ...prev, [s.id]: e.target.value }))
                        }
                        className="text-text-primary text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-gold disabled:opacity-50"
                        style={{
                          background: "var(--glass-subtle)",
                          border: "1px solid var(--glass-divider)",
                        }}
                        disabled={!s.isActive}
                      />
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteSchedule(s)}
                        disabled={deleteSchedule.isPending}
                        className="p-1.5 rounded-lg text-brand-red hover:bg-brand-red/10 transition-colors"
                        title="Delete schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add new schedule row */}
                {showAddSchedule && (
                  <div
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{
                      background: "var(--glass-subtle)",
                      border: "1px solid var(--brand-gold)",
                    }}
                  >
                    <select
                      value={newDrawType}
                      onChange={(e) => setNewDrawType(e.target.value as DrawType)}
                      className="text-sm text-text-primary px-2 py-1 rounded-lg focus:outline-none"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      {availableNewTypes.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0) + t.slice(1).toLowerCase()} Draw
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={newDrawTime}
                        onChange={(e) => setNewDrawTime(e.target.value)}
                        className="text-text-primary text-sm px-3 py-1.5 rounded-lg focus:outline-none"
                        style={{
                          background: "var(--glass-subtle)",
                          border: "1px solid var(--glass-divider)",
                        }}
                      />
                      <Button
                        onClick={handleAddSchedule}
                        disabled={createSchedule.isPending}
                      >
                        {createSchedule.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Add"
                        )}
                      </Button>
                      <button
                        onClick={() => setShowAddSchedule(false)}
                        className="text-xs text-text-muted hover:text-text-primary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bet cutoff + actions */}
              <div className="mt-3">
                <Input
                  label="Bet Cutoff (minutes before draw)"
                  type="number"
                  value={betCutoff}
                  onChange={(e) => setBetCutoff(e.target.value)}
                />
                <p className="text-[10px] text-text-muted mt-1">
                  Betting closes {betCutoff} minutes before each draw time
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                {availableNewTypes.length > 0 && !showAddSchedule && (
                  <button
                    onClick={() => {
                      setNewDrawType(availableNewTypes[0]);
                      setShowAddSchedule(true);
                    }}
                    className="flex items-center gap-1 text-xs text-brand-gold hover:text-brand-gold-light transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Schedule
                  </button>
                )}
                {showAddSchedule || availableNewTypes.length === 0 ? (
                  <div />
                ) : null}
                <Button
                  onClick={handleSaveDrawTimes}
                  disabled={updateSchedule.isPending}
                >
                  {updateSchedule.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Save Draw Times"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Financial Settings ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Financial Settings
        </h2>
        <div className="card-3d p-5">
          {configLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Agent Commission Rate (%)"
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                />
                <Input
                  label="Government Share (%)"
                  type="number"
                  value={govShare}
                  onChange={(e) => setGovShare(e.target.value)}
                />
              </div>
              <div className="mt-3 p-3 bg-brand-gold/5 rounded-lg border border-brand-gold/10">
                <p className="text-xs text-brand-gold-light font-medium mb-2">
                  Revenue Distribution:
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-brand-red rounded-full" />
                    <span className="text-xs text-text-secondary">
                      Gov't {govShare}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-brand-gold rounded-full" />
                    <span className="text-xs text-text-secondary">
                      Agent {commissionRate}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-brand-green rounded-full" />
                    <span className="text-xs text-text-secondary">
                      Operator{" "}
                      {100 - Number(govShare) - Number(commissionRate)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSaveFinancial} disabled={updateConfig.isPending}>
                  {updateConfig.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Save Financial Settings"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── System ────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">System</h2>
        <div className="card-3d p-5">
          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                background: "var(--glass-subtle)",
                border: "1px solid var(--glass-row-border)",
              }}
            >
              <div>
                <p className="text-sm text-text-primary font-medium">
                  Maintenance Mode
                </p>
                <p className="text-[10px] text-text-muted">
                  Disable all betting and user access temporarily
                </p>
              </div>
              <button
                onClick={() => {
                  setMaintenanceMode(!maintenanceMode);
                  toast(
                    maintenanceMode
                      ? "Maintenance mode off"
                      : "Maintenance mode on",
                    {
                      icon: maintenanceMode ? "✅" : "🔧",
                    },
                  );
                }}
                className={`w-12 h-7 rounded-full flex items-center transition-colors ${
                  maintenanceMode ? "bg-brand-red justify-end" : "justify-start"
                }`}
                style={
                  !maintenanceMode
                    ? {
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                      }
                    : undefined
                }
              >
                <div className="w-6 h-6 bg-white rounded-full mx-0.5" />
              </button>
            </div>

            <div className="p-3 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
              <p className="text-sm text-text-primary font-medium mb-2">
                Platform Info
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-text-muted">Version</span>
                  <p className="text-text-primary font-medium">1.0.0-beta</p>
                </div>
                <div>
                  <span className="text-text-muted">Environment</span>
                  <p className="text-text-primary font-medium">Production</p>
                </div>
                <div>
                  <span className="text-text-muted">API Endpoint</span>
                  <p className="text-text-primary font-medium truncate">
                    https://api.jueteng.ph
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Last Deploy</span>
                  <p className="text-text-primary font-medium">Feb 19, 2026</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => toast.success("System settings saved")}>
              Save System Settings
            </Button>
          </div>
        </div>
      </div>

      {/* ── Security Settings ──────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Security Settings
        </h2>
        <div className="card-3d p-5">
          <div className="space-y-4">
            <ToggleSwitch
              enabled={mfaEnabled}
              onToggle={() => setMfaEnabled(!mfaEnabled)}
              label="Multi-Factor Authentication (MFA)"
              description="Require MFA for admin and agent logins"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Session Timeout (minutes)"
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
              />
              <Input
                label="Max Login Attempts"
                type="number"
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(e.target.value)}
              />
            </div>
            <Input
              label="IP Whitelist (comma-separated)"
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
              placeholder="e.g., 192.168.1.1, 10.0.0.0/24"
            />
            <div className="p-3 bg-brand-red/5 rounded-lg border border-brand-red/10">
              <p className="text-xs text-brand-red-light">
                Session expires after {sessionTimeout} min of inactivity.
                Accounts lock after {maxLoginAttempts} failed attempts.
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => toast.success("Security settings saved")}>
              Save Security Settings
            </Button>
          </div>
        </div>
      </div>

      {/* ── Notification Configuration ─────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Notification Configuration
        </h2>
        <div className="card-3d p-5">
          <div className="space-y-3">
            <p className="text-sm text-text-muted font-medium">Channels</p>
            <ToggleSwitch
              enabled={smsNotifications}
              onToggle={() => setSmsNotifications(!smsNotifications)}
              label="SMS Notifications"
              description="Send bet confirmations and results via SMS"
            />
            <ToggleSwitch
              enabled={emailNotifications}
              onToggle={() => setEmailNotifications(!emailNotifications)}
              label="Email Notifications"
              description="Send reports and alerts via email"
            />
            <ToggleSwitch
              enabled={pushNotifications}
              onToggle={() => setPushNotifications(!pushNotifications)}
              label="Push Notifications"
              description="Real-time app push notifications"
            />
            <div className="border-t border-border-subtle pt-3 mt-3">
              <p className="text-sm text-text-muted font-medium mb-3">Events</p>
              <ToggleSwitch
                enabled={drawResultSms}
                onToggle={() => setDrawResultSms(!drawResultSms)}
                label="Draw Result SMS"
                description="Auto-send draw results to all bettors"
              />
              <div className="mt-3">
                <ToggleSwitch
                  enabled={winnerNotification}
                  onToggle={() => setWinnerNotification(!winnerNotification)}
                  label="Winner Notification"
                  description="Immediately notify winners after draw"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => toast.success("Notification settings saved")}>
              Save Notification Settings
            </Button>
          </div>
        </div>
      </div>

      {/* ── Payment Gateway Configuration ──────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Payment Gateway Configuration
        </h2>
        <div className="card-3d p-5">
          <div className="space-y-3">
            <p className="text-sm text-text-muted font-medium">
              Payment Methods
            </p>
            <ToggleSwitch
              enabled={gcashEnabled}
              onToggle={() => setGcashEnabled(!gcashEnabled)}
              label="GCash"
              description="Enable GCash deposits and withdrawals"
            />
            <ToggleSwitch
              enabled={mayaEnabled}
              onToggle={() => setMayaEnabled(!mayaEnabled)}
              label="Maya (PayMaya)"
              description="Enable Maya deposits and withdrawals"
            />
            <ToggleSwitch
              enabled={bankEnabled}
              onToggle={() => setBankEnabled(!bankEnabled)}
              label="Bank Transfer"
              description="Enable direct bank deposits and withdrawals"
            />
            <div className="border-t border-border-subtle pt-3 mt-3">
              <Input
                label="Auto-Payout Limit (₱)"
                type="number"
                value={autoPayoutLimit}
                onChange={(e) => setAutoPayoutLimit(e.target.value)}
              />
              <p className="text-[10px] text-text-muted mt-1">
                Payouts above ₱{Number(autoPayoutLimit).toLocaleString()}{" "}
                require manual admin approval
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => toast.success("Payment settings saved")}>
              Save Payment Settings
            </Button>
          </div>
        </div>
      </div>

      {/* ── Responsible Gaming Limits ──────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Responsible Gaming
        </h2>
        <div className="card-3d p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Daily Bet Limit (₱)"
              type="number"
              value={dailyBetLimit}
              onChange={(e) => setDailyBetLimit(e.target.value)}
            />
            <Input
              label="Weekly Bet Limit (₱)"
              type="number"
              value={weeklyBetLimit}
              onChange={(e) => setWeeklyBetLimit(e.target.value)}
            />
            <Input
              label="Monthly Bet Limit (₱)"
              type="number"
              value={monthlyBetLimit}
              onChange={(e) => setMonthlyBetLimit(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Cooling Period (hours)"
              type="number"
              value={coolingPeriod}
              onChange={(e) => setCoolingPeriod(e.target.value)}
            />
            <Input
              label="Self-Exclusion Default (days)"
              type="number"
              value={selfExclusionDays}
              onChange={(e) => setSelfExclusionDays(e.target.value)}
            />
          </div>
          <div className="mt-3 p-3 bg-brand-gold/5 rounded-lg border border-brand-gold/10">
            <p className="text-xs text-brand-gold-light">
              Users reaching their daily limit (₱
              {Number(dailyBetLimit).toLocaleString()}) will be blocked from
              placing bets until the next day. Self-excluded users are locked
              out for {selfExclusionDays} days. Cooling period of{" "}
              {coolingPeriod}h applies after loss streaks.
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => toast.success("Gaming limits saved")}>
              Save Gaming Limits
            </Button>
          </div>
        </div>
      </div>

      {/* ── User Roles & Permissions ───────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          User Roles & Permissions
        </h2>
        <div className="card-3d p-5">
          <div className="space-y-3">
            {[
              {
                role: "Super Admin",
                permissions: "Full access",
                users: 2,
                color: "text-brand-red",
              },
              {
                role: "Admin",
                permissions: "Manage users, draws, agents, finance",
                users: 5,
                color: "text-brand-gold",
              },
              {
                role: "Finance Admin",
                permissions: "View/manage finances, settlements",
                users: 3,
                color: "text-brand-green",
              },
              {
                role: "Agent Manager",
                permissions: "Manage agents, commissions",
                users: 4,
                color: "text-brand-blue",
              },
              {
                role: "Draw Operator",
                permissions: "Encode results, manage draws",
                users: 6,
                color: "text-purple-400",
              },
              {
                role: "Support",
                permissions: "View-only, handle disputes",
                users: 8,
                color: "text-cyan-400",
              },
            ].map((r) => (
              <div
                key={r.role}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  background: "var(--glass-subtle)",
                  border: "1px solid var(--glass-row-border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${r.color}`}>
                    {r.role}
                  </span>
                  <span className="text-xs text-text-muted">
                    {r.permissions}
                  </span>
                </div>
                <span className="text-xs text-text-secondary font-medium">
                  {r.users} users
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
