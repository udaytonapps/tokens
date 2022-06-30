import { NotificationImportant, Settings } from "@mui/icons-material";
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import BalancesTable from "../components/BalancesTable";
import HistoryTable from "../components/HistoryTable";
import RequestsTable from "../components/RequestsTable";
import SettingsDialog from "../components/SettingsDialog";
import TabPanel from "../components/TabPanel";
import {
  addSettings,
  getAllBalances,
  getSettings,
  getSubmittedRequests,
  updateSettings,
} from "../utils/api-connector";
import { a11yProps } from "../utils/helpers";
import {
  BalancesTableRow,
  HistoryTableRow,
  RequestsTableRow,
  TokensSettings,
} from "../utils/types";

function InstructorView() {
  const [tabPosition, setTabPosition] = useState(0);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settings, setSettings] = useState<TokensSettings | null>();
  const [balanceRows, setBalanceRows] = useState<BalancesTableRow[]>([]);
  const [requestRows, setRequestRows] = useState<RequestsTableRow[]>([]);
  const [historyRows, setHistoryRows] = useState<HistoryTableRow[]>([]);

  useEffect(() => {
    fetchAndAssembleData();
  }, []);

  useEffect(() => {
    // If undefined, may still be loading...
    // If null, response was received and config doesn't exist, so open the dialog
    if (settings === null) {
      setSettingsDialogOpen(true);
    }
  }, [settings]);

  /** Retrieve data for the instructor tables */
  const fetchAndAssembleData = async () => {
    // Retrieve and set Tokens Settings
    const fetchedSettings = await getSettings();
    setSettings(fetchedSettings);

    // Retrieve and set rows for the Balances Table
    const fetchedBalanceRows = await getAllBalances();
    setBalanceRows(fetchedBalanceRows);

    // Retrieve and set rows for the Requests Table
    const fetchedRequestRows = await getSubmittedRequests();
    // Filter 'SUBMITTED' rows for requests table
    const newlySubmittedRequests = fetchedRequestRows.filter((row) => {
      return row.status_name === "SUBMITTED";
    });
    setRequestRows(newlySubmittedRequests);
    // All will show on history table
    setHistoryRows(fetchedRequestRows);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabPosition(newValue);
  };

  const handleOpenSettingsDialog = () => {
    setSettingsDialogOpen(true);
  };

  const handleCloseSettingsDialog = (event?: object, reason?: string) => {
    const reasonsToStayOpen = ["backdropClick", "escapeKeyDown"];
    if (reason && reasonsToStayOpen.includes(reason)) {
      return;
    }
    setSettingsDialogOpen(false);
  };

  const handleSaveSettingsDialog = async (newSettings: TokensSettings) => {
    // Need to take the new data, send the update, and fetch the new settings
    if (newSettings.configuration_id) {
      await updateSettings(newSettings);
    } else {
      await addSettings(newSettings);
    }
    // Close the dialog
    setSettingsDialogOpen(false);
    // Fetch the new/updated settings to refresh the UI
    const retrievedSettings = await getSettings();
    setSettings(retrievedSettings);
  };

  return (
    <>
      {settings && (
        <Box>
          <Box display={"flex"} justifyContent={"end"} mr={1} mb={2}>
            <IconButton>
              <NotificationImportant />
            </IconButton>
            <IconButton onClick={handleOpenSettingsDialog}>
              <Settings />
            </IconButton>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabPosition}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <Tab label="Balances" {...a11yProps(0)} />
              <Tab label="Requests" {...a11yProps(1)} />
              <Tab label="History" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={tabPosition} index={0}>
            <BalancesTable
              rows={balanceRows}
              requests={requestRows}
              initialTokens={settings?.initial_tokens || 0}
              setTabPosition={setTabPosition}
            />
          </TabPanel>
          <TabPanel value={tabPosition} index={1}>
            <RequestsTable rows={requestRows} />
          </TabPanel>
          <TabPanel value={tabPosition} index={2}>
            <HistoryTable rows={historyRows} />
          </TabPanel>
          {/* DIALOG */}
        </Box>
      )}
      <SettingsDialog
        handleClose={handleCloseSettingsDialog}
        handleSave={handleSaveSettingsDialog}
        open={settingsDialogOpen}
        settings={settings || null}
      />
    </>
  );
}

export default InstructorView;
