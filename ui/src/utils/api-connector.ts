import axios from "axios";
import { getAppConfig } from "./helpers";
import {
  BalancesTableRow,
  GetAllBalancesResponse,
  GetSubmittedRequestsResponse,
  RequestsTableRow,
} from "./types";

const config = getAppConfig();

export const getConfiguration = async (): Promise<any> => {
  try {
    const res = await axios.get<any>(
      `${config.apiUrl}/instructor/settings?PHPSESSID=${config.sessionId}`
    );
    return res.data.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getAllBalances = async (): Promise<BalancesTableRow[]> => {
  try {
    const res = await axios.get<GetAllBalancesResponse>(
      `${config.apiUrl}/instructor/balances?PHPSESSID=${config.sessionId}`
    );
    return res.data.data;
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
    return res.data.data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
