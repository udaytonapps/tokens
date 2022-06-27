import { Box, Card, Typography } from "@mui/material";
import { getAppConfig } from "../utils/helpers";

interface HeaderProps {}

/** Shows the balances of all available students */
function Header(props: HeaderProps) {
  return (
    <Box mt={6}>
      <Typography variant="h3">Tokens</Typography>
    </Box>
  );
}

export default Header;
