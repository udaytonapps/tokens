import { Cancel, CheckCircle, Info } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import { RequestStatus } from "../utils/types";

interface StatusNameProps {
  status: RequestStatus;
  iconOnly?: boolean;
}

const nameConfig: Record<RequestStatus, any> = {
  SUBMITTED: {
    icon: <Info color="warning" />,
    text: "Pending",
    tooltip: "Request has not yet been accepted or rejected",
  },
  ACCEPTED: {
    icon: <CheckCircle color="success" />,
    text: "Accepted",
    tooltip: "Request has been accepted",
  },
  REJECTED: {
    icon: <Cancel color="error" />,
    text: "Rejected",
    tooltip: "Request has been rejected",
  },
};

/** Shows the mapped status name and an icon */
function StatusName(props: StatusNameProps) {
  const { status, iconOnly } = props;

  return (
    <Box display={"flex"} alignItems={"center"}>
      <Box display={"flex"} alignItems={"center"}>
        <Tooltip title={nameConfig[status].tooltip}>
          {nameConfig[status].icon}
        </Tooltip>
      </Box>
      {!iconOnly && (
        <Typography sx={{ ml: 1 }}>{nameConfig[status].text}</Typography>
      )}
    </Box>
  );
}

export default StatusName;
