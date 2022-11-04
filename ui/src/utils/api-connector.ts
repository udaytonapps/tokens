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
  GetAwardsRequestsResponse,
  TokenAward,
} from "./types";

const config = EnvConfig[getEnvironment()];

export const getTsugiUsers = async (): Promise<any> => {
  try {
    const res = await axios.get<GetInfoResponse>(
      `${config.apiUrl}/tsugi-users?PHPSESSID=${config.sessionId}`
    );
    return res.data.data || [];
  } catch (e) {
    console.error(e);
    if (typeof e === "string") {
      return e;
    } else {
      return null;
    }
  }
};

export const getRoster = async (): Promise<any> => {
  try {
    const res = await axios.get<GetInfoResponse>(
      `${config.apiUrl}/roster?PHPSESSID=${config.sessionId}`
    );
    return res.data.data || [];
  } catch (e) {
    console.error(e);
    if (typeof e === "string") {
      return e;
    } else {
      return null;
    }
  }
};

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

export const addAwardTokens = async (
  count: number,
  comment: string,
  recipientIds: string[]
) => {
  try {
    const body = {
      count,
      comment,
      recipientIds,
    };
    await axios.post<ApiResponse>(
      `${config.apiUrl}/instructor/award-tokens?PHPSESSID=${config.sessionId}`,
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

export const getLearnerRequestHistory = async (): Promise<
  RequestsTableRow[]
> => {
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

export const addRequest = async (
  categoryId: string,
  learnerComment: string
): Promise<void> => {
  try {
    const body = {
      category_id: categoryId,
      learner_comment: learnerComment,
    };
    await axios.post<ApiResponse>(
      `${config.apiUrl}/learner/requests?PHPSESSID=${config.sessionId}`,
      body
    );
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

export const getTokenAwards = async (): Promise<TokenAward[]> => {
  try {
    const res = await axios.get<GetAwardsRequestsResponse>(
      `${config.apiUrl}/learner/awards?PHPSESSID=${config.sessionId}`
    );
    return res.data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};
