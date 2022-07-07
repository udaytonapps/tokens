import axios from "axios";
import { EnvConfig } from "./constants";
import { getEnvironment } from "./helpers";
import {
  ApiResponse,
  BalancesTableRow,
  GetAllBalancesResponse,
  GetInfoResponse,
  GetSettingsResponse,
  GetSubmittedRequestsResponse,
  RequestsTableRow,
  RequestUpdateData,
  LtiAppInfo,
  TokensSettings,
} from "./types";

const config = EnvConfig[getEnvironment()];

/** INSTRUCTOR */

export const getInfo = async (): Promise<LtiAppInfo | null> => {
  try {
    const res = await axios.get<GetInfoResponse>(
      `${config.apiUrl}/info?PHPSESSID=${config.sessionId}`
    );
    return res.data.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getInstructorSettings =
  async (): Promise<TokensSettings | null> => {
    try {
      const res = await axios.get<GetSettingsResponse>(
        `${config.apiUrl}/instructor/settings?PHPSESSID=${config.sessionId}`
      );
      return res.data.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

export const addSettings = async (settings: TokensSettings): Promise<void> => {
  try {
    const body = settings;
    await axios.post<ApiResponse>(
      `${config.apiUrl}/instructor/settings?PHPSESSID=${config.sessionId}`,
      body
    );
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

export const updateSettings = async (
  settings: TokensSettings
): Promise<void> => {
  try {
    const body = settings;
    await axios.put<ApiResponse>(
      `${config.apiUrl}/instructor/settings?PHPSESSID=${config.sessionId}`,
      body
    );
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

export const getAllBalances = async (): Promise<BalancesTableRow[]> => {
  try {
    const res = await axios.get<GetAllBalancesResponse>(
      `${config.apiUrl}/instructor/balances?PHPSESSID=${config.sessionId}`
    );
    return res.data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getSubmittedRequests = async (): Promise<RequestsTableRow[]> => {
  try {
    const res = await axios.get<GetSubmittedRequestsResponse>(
      `${config.apiUrl}/instructor/requests?PHPSESSID=${config.sessionId}`
    );
    return res.data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const updateRequest = async (updateData: RequestUpdateData) => {
  console.log("UPDATING request");
  try {
    const body = updateData;
    await axios.put<ApiResponse>(
      `${config.apiUrl}/instructor/requests?PHPSESSID=${config.sessionId}`,
      body
    );
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

/** LEARNER */

export const getLearnerSettings = async (): Promise<TokensSettings | null> => {
  try {
    const res = await axios.get<GetSettingsResponse>(
      `${config.apiUrl}/learner/settings?PHPSESSID=${config.sessionId}`
    );
    return res.data.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getLearnerRequestHistory = async (): Promise<RequestsTableRow[]> => {
  try {
    const res = await axios.get<GetSubmittedRequestsResponse>(
      `${config.apiUrl}/learner/requests?PHPSESSID=${config.sessionId}`
    );
    return res.data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};
