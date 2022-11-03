import {
  Badge,
  Box,
  Button,
  Checkbox,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FILTERS } from "../utils/constants";
import { BalancesTableRow, SortOrder } from "../utils/types";
import Filter from "./Filter";
import { getComparator, stableSort } from "../utils/helpers";
import TableHeaderSort from "./TableHeaderSort";
import TokenGraphic from "./TokenGraphic";
import AwardTokensDialog from "./AwardTokensDialog";
import { addAwardTokens } from "../utils/api-connector";

interface BalancesTableProps {
  rows: BalancesTableRow[];
  loading: boolean;
  setTabPosition: Dispatch<SetStateAction<number>>;
  triggerDataRefresh: () => Promise<void>;
}

/** Shows the balances of all available students */
function BalancesTable(props: BalancesTableProps) {
  const { rows, loading, setTabPosition, triggerDataRefresh } = props;
  const [filteredRows, setFilteredRows] = useState(rows);
  const [orderBy, setOrderBy] =
    useState<keyof BalancesTableRow>("pendingRequests");
  const [order, setOrder] = useState<SortOrder>(
    orderBy === "pendingRequests" ? "desc" : "asc"
  );
  const [selectedRef, setSelectedRef] = useState<
    Record<string, BalancesTableRow | null>
  >({});
  const [atLeastOneSelected, setAtLeastOneSelected] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [awardTokensDialogOpen, setAwardTokensDialogOpen] = useState(false);

  useEffect(() => {
    let allChecked = true;
    let atleastOne = false;
    rows.forEach((row) => {
      if (selectedRef[`${row.learner_name}-${row.email}`]) {
        atleastOne = true;
      } else if (!selectedRef[`${row.learner_name}-${row.email}`]) {
        allChecked = false;
      }
    });
    setAtLeastOneSelected(atleastOne);
    setAllSelected(allChecked);
  }, [selectedRef]);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  /** The filteredRows are automatically sorted each render */
  const sortedFilteredRows = stableSort(
    filteredRows,
    getComparator(order, orderBy)
  );

  const handleClickCheckbox = (row: BalancesTableRow) => {
    setSelectedRef({
      ...selectedRef,
      [`${row.learner_name}-${row.email}`]: selectedRef[
        `${row.learner_name}-${row.email}`
      ]
        ? null
        : row,
    });
  };

  const handleClickAllCheckbox = () => {
    // Only deselect them all if they were all selected
    if (allSelected) {
      // Deselect all
      setSelectedRef({});
    } else {
      let tempRef: Record<string, BalancesTableRow> = {};
      // Select all
      rows.forEach((row) => {
        tempRef[`${row.learner_name}-${row.email}`] = row;
      });
      setSelectedRef(tempRef);
    }
  };

  const handleCloseAwardTokensDialog = (event?: object, reason?: string) => {
    const reasonsToStayOpen = ["backdropClick", "escapeKeyDown"];
    if (reason && reasonsToStayOpen.includes(reason)) {
      return;
    }
    setAwardTokensDialogOpen(false);
  };

  const handleSaveAwardTokensDialog = async (
    count: number,
    comment: string
  ) => {
    // Get list of ids before reference is cleared
    const userIdList = Object.values(selectedRef).flatMap((row) =>
      row && row.email ? row.email : []
    );
    // Close the dialog
    setAwardTokensDialogOpen(false);
    // Clear out any selections
    setSelectedRef({});
    // Send the update
    await addAwardTokens(count, comment, userIdList);
    // Refresh the data in the UI
    await triggerDataRefresh();
  };

  return (
    <Box>
      <Box mb={1} display={"flex"} justifyContent={"end"} gap={1}>
        <Button
          disabled={!atLeastOneSelected}
          variant="outlined"
          onClick={() => setAwardTokensDialogOpen(true)}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            width={"100%"}
            alignItems={"center"}
          >
            Award Tokens
            <Box ml={1}>
              <TokenGraphic
                count={1}
                size="small"
                disabled={!atLeastOneSelected}
              />
            </Box>
          </Box>
        </Button>
        <Filter
          buttonLabel="Filters"
          rows={rows}
          filters={FILTERS.INSTRUCTOR.BALANCES}
          filterRows={setFilteredRows}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {rows.length > 0 && (
                  <Checkbox
                    color="primary"
                    indeterminate={atLeastOneSelected && !allSelected}
                    checked={allSelected}
                    onChange={() => handleClickAllCheckbox()}
                    inputProps={{
                      "aria-label": "select all desserts",
                    }}
                  />
                )}
              </TableCell>
              <TableCell align="center" width={190}>
                <TableHeaderSort
                  column={"pendingRequests"}
                  columnLabel={"Pending Requests"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              <TableCell>
                <TableHeaderSort
                  column={"learner_name"}
                  columnLabel={"Student Name"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              <TableCell align="center">
                <TableHeaderSort
                  column={"tokens_used"}
                  columnLabel={"Tokens Used"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              <TableCell align="center">
                <TableHeaderSort
                  column={"tokens_awarded"}
                  columnLabel={"Tokens Awarded"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              <TableCell align="center">
                <TableHeaderSort
                  column={"balance"}
                  columnLabel={"Balance Remaining"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
            </TableRow>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} padding={"none"}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {!sortedFilteredRows.length ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                  <Typography>No results</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedFilteredRows.map((row, index) => (
                <TableRow
                  key={`${index}-${row.email}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      onClick={() => handleClickCheckbox(row)}
                      color="primary"
                      checked={
                        !!selectedRef[`${row.learner_name}-${row.email}`]
                      }
                      inputProps={{
                        "aria-labelledby": row.learner_name,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      display={"flex"}
                      minHeight={35}
                      justifyContent={"center"}
                      alignContent={"center"}
                    >
                      {/* Show the icon button only if there is a reference to the learner */}
                      {row.pendingRequests && (
                        <IconButton
                          onClick={() => setTabPosition(0)}
                          disableRipple={true}
                        >
                          <Badge
                            badgeContent={row.pendingRequests}
                            color="warning"
                          ></Badge>
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{row.learner_name}</TableCell>
                  <TableCell align="center">{row.tokens_used}</TableCell>
                  <TableCell align="center">
                    {row.tokens_awarded || 0}
                  </TableCell>
                  <TableCell align="center">{row.balance}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* DIALOGS */}
      <AwardTokensDialog
        open={awardTokensDialogOpen}
        handleClose={handleCloseAwardTokensDialog}
        handleConfirm={handleSaveAwardTokensDialog}
        selectedRows={Object.values(selectedRef).flatMap((row) =>
          row && row.email ? row : []
        )}
      />
    </Box>
  );
}

export default BalancesTable;
