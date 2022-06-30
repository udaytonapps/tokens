import { CancelOutlined, CheckCircle, InfoOutlined } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import { RequestStatus } from "../utils/types";

interface StatusNameProps {
  status: RequestStatus;
}

const nameConfig: Record<RequestStatus, any> = {
  SUBMITTED: {
    icon: <InfoOutlined color="primary" />,
    text: "Pending",
    tooltip: "The instructor has not yet acted on this request",
  },
  PENDING: {
    icon: <InfoOutlined color="primary" />,
    text: "Pending",
    tooltip: "The instructor has not yet acted on this request",
  },
  ACCEPTED: {
    icon: <CheckCircle color="success" />,
    text: "Accepted",
    tooltip: "The instructor has accepted this request",
  },
  REJECTED: {
    icon: <CancelOutlined color="error" />,
    text: "Rejected",
    tooltip: "The instructor has rejected this request",
  },
};

/** Shows the mapped status name and an icon */
function StatusName(props: StatusNameProps) {
  const { status } = props;

  return (
    <Box display={"flex"} alignItems={"center"}>
      <Box mr={1} display={"flex"} alignItems={"center"}>
        <Tooltip title={nameConfig[status].tooltip}>
          {nameConfig[status].icon}
        </Tooltip>
      </Box>
      <Typography>{nameConfig[status].text}</Typography>
    </Box>
  );
}

export default StatusName;
