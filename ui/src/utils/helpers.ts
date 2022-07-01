import { EnvConfig } from "./contants";
import { CraEnvironment, DecoratedWindow, LtiAppInfo } from "./types";

export const getAppConfig = (appInfo: LtiAppInfo): LtiAppInfo => {
  const environment = getEnvironment();
  // The client-side configuration will override the server properties, if set
  const config: LtiAppInfo = { ...appInfo, ...EnvConfig[environment] };
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

export function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
