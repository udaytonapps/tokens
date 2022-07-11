import {
  Badge,
  Box,
  IconButton,
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

interface BalancesTableProps {
  rows: BalancesTableRow[];
  setTabPosition: Dispatch<SetStateAction<number>>;
}

/** Shows the balances of all available students */
function BalancesTable(props: BalancesTableProps) {
  const { rows, setTabPosition } = props;
  const [filteredRows, setFilteredRows] = useState(rows);
  const [orderBy, setOrderBy] =
    useState<keyof BalancesTableRow>("pendingRequests");
  const [order, setOrder] = useState<SortOrder>(
    orderBy === "pendingRequests" ? "desc" : "asc"
  );

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  /** The filteredRows are automatically sorted each render */
  const sortedFilteredRows = stableSort(
    filteredRows,
    getComparator(order, orderBy)
  );

  return (
    <Box>
      <Box mb={1}>
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
                  column={"balance"}
                  columnLabel={"Balance Remaining"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!sortedFilteredRows.length ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                  <Typography>No balances yet!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedFilteredRows.map((row, index) => (
                <TableRow
                  key={`${index}-${row.user_id}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
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
                          onClick={() => setTabPosition(1)}
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
                  <TableCell align="center">{row.balance}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default BalancesTable;
