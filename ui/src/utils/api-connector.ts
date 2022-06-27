import axios from "axios";
import { getAppConfig } from "./helpers";
import {
  BalanceTableRow,
  GetAllBalancesResponse,
} from "./types";

const config = getAppConfig();

export const getAllBalances = async (): Promise<BalanceTableRow[]> => {
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
