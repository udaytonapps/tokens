import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import HistoryTable from "../components/HistoryTable";
import RequestDashboard from "../components/RequestDashboard";
import ReviewDialog from "../components/ReviewDialog";
import TabPanel from "../components/TabPanel";
import {
  getLearnerRequestHistory,
  getLearnerSettings,
} from "../utils/api-connector";
import { FILTERS } from "../utils/constants";
import { a11yProps, compareDateTime } from "../utils/helpers";
import {
  HistoryTableRow,
  RequestsTableRow,
  TokensSettings,
} from "../utils/types";

function LearnerView() {
  const [settings, setSettings] = useState<TokensSettings | null>();
  const [tabPosition, setTabPosition] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [historyRows, setHistoryRows] = useState<HistoryTableRow[]>([]);
  const [requestInReview, setRequestInReview] = useState<RequestsTableRow>();
  const [learnerBalance, setLearnerBalance] = useState<number>(0);

  useEffect(() => {
    fetchAndAssembleData();
  }, []);

  const fetchAndAssembleData = async () => {
    // Retrieve and set Tokens Settings
    const fetchedSettings = await getLearnerSettings();
    setSettings(fetchedSettings);
    // Retrieve and set rows for the Requests Table
    const fetchedRequestRows = await getLearnerRequestHistory();
    // Sort all by timestamp (requests and history will show newest first)
    fetchedRequestRows.sort(compareDateTime);
    setHistoryRows(fetchedRequestRows);

    if (fetchedSettings) {
      const tokensUsed = fetchedRequestRows.reduce((a, b) => {
        if (b.status_name === "REJECTED") {
          return a;
        } else {
          return a + b.token_cost;
        }
      }, 0);
      setLearnerBalance(fetchedSettings.initial_tokens - tokensUsed);
    }
  };

  // Tab management
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabPosition(newValue);
  };

  // Dialog management
  const handleOpenReviewDialogFromHistory = (requestId: string) => {
    setRequestInReview(
      historyRows.find((request) => request.request_id === requestId)
    );
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = (event?: object, reason?: string) => {
    const reasonsToStayOpen = ["backdropClick", "escapeKeyDown"];
    if (reason && reasonsToStayOpen.includes(reason)) {
      return;
    }
    setReviewDialogOpen(false);
  };
  return (
    <>
      {settings && (
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabPosition}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <Tab label="Request" {...a11yProps(0)} />
              <Tab label="History" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={tabPosition} index={0}>
            <RequestDashboard
              settings={settings}
              balance={learnerBalance}
              refreshData={fetchAndAssembleData}
            />
          </TabPanel>
          <TabPanel value={tabPosition} index={1}>
            <HistoryTable
              rows={historyRows}
              filters={FILTERS.LEARNER.HISTORY}
              openReviewDialog={handleOpenReviewDialogFromHistory}
            />
          </TabPanel>
        </Box>
      )}
      <ReviewDialog
        handleClose={handleCloseReviewDialog}
        handleSave={() => {}}
        open={reviewDialogOpen}
        requestRow={requestInReview || null}
      />
    </>
  );
}

export default LearnerView;
