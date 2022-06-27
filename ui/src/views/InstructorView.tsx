import { NotificationImportant, Settings } from "@mui/icons-material";
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import BalancesTable from "../components/BalancesTable";
import HistoryTable from "../components/HistoryTable";
import RequestsTable from "../components/RequestsTable";
import TabPanel from "../components/TabPanel";
import { getAllBalances, getSubmittedRequests } from "../utils/api-connector";
import { a11yProps } from "../utils/helpers";
import {
  BalancesTableRow,
  HistoryTableRow,
  RequestsTableRow,
} from "../utils/types";

function InstructorView() {
  useEffect(() => {
    getAllBalances().then((res) => {
      setBalanceRows(res);
    });
    getSubmittedRequests().then((res) => {
      console.log(res);
      const requests = res.filter((row) => {
        return row.status_name === "SUBMITTED";
      });
      setRequestRows(requests);
      setHistoryRows(res);
    });
  }, []);

  const [tabPosition, setTabPosition] = useState(0);
  const [balanceRows, setBalanceRows] = useState<BalancesTableRow[]>([]);
  const [requestRows, setRequestRows] = useState<RequestsTableRow[]>([]);
  const [historyRows, setHistoryRows] = useState<HistoryTableRow[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabPosition(newValue);
  };

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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabPosition}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Balances" {...a11yProps(0)} />
          <Tab label="Requests" {...a11yProps(1)} />
          <Tab label="History" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabPosition} index={0}>
        <BalancesTable rows={balanceRows} />
      </TabPanel>
      <TabPanel value={tabPosition} index={1}>
        <RequestsTable rows={requestRows} />
      </TabPanel>
      <TabPanel value={tabPosition} index={2}>
        <HistoryTable rows={historyRows} />
      </TabPanel>
    </Box>
  );
}

export default InstructorView;
