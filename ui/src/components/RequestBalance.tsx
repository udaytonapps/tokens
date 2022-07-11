import { Box, Typography } from "@mui/material";
import TokenGraphic from "./TokenGraphic";

interface RequestBalanceProps {
  balance: number;
}

/** Show learner's balance info */
function RequestBalance(props: RequestBalanceProps) {
  const { balance } = props;
  return (
    <Box>
      <Box mb={4} display={"flex"} justifyContent={"center"}>
        <Typography fontSize={30}>Token Balance</Typography>
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        <TokenGraphic count={balance} size="large" />
      </Box>
    </Box>
  );
}

export default RequestBalance;
