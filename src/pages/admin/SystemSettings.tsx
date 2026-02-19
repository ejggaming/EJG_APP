import { useState } from "react";
import { Button, Input } from "../../components";
import toast from "react-hot-toast";

interface DrawTime {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

const INITIAL_DRAW_TIMES: DrawTime[] = [
  { id: "1", label: "Morning Draw", time: "11:00", enabled: true },
  { id: "2", label: "Afternoon Draw", time: "16:00", enabled: true },
  { id: "3", label: "Evening Draw", time: "21:00", enabled: true },
];

export default function SystemSettings() {
  const [drawTimes, setDrawTimes] = useState(INITIAL_DRAW_TIMES);
  const [minBet, setMinBet] = useState("10");
  const [maxBet, setMaxBet] = useState("1000");
  const [payoutMultiplier, setPayoutMultiplier] = useState("700");
  const [commissionRate, setCommissionRate] = useState("15");
  const [govShare, setGovShare] = useState("30");
  const [betCutoff, setBetCutoff] = useState("15");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [numberRange, setNumberRange] = useState("37");

  // Security settings
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");

  // Notification settings
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [drawResultSms, setDrawResultSms] = useState(true);
  const [winnerNotification, setWinnerNotification] = useState(true);

  // Payment gateway
  const [gcashEnabled, setGcashEnabled] = useState(true);
  const [mayaEnabled, setMayaEnabled] = useState(true);
  const [bankEnabled, setBankEnabled] = useState(true);
  const [autoPayoutLimit, setAutoPayoutLimit] = useState("10000");

  // Responsible gaming
  const [dailyBetLimit, setDailyBetLimit] = useState("5000");
  const [weeklyBetLimit, setWeeklyBetLimit] = useState("25000");
  const [monthlyBetLimit, setMonthlyBetLimit] = useState("100000");
  const [coolingPeriod, setCoolingPeriod] = useState("24");
  const [selfExclusionDays, setSelfExclusionDays] = useState("30");

  const toggleDrawTime = (id: string) => {
    setDrawTimes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d)),
    );
  };

  const updateDrawTime = (id: string, time: string) => {
    setDrawTimes((prev) => prev.map((d) => (d.id === id ? { ...d, time } : d)));
  };

  const handleSaveGame = () => {
    toast.success("Game configuration saved");
  };

  const handleSaveDrawTimes = () => {
    toast.success("Draw times updated");
  };

  const handleSaveFinancial = () => {
    toast.success("Financial settings saved");
  };

  const handleSaveSystem = () => {
    toast.success("System settings saved");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved");
  };

  const handleSavePayment = () => {
    toast.success("Payment gateway settings saved");
  };

  const handleSaveGamingLimits = () => {
    toast.success("Responsible gaming limits saved");
  };

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

      {/* Game Configuration */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Game Configuration
        </h2>
        <div className="card-3d p-5">
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
            <Button onClick={handleSaveGame}>Save Game Config</Button>
          </div>
        </div>
      </div>

      {/* Draw Schedule */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Draw Schedule
        </h2>
        <div className="card-3d p-5">
          <div className="space-y-3">
            {drawTimes.map((dt) => (
              <div
                key={dt.id}
                className="flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{
                  background: "var(--glass-subtle)",
                  border: "1px solid var(--glass-row-border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDrawTime(dt.id)}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                      dt.enabled
                        ? "bg-brand-green justify-end"
                        : "justify-start"
                    }`}
                    style={
                      !dt.enabled
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
                    {dt.label}
                  </span>
                </div>
                <input
                  type="time"
                  value={dt.time}
                  onChange={(e) => updateDrawTime(dt.id, e.target.value)}
                  className="text-text-primary text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-gold disabled:opacity-50"
                  style={{
                    background: "var(--glass-subtle)",
                    border: "1px solid var(--glass-divider)",
                  }}
                  disabled={!dt.enabled}
                />
              </div>
            ))}
          </div>
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
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveDrawTimes}>Save Draw Times</Button>
          </div>
        </div>
      </div>

      {/* Financial Settings */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Financial Settings
        </h2>
        <div className="card-3d p-5">
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
                  Operator {100 - Number(govShare) - Number(commissionRate)}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveFinancial}>
              Save Financial Settings
            </Button>
          </div>
        </div>
      </div>

      {/* System */}
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
            <Button onClick={handleSaveSystem}>Save System Settings</Button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
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
            <Button onClick={handleSaveSecurity}>Save Security Settings</Button>
          </div>
        </div>
      </div>

      {/* Notification Configuration */}
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
            <Button onClick={handleSaveNotifications}>
              Save Notification Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Gateway Configuration */}
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
            <Button onClick={handleSavePayment}>Save Payment Settings</Button>
          </div>
        </div>
      </div>

      {/* Responsible Gaming Limits */}
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
            <Button onClick={handleSaveGamingLimits}>Save Gaming Limits</Button>
          </div>
        </div>
      </div>

      {/* User Roles & Permissions */}
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
