export type CraEnvironment = "pre_build" | "local_build" | "deployed_build";
export interface CraEnvironmentConfig {
  apiUrl: string;
  sessionId: string;
  baseColor?: string;
  darkMode?: boolean;
}

export interface DecoratedWindow extends Window {
  appConfig?: {
    sessionId: string;
    baseColor?: string;
    darkMode?: boolean;
  };
}

export interface BalanceTableRow {
  user_id: string;
  learner_name: number;
  tokens_used: number;
}

// API Interfaces

type ApiStatus = "success" | "error";

export interface ApiResponse {
  status: ApiStatus;
  data: unknown;
}

export interface GetAllBalancesResponse extends ApiResponse {
  data: BalanceTableRow[];
}
