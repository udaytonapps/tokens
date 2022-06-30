import axios from "axios";
import { getAppConfig } from "./helpers";
import {
  ApiResponse,
  BalancesTableRow,
  GetAllBalancesResponse,
  GetSettingsResponse,
  GetSubmittedRequestsResponse,
  RequestsTableRow,
  RequestUpdateData,
  TokensSettings,
} from "./types";

const config = getAppConfig();

export const getDevInfo = async (): Promise<any> => {
  try {
    const res = await axios.get<GetSettingsResponse>(
      `${config.apiUrl}/info?PHPSESSID=${config.sessionId}`
    );
    // 'username' => self::$user->displayname,
    // 'isInstructor' => self::$user->instructor,
    // 'contextId' => self::$contextId,
    // 'linkId' => self::$linkId,
    // 'sessionId' => $_GET["PHPSESSID"],
    // 'darkMode' => Theme::$dark_mode,
    // 'baseColor' => Theme::$theme_base ? Theme::$theme_base : "#6B5B95"
    return res.data;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getSettings = async (): Promise<TokensSettings | null> => {
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
