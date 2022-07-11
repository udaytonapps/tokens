import { compareLastNames, getSessionId } from "./helpers";
import {
  CraEnvironment,
  FilterConfig,
  LtiAppInfo,
  LtiSessionConfig,
  RequestStatus,
} from "./types";

/** For use during local development for two reasons.
 * 1. Since you cannot retrieve the sessionId from the react server
 * 2. So you don't have to rely on updating the server to check different scenarios tied to the appInfo
 */
export const APP_INFO_OVERRIDES: Partial<LtiAppInfo> = {
  // apiUrl: "",
  // contextId: "",
  // isInstructor: true,
  // linkId: "",
  // sessionId: "13ebcc9442fbd41d056506cbac68ed3a", // Learner session
  sessionId: "45f1d5f44aac814c7542fc03862e5f99", // Instructor session
  // username: "",
  // darkMode: true,
  // baseColor: "#6B5B95", // DRK PRPL
  baseColor: "#0E4466", // DRK TEAL
  // baseColor: "#FFADAD", // LIGHT SALMON
  // baseColor: "#B3ADFF", // LIGHT BLUE
};

const sessionId = getSessionId();

export const EnvConfig: Record<CraEnvironment, LtiSessionConfig> = {
  pre_build: {
    apiUrl: "/learning-apps/mod/mod-tokens/api/index.php",
    sessionId: APP_INFO_OVERRIDES.sessionId || "",
  },
  local_build: {
    apiUrl: "/learning-apps/mod/mod-tokens/api/index.php",
    sessionId,
  },
  deployed_build: {
    apiUrl: "/mod/tokens/api/index.php",
    sessionId,
  },
};

export const DB_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

// Filters
interface Filters {
  INSTRUCTOR: InstructorFilters;
  LEARNER: LearnerFilters;
}
interface InstructorFilters {
  BALANCES: FilterConfig[];
  REQUESTS: FilterConfig[];
  HISTORY: FilterConfig[];
}

interface LearnerFilters {
  HISTORY: FilterConfig[];
}
export const FILTERS: Filters = {
  INSTRUCTOR: {
    BALANCES: [
      {
        column: "learner_name",
        label: "Learner Name",
        type: "enum",
        sort: compareLastNames,
      },
    ],
    REQUESTS: [
      {
        column: "category_name",
        label: "Request Type",
        type: "enum",
      },
      {
        column: "learner_name",
        label: "Learner Name",
        type: "enum",
        sort: compareLastNames,
      },
    ],
    HISTORY: [
      {
        column: "category_name",
        label: "Request Type",
        type: "enum",
      },
      //   {
      //     column: "created_at",
      //     label: "Request Date",
      //     type: "date",
      //     // default: "",
      //   },
      {
        column: "status_name",
        label: "Status",
        type: "enum",
        valueMapping: (val: RequestStatus) => {
          if (val === "SUBMITTED") {
            return "Pending";
          } else {
            return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
          }
        },
      },
      {
        column: "learner_name",
        label: "Learner Name",
        type: "enum",
        sort: compareLastNames,
      },
      //   {
      //     column: "learner_comment",
      //     label: "Description",
      //     type: "text",
      //     default: [],
      //   },
    ],
  },
  LEARNER: {
    HISTORY: [
      {
        column: "category_name",
        label: "Request Type",
        type: "enum",
      },
      {
        column: "status_name",
        label: "Status",
        type: "enum",
        valueMapping: (val: RequestStatus) => {
          if (val === "SUBMITTED") {
            return "Pending";
          } else {
            return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
          }
        },
      },
    ],
  },
};
