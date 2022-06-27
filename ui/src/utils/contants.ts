import { CraEnvironment, CraEnvironmentConfig, DecoratedWindow } from "./types";

const DEV_SESSION_ID = "67695e8fb559ee2239ade9c039510cca";

const appConfig = (window as DecoratedWindow).appConfig || null;

export const DEFAULT_BASE_COLOR = "#0E4466"; // Dark teal

export const EnvConfig: Record<CraEnvironment, CraEnvironmentConfig> = {
  pre_build: {
    apiUrl: "/learning-apps/mod/mod-tokens/api/index.php",
    sessionId: DEV_SESSION_ID,
    // darkMode: true,
    baseColor: "#6B5B95", // Dark purple
  },
  local_build: {
    apiUrl: "/learning-apps/mod/mod-tokens/api/index.php",
    sessionId: appConfig?.sessionId || "",
  },
  deployed_build: {
    apiUrl: "/tsugi/mod/mod-tokens/api/index.php",
    sessionId: appConfig?.sessionId || "",
  },
};
