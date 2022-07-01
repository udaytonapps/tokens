import { getSessionId } from "./helpers";
import { CraEnvironment, LtiSessionConfig } from "./types";

/** For use during local development (since you cannot retrieve the sessionId from the react server) */
const LOCAL_SESSION_ID = "397e599274b27184c9c5c9b96cd18d58";

/** The minimum confuration data required to interact with the LTI Session */
export const CONFIG_PROPS = {
  sessionId: getSessionId(),
};

export const EnvConfig: Record<CraEnvironment, LtiSessionConfig> = {
  pre_build: {
    apiUrl: "/learning-apps/mod/mod-tokens/api/index.php",
    ...CONFIG_PROPS,
    sessionId: LOCAL_SESSION_ID,
  },
  local_build: {
    apiUrl: "/learning-apps/mod/mod-tokens/api/index.php",
    ...CONFIG_PROPS,
  },
  deployed_build: {
    apiUrl: "/tsugi/mod/mod-tokens/api/index.php",
    ...CONFIG_PROPS,
  },
};

export const DB_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
