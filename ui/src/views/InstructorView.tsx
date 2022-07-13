import { NotificationImportant, Settings } from "@mui/icons-material";
import {
  Alert,
  Badge,
  Box,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import BalancesTable from "../components/BalancesTable";
import HistoryTable from "../components/HistoryTable";
import RequestsTable from "../components/RequestsTable";
import ReviewDialog from "../components/ReviewDialog";
import SettingsDialog from "../components/SettingsDialog";
import TabPanel from "../components/TabPanel";
import {
  addSettings,
  getAllBalances,
  getInstructorSettings,
  getSubmittedRequests,
  updateRequest,
  updateSettings,
} from "../utils/api-connector";
import { FILTERS } from "../utils/constants";
import {
  a11yProps,
  compareDateTime,
  formatDbDate,
  sortBalancesByPriority,
  tokensAreExpired,
} from "../utils/helpers";
import {
  BalancesTableRow,
  HistoryTableRow,
  RequestsTableRow,
  RequestUpdateData,
  TokensSettings,
} from "../utils/types";

function InstructorView() {
  const [tabPosition, setTabPosition] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settings, setSettings] = useState<TokensSettings | null>();
  const [requestMap, setRequestMap] = useState<Map<string, number>>(new Map());
  const [balanceRows, setBalanceRows] = useState<BalancesTableRow[]>([]);
  const [requestRows, setRequestRows] = useState<RequestsTableRow[]>([]);
  const [historyRows, setHistoryRows] = useState<HistoryTableRow[]>([]);
  const [requestInReview, setRequestInReview] = useState<RequestsTableRow>();

  useEffect(() => {
    fetchAndAssembleData();
  }, []);

  useEffect(() => {
    // When request data loads, assemble a mapping of who has pending requests
    const newRequestMap = new Map();
    requestRows.forEach((request) => {
      if (newRequestMap.get(request.user_id)) {
        newRequestMap.set(
          request.user_id,
          // Increment to reflect the count of pending requests
          newRequestMap.get(request.user_id) + 1
        );
      } else {
        newRequestMap.set(request.user_id, 1);
      }
    });
    setRequestMap(newRequestMap);
  }, [requestRows]);

  useEffect(() => {
    // When the mapping of pending requests is set, retrieve and sort the balance table rows
    if (requestMap.size && settings) {
      getAllBalances().then((balances) => {
        const sortedBalances = sortBalancesByPriority(balances, requestMap);
        sortedBalances.forEach((row) => {
          row.pendingRequests = requestMap.get(row.user_id);
          row.balance = (settings.initial_tokens || 0) - (row.tokens_used || 0);
        });
        setBalanceRows(sortedBalances);
      });
    }
  }, [requestMap, settings]);

  useEffect(() => {
    // If undefined, setting data may still be loading, but if null, response was received and config doesn't exist, so open the dialog
    if (settings === null) {
      setSettingsDialogOpen(true);
    }
  }, [settings]);

  /** Retrieve and sort data for the requests and history tables
   *  Balances table rows are set after loading the request data
   *  since the balances table needs to know about pending requests
   */
  const fetchAndAssembleData = async () => {
    // Retrieve and set Tokens Settings
    const fetchedSettings = await getInstructorSettings();
    setSettings(fetchedSettings);

    // Retrieve and set rows for the Requests Table
    const fetchedRequestRows = await getSubmittedRequests();
    // Sort all by timestamp (requests and history will show newest first)
    fetchedRequestRows.sort(compareDateTime);

    const newlySubmittedRequests = fetchedRequestRows.filter((row) => {
      return row.status_name === "SUBMITTED";
    });
    // newlySubmittedRequests.sort(compareLastNames);
    setRequestRows(newlySubmittedRequests);
    setHistoryRows(fetchedRequestRows);
  };

  // Tab management
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabPosition(newValue);
  };

  // Dialog management
  const handleOpenSettingsDialog = () => {
    setSettingsDialogOpen(true);
  };

  const handleOpenReviewDialogFromRequests = (requestId: string) => {
    setRequestInReview(
      requestRows.find((request) => request.request_id === requestId)
    );
    setReviewDialogOpen(true);
  };

  const handleOpenReviewDialogFromHistory = (requestId: string) => {
    setRequestInReview(
      historyRows.find((request) => request.request_id === requestId)
    );
    setReviewDialogOpen(true);
  };

  const handleCloseSettingsDialog = (event?: object, reason?: string) => {
    const reasonsToStayOpen = ["backdropClick", "escapeKeyDown"];
    if (reason && reasonsToStayOpen.includes(reason)) {
      return;
    }
    setSettingsDialogOpen(false);
  };

  const handleCloseReviewDialog = (event?: object, reason?: string) => {
    const reasonsToStayOpen = ["backdropClick", "escapeKeyDown"];
    if (reason && reasonsToStayOpen.includes(reason)) {
      return;
    }
    setReviewDialogOpen(false);
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
    const retrievedSettings = await getInstructorSettings();
    setSettings(retrievedSettings);
  };

  const handleSaveReviewDialog = async (reviewData: RequestUpdateData) => {
    // Close the dialog
    setReviewDialogOpen(false);
    // Send the update
    await updateRequest(reviewData);
    // Refresh the data in the UI
    await fetchAndAssembleData();
  };

  return (
    <>
      {settings && (
        <Box>
          <Box display={"flex"} justifyContent={"end"} mr={1}>
            <Box>
              <Tooltip title="There are pending requests requiring review">
                <IconButton onClick={() => setTabPosition(1)}>
                  <Badge badgeContent={requestRows.length} color="warning">
                    <NotificationImportant />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Review or update Tokens settings">
                <IconButton onClick={handleOpenSettingsDialog}>
                  <Settings />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          {settings.use_by_date && (
            <Box mt={2} mb={2}>
              {tokensAreExpired(settings) ? (
                <Alert severity="warning">
                  Tokens expired on {formatDbDate(settings.use_by_date)}
                </Alert>
              ) : (
                <Alert severity="info">
                  Tokens are set to expire on{" "}
                  {formatDbDate(settings.use_by_date)}
                </Alert>
              )}
            </Box>
          )}
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
            <BalancesTable rows={balanceRows} setTabPosition={setTabPosition} />
          </TabPanel>
          <TabPanel value={tabPosition} index={1}>
            <RequestsTable
              rows={requestRows}
              openReviewDialog={handleOpenReviewDialogFromRequests}
            />
          </TabPanel>
          <TabPanel value={tabPosition} index={2}>
            <HistoryTable
              rows={historyRows}
              filters={FILTERS.INSTRUCTOR.HISTORY}
              openReviewDialog={handleOpenReviewDialogFromHistory}
            />
          </TabPanel>
        </Box>
      )}
      {/* DIALOGS */}
      <SettingsDialog
        handleClose={handleCloseSettingsDialog}
        handleSave={handleSaveSettingsDialog}
        open={settingsDialogOpen}
        settings={settings || null}
      />
      <ReviewDialog
        handleClose={handleCloseReviewDialog}
        handleSave={handleSaveReviewDialog}
        open={reviewDialogOpen}
        requestRow={requestInReview || null}
      />
    </>
  );
}

export default InstructorView;
