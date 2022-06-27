import { Box, Card, Typography } from "@mui/material";
import { getAppConfig } from "../utils/helpers";
import { CraEnvironment } from "../utils/types";

interface DevPanelProps {
  environment: CraEnvironment;
}

/** Show development information during pre-build */
function DevPanel(props: DevPanelProps) {
  const { environment } = props;
  // TODO get config token balance and use to calculate balance in table

  return (
    <Box position={"absolute"} bottom={0} p={2}>
      <Card>
        <Box p={2} textAlign="center">
          <Typography>React App status is: {environment}</Typography>
          <Typography>Session ID is: {getAppConfig().sessionId}</Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default DevPanel;
