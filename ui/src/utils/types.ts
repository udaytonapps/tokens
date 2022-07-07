export type CraEnvironment = "pre_build" | "local_build" | "deployed_build";
export interface LtiSessionConfig {
  apiUrl: string;
  sessionId: string;
}

export interface DecoratedWindow extends Window {
  appConfig?: {
    sessionId: string;
  };
}

export interface LtiAppInfo {
  apiUrl: string;
  contextId: string;
  isInstructor: boolean;
  linkId: string;
  sessionId: string;
  username: string;
  darkMode?: boolean;
  baseColor?: string;
}

export interface TokensSettings {
  initial_tokens: number;
  notifications_pref: boolean;
  categories: TokensCategory[];
  use_by_date: string;
  configuration_id?: string;
}

export interface TokensCategory {
  category_name: string;
  is_used: boolean;
  token_cost: number;
  sort_order: number;
  category_id?: string;
  dbAction?: "ADD" | "UPDATE" | "DELETE";
}

export interface BalancesTableRow {
  user_id: string;
  learner_name: string;
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
  token_cost: number;
  updated_at: string; // "2022-06-27 11:26:33";
  user_id: string;
}

export interface RequestUpdateData {
  request_id: string;
  status_name: RequestStatus;
  instructor_comment?: string;
}

export interface HistoryTableRow extends RequestsTableRow {}

export type GeneralTableRow =
  | BalancesTableRow
  | RequestsTableRow
  | HistoryTableRow;

export type RequestStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED";

// API Interfaces

type ApiStatus = "success" | "error";

export interface ApiResponse {
  status: ApiStatus;
  data: unknown;
}

export interface GetInfoResponse extends ApiResponse {
  data: LtiAppInfo;
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
