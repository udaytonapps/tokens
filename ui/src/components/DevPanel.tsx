import { Box, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getInfo } from "../utils/api-connector";
import { getEnvironment } from "../utils/helpers";
import { LtiAppInfo } from "../utils/types";

interface DevPanelProps {}

/**
 * Show development information during pre-build.
 * Dev panel does not rely on appInfo context.
 * This is because the dev panel should show whether
 * or not the appInfo was successfully retrieved.
 */
function DevPanel(props: DevPanelProps) {
  // const [info, setInfo] = useState<any>(null);
  const [expired, setExpired] = useState<boolean>(false);
  const [appInfo, setAppInfo] = useState<LtiAppInfo>();

  useEffect(() => {
    getInfo().then((info) => {
      if (
        !info ||
        (typeof info === "string" &&
          (info as string).includes("Session expired"))
      ) {
        console.error("SESSION EXPIRED");
        setExpired(true);
      } else {
        setAppInfo(info);
        setExpired(false);
      }
    });
  }, []);

  return (
    <Box position={"absolute"} bottom={0} p={2}>
      <Card sx={{ border: "2px solid red" }}>
        <Box p={2} textAlign="center">
          <Typography>React App status is: {getEnvironment()}</Typography>
          <Typography>
            Name: {appInfo?.username}, Role:{" "}
            {appInfo?.isInstructor ? "Instructor" : "Learner"}
          </Typography>
          <Typography>Session ID is: {appInfo?.sessionId}</Typography>
          Session is: {expired ? "EXPIRED" : "VALID"}
        </Box>
      </Card>
    </Box>
  );
}

export default DevPanel;
