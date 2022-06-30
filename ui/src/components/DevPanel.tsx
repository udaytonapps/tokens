import { Box, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getDevInfo } from "../utils/api-connector";
import { getAppConfig } from "../utils/helpers";
import { CraEnvironment } from "../utils/types";

interface DevPanelProps {
  environment: CraEnvironment;
}

/** Show development information during pre-build */
function DevPanel(props: DevPanelProps) {
  const { environment } = props;

  // const [info, setInfo] = useState<any>(null);
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    getDevInfo().then((info) => {
      if (
        typeof info === "string" &&
        (info as string).includes("Session expired")
      ) {
        console.error("SESSION EXPIRED");
        setExpired(true);
      } else {
        // setInfo(info);
      }
    });
  }, []);

  return (
    <Box position={"absolute"} bottom={0} p={2}>
      <Card sx={{ border: "2px solid red" }}>
        <Box p={2} textAlign="center">
          <Typography>React App status is: {environment}</Typography>
          <Typography>Session ID is: {getAppConfig().sessionId}</Typography>
          Session is: {expired ? "EXPIRED" : "VALID"}
        </Box>
      </Card>
    </Box>
  );
}

export default DevPanel;
