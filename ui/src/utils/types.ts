export type CraEnvironment = "pre_build" | "local_build" | "deployed_build";
export interface CraEnvironmentConfig {
  apiUrl: string;
  contextId: string;
  isInstructor: boolean;
  username: string;
  sessionId: string;
  baseColor?: string;
  darkMode?: boolean;
  linkId?: string;
}

export interface DecoratedWindow extends Window {
  appConfig?: CraEnvironmentConfig;
}

export interface TokensSettings {
  initial_tokens: number;
  notifications_pref: boolean;
  categories: TokensCategory[];
  configuration_id?: string;
}

export interface TokensCategory {
  category_name: string;
  token_cost: number | string;
  category_id?: string;
  dbAction?: "ADD" | "UPDATE" | "DELETE";
}

export interface BalancesTableRow {
  user_id: string;
  learner_name: number;
  tokens_used: number;
}

export interface RequestsTableRow {
  // category_id: "2";
  category_name: string;
  // configuration_id: "1";
  created_at: string; // "2022-06-27 11:26:33";
  instructor_comment: string;
  instructor_id: string;
  learner_comment: string;
  learner_name: string;
  request_id: string;
  status_name: RequestStatus;
  status_updated_at: string; // "2022-06-27 11:26:33";
  updated_at: string; // "2022-06-27 11:26:33";
  user_id: string;
}

export interface HistoryTableRow extends RequestsTableRow {}

type RequestStatus = "SUBMITTED" | "PENDING" | "ACCEPTED" | "REJECTED";

// API Interfaces

type ApiStatus = "success" | "error";

export interface ApiResponse {
  status: ApiStatus;
  data: unknown;
}

export interface GetSettingsResponse extends ApiResponse {
  data: TokensSettings;
}

export interface GetAllBalancesResponse extends ApiResponse {
  data: BalancesTableRow[];
}

export interface GetSubmittedRequestsResponse extends ApiResponse {
  data: RequestsTableRow[];
}
