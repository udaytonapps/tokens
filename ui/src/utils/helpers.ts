import { Theme } from "@mui/material";
import { DateTime } from "luxon";
import {
  APP_INFO_OVERRIDES,
  DB_DATE_TIME_FORMAT,
  EnvConfig,
} from "./constants";
import {
  BalancesTableRow,
  CraEnvironment,
  DecoratedWindow,
  GeneralTableRow,
  HistoryTableRow,
  LtiAppInfo,
  RequestStatus,
} from "./types";

export const getAppConfig = (appInfo: LtiAppInfo): LtiAppInfo => {
  const environment = getEnvironment();
  let overrides = {};
  // The client-side configuration will override the server properties, if set
  if (environment === "pre_build") {
    overrides = APP_INFO_OVERRIDES;
  }
  const config: LtiAppInfo = {
    ...appInfo,
    ...EnvConfig[environment],
    ...overrides,
  };
  return config;
};

export const getEnvironment = (): CraEnvironment => {
  const environment =
    (process?.env.REACT_APP_ENV as CraEnvironment) || "production";
  return environment;
};

export const getSessionId = (): string => {
  const appConfig = (window as DecoratedWindow).appConfig || null;
  return appConfig?.sessionId || "";
};

export const getStatusColors = (theme: Theme) => {
  const statusColors: Record<RequestStatus, string> = {
    SUBMITTED: theme.palette.warning.main,
    ACCEPTED: theme.palette.success.main,
    REJECTED: theme.palette.error.main,
  };
  return statusColors;
};

const compareStrings = (a: string, b: string) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export const compareRowLastNames = (a: GeneralTableRow, b: GeneralTableRow) => {
  const splitA = a.learner_name.split(" ");
  const splitB = b.learner_name.split(" ");
  const lastA = splitA[splitA.length - 1];
  const lastB = splitB[splitB.length - 1];
  return lastA === lastB
    ? compareStrings(splitA[0], splitB[0])
    : compareStrings(lastA, lastB);
};

export const compareLastNames = (a: string, b: string) => {
  const splitA = a.split(" ");
  const splitB = b.split(" ");
  const lastA = splitA[splitA.length - 1];
  const lastB = splitB[splitB.length - 1];
  return lastA === lastB
    ? compareStrings(splitA[0], splitB[0])
    : compareStrings(lastA, lastB);
};

export const compareDateTime = (a: HistoryTableRow, b: HistoryTableRow) => {
  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
};

export const sortBalancesByPriority = (
  rows: BalancesTableRow[],
  requestMap: Map<string, number>
) => {
  rows.sort(compareRowLastNames);
  // Now that rows are sorted, divide them by 'SUBMITTED' status
  const pending: BalancesTableRow[] = [];
  const resolved: BalancesTableRow[] = [];
  rows.forEach((row) => {
    if (requestMap.get(row.user_id)) {
      // User has a pending request and should be prioritized
      pending.push(row);
    } else {
      // User does not have a pending request
      resolved.push(row);
    }
  });
  return [...pending, ...resolved];
};

export function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export function formatDbDate(dateString: string, format?: string) {
  return DateTime.fromFormat(dateString, DB_DATE_TIME_FORMAT).toLocaleString(
    DateTime.DATETIME_MED || format
  );
}
