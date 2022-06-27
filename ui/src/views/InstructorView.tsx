import { NotificationImportant, Settings } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import BalanceTable from "../components/BalanceTable";
import { getAllBalances } from "../utils/api-connector";
import { BalanceTableRow } from "../utils/types";

function InstructorView() {
  useEffect(() => {
    getAllBalances().then((res) => {
      console.log(res)
      setRows(res);
    });
  }, []);
  const [rows, setRows] = useState<BalanceTableRow[]>([]);
  return (
    <Box>
      <Box display={"flex"} justifyContent={"end"} mr={1} mb={2}>
        <IconButton>
          <NotificationImportant />
        </IconButton>
        <IconButton>
          <Settings />
        </IconButton>
      </Box>
      <BalanceTable rows={rows} />
    </Box>
  );
}

export default InstructorView;
