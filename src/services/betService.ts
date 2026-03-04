import apiClient from "./apiClient";

// ─── Backend model types (match Prisma / buildSuccessResponse wrapper) ────────

interface ApiSuccess<T> {
  status: "success";
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

// JuetengConfig (active game settings)
export interface GameConfig {
  id: string;
  maxNumber: number;
  minBet: number;
  maxBet: number;
  payoutMultiplier: number;
  cobradorRate: number;
  caboRate: number;
  capitalistaRate: number;
  governmentRate: number;
  isActive: boolean;
}

// JuetengDraw (a specific draw instance for a given day)
export interface JuetengDraw {
  id: string;
  scheduleId: string;
  drawDate: string;
  drawType: "MORNING" | "AFTERNOON" | "EVENING";
  status: "SCHEDULED" | "OPEN" | "CLOSED" | "DRAWN" | "SETTLED" | "CANCELLED";
  scheduledAt: string;
  openedAt?: string | null;
  closedAt?: string | null;
  drawnAt?: string | null;
  settledAt?: string | null;
  number1?: number | null;
  number2?: number | null;
  combinationKey?: string | null;
  totalBets: number;
  totalStake: number;
  totalPayout: number;
  grossProfit: number;
  _count?: { payouts: number };
  schedule?: DrawSchedule;
  createdAt: string;
  updatedAt: string;
}

// DrawSchedule (recurring template e.g. MORNING at 11:00)
export interface DrawSchedule {
  id: string;
  drawType: "MORNING" | "AFTERNOON" | "EVENING";
  scheduledTime: string;
  cutoffMinutes: number;
  timeZone: string;
  isActive: boolean;
}

// JuetengBet
export interface JuetengBet {
  id: string;
  drawId: string;
  bettorId: string;
  cobradorId?: string | null;
  caboId?: string | null;
  number1: number;
  number2: number;
  combinationKey: string;
  amount: number;
  currency: string;
  status: "PENDING" | "WON" | "LOST" | "VOID" | "REFUNDED";
  isWinner: boolean;
  payoutAmount?: number | null;
  reference: string;
  placedAt: string;
  settledAt?: string | null;
  draw?: JuetengDraw;
  createdAt: string;
  updatedAt: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const betService = {
  /** Get active game configuration */
  getGameConfig: () =>
    apiClient.get<ApiSuccess<{ juetengConfigs: GameConfig[]; count?: number }>>(
      "/juetengConfig",
      {
        params: {
          filter: "isActive:true",
          document: "true",
        },
      },
    ),

  /** Get today's draws (or draws by filter) */
  getDraws: (params?: Record<string, string>) =>
    apiClient.get<
      ApiSuccess<{
        juetengDraws: JuetengDraw[];
        count?: number;
        pagination?: {
          page: number;
          limit: number;
          totalPages: number;
          total: number;
        };
      }>
    >("/juetengDraw", {
      params: { document: "true", count: "true", ...params },
    }),

  /** Get draw schedules (recurring templates) */
  getDrawSchedules: () =>
    apiClient.get<ApiSuccess<{ drawSchedules: DrawSchedule[] }>>(
      "/drawSchedule",
      {
        params: { document: "true" },
      },
    ),

  /** Place a single bet */
  placeBet: (data: {
    drawId: string;
    number1: number;
    number2: number;
    amount: number;
  }) => apiClient.post<ApiSuccess<JuetengBet>>("/juetengBet", data),

  /** Get bet history for the logged-in user (bettor) */
  getBetHistory: (params?: Record<string, string>) =>
    apiClient.get<
      ApiSuccess<{
        juetengBets: JuetengBet[];
        count?: number;
        pagination?: {
          page: number;
          limit: number;
          totalPages: number;
          total: number;
        };
      }>
    >("/juetengBet", {
      params: {
        document: "true",
        count: "true",
        pagination: "true",
        ...params,
      },
    }),

  /** Get a single bet by ID */
  getBetById: (id: string) =>
    apiClient.get<ApiSuccess<{ juetengBet: JuetengBet }>>(`/juetengBet/${id}`),

  /** Update a draw (admin — encode result, change status, etc.) */
  updateDraw: (id: string, data: Partial<JuetengDraw>) =>
    apiClient.patch<ApiSuccess<{ juetengDraw: JuetengDraw }>>(
      `/juetengDraw/${id}`,
      data,
    ),

  /** Create a new draw */
  createDraw: (data: {
    scheduleId: string;
    drawDate: string;
    drawType: "MORNING" | "AFTERNOON" | "EVENING";
    scheduledAt: string;
  }) =>
    apiClient.post<ApiSuccess<{ juetengDraw: JuetengDraw }>>(
      "/juetengDraw",
      data,
    ),

  /** Create a new draw schedule (admin) */
  createDrawSchedule: (data: {
    drawType: "MORNING" | "AFTERNOON" | "EVENING";
    scheduledTime: string;
    cutoffMinutes?: number;
    timeZone?: string;
    isActive?: boolean;
  }) =>
    apiClient.post<ApiSuccess<{ drawSchedule: DrawSchedule }>>(
      "/drawSchedule",
      data,
    ),

  /** Update an existing draw schedule (admin) */
  updateDrawSchedule: (id: string, data: Partial<Omit<DrawSchedule, "id">>) =>
    apiClient.patch<ApiSuccess<{ drawSchedule: DrawSchedule }>>(
      `/drawSchedule/${id}`,
      data,
    ),

  /** Delete a draw schedule (admin) */
  deleteDrawSchedule: (id: string) =>
    apiClient.delete<ApiSuccess<null>>(`/drawSchedule/${id}`),

  /** Update the active game configuration (admin) */
  updateGameConfig: (id: string, data: Partial<Omit<GameConfig, "id">>) =>
    apiClient.patch<ApiSuccess<{ juetengConfig: GameConfig }>>(
      `/juetengConfig/${id}`,
      data,
    ),

  /** Settle a DRAWN draw — pays winners, creates commissions (admin) */
  settleDraw: (id: string) =>
    apiClient.post<ApiSuccess<{ draw: JuetengDraw }>>(`/juetengDraw/${id}/settle`),
};
