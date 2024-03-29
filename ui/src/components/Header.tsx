import { Box, Typography } from "@mui/material";

interface HeaderProps {}

/** Show basic header info */
function Header(props: HeaderProps) {
  return (
    <Box mt={6}>
      <Typography variant="h3">Tokens</Typography>
    </Box>
  );
}

export default Header;
