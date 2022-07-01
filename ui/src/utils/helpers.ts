import { Theme } from "@mui/material";
import { APP_INFO_OVERRIDES, EnvConfig } from "./contants";
import {
  CraEnvironment,
  DecoratedWindow,
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
  console.info("Running in cra environment: ", environment);
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

export function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
