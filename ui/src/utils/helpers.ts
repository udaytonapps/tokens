import { EnvConfig } from "./contants";
import { CraEnvironment, CraEnvironmentConfig, DecoratedWindow } from "./types";

export const getAppConfig = (): CraEnvironmentConfig => {
  const environment =
    (process?.env.REACT_APP_ENV as CraEnvironment) || "production";
  const config = EnvConfig[environment];

  const darkMode = (window as DecoratedWindow).appConfig?.darkMode || null;
  const baseColor = (window as DecoratedWindow).appConfig?.baseColor || null;

  if (darkMode) {
    config.darkMode = darkMode;
  }
  if (baseColor) {
    config.baseColor = baseColor;
  }

  return config;
};
