import { useState } from "react";
import { Card, Button, Input } from "../../components";
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          System Settings
        </h1>
        <p className="text-text-muted text-sm">
          Configure game rules, draw times, and platform settings
        </p>
      </div>

      {/* Game Configuration */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Game Configuration
        </h2>
        <Card>
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
          <div className="mt-3 p-3 bg-surface-bg rounded-lg">
            <p className="text-xs text-text-muted">
              Players pick 2 numbers from 1-{numberRange}. If both match the
              draw, payout is bet × {payoutMultiplier}. Bet range: ₱{minBet} – ₱
              {maxBet}.
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveGame}>Save Game Config</Button>
          </div>
        </Card>
      </div>

      {/* Draw Schedule */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Draw Schedule
        </h2>
        <Card>
          <div className="space-y-3">
            {drawTimes.map((dt) => (
              <div
                key={dt.id}
                className="flex items-center justify-between p-3 bg-surface-bg rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDrawTime(dt.id)}
                    className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                      dt.enabled
                        ? "bg-brand-green justify-end"
                        : "bg-surface-elevated justify-start"
                    }`}
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
                  className="bg-surface-card text-text-primary text-sm px-3 py-1.5 rounded border border-border-default focus:outline-none focus:border-brand-red"
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
        </Card>
      </div>

      {/* Financial Settings */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Financial Settings
        </h2>
        <Card>
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
          <div className="mt-3 p-3 bg-surface-bg rounded-lg">
            <p className="text-xs text-text-muted">Revenue Distribution:</p>
            <div className="flex gap-4 mt-2">
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
        </Card>
      </div>

      {/* System */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-3">System</h2>
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-bg rounded-lg">
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
                  maintenanceMode
                    ? "bg-brand-red justify-end"
                    : "bg-surface-elevated justify-start"
                }`}
              >
                <div className="w-6 h-6 bg-white rounded-full mx-0.5" />
              </button>
            </div>

            <div className="p-3 bg-surface-bg rounded-lg">
              <p className="text-sm text-text-primary font-medium mb-2">
                Platform Info
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-text-muted">Version</span>
                  <p className="text-text-secondary">1.0.0-beta</p>
                </div>
                <div>
                  <span className="text-text-muted">Environment</span>
                  <p className="text-text-secondary">Production</p>
                </div>
                <div>
                  <span className="text-text-muted">API Endpoint</span>
                  <p className="text-text-secondary truncate">
                    https://api.jueteng.ph
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Last Deploy</span>
                  <p className="text-text-secondary">Feb 19, 2026</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveSystem}>Save System Settings</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
