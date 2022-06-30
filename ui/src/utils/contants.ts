import { CraEnvironment, CraEnvironmentConfig, DecoratedWindow } from "./types";

const DEV_SESSION_ID = "397e599274b27184c9c5c9b96cd18d58";

const appConfig = (window as DecoratedWindow).appConfig || null;

export const DEFAULT_BASE_COLOR = "#0E4466"; // Dark teal
const DEFAULT_CONFIG_PROPS = {
  // Required
  contextId: appConfig?.contextId || "",
  isInstructor: appConfig?.isInstructor || false,
  sessionId: appConfig?.sessionId || "",
  username: appConfig?.username || "",
  // Optional
  baseColor: appConfig?.baseColor || "#6B5B95",
  darkMode: appConfig?.darkMode || false,
  linkId: appConfig?.linkId || "",
};

export const EnvConfig: Record<CraEnvironment, CraEnvironmentConfig> = {
  pre_build: {
    // Required
    apiUrl: "/learning-apps/mod/mod-tokens/api/index.php",
    contextId: "1",
    isInstructor: true,
    sessionId: DEV_SESSION_ID,
    username: "Jane Instructor",
    // Optional
    baseColor: "#6B5B95", // Dark purple
    // baseColor: "#0E4466", // Teal
    // darkMode: true,
    linkId: "3",
  },
  local_build: {
    apiUrl: "/learning-apps/mod/mod-tokens/api/index.php",
    ...DEFAULT_CONFIG_PROPS,
  },
  deployed_build: {
    apiUrl: "/tsugi/mod/mod-tokens/api/index.php",
    ...DEFAULT_CONFIG_PROPS,
  },
};

export const DB_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
