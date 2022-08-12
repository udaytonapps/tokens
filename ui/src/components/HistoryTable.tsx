import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { HistoryTableRow, SortOrder } from "../utils/types";
import StatusName from "./StatusName";
import {
  formatDbDate,
  getComparator,
  getStatusColors,
  stableSort,
} from "../utils/helpers";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/context";
import Filter from "./Filter";
import TableHeaderSort from "./TableHeaderSort";

interface HistoryTableProps {
  rows: HistoryTableRow[];
  loading: boolean;
  filters: any[];
  openReviewDialog: (requestId: string) => void;
}

/** Shows the history of requests of all available students */
function HistoryTable(props: HistoryTableProps) {
  const { rows, loading, filters, openReviewDialog } = props;
  const appInfo = useContext(AppContext);
  const [filteredRows, setFilteredRows] = useState(rows);
  const statusColors = getStatusColors(useTheme());
  const [orderBy, setOrderBy] = useState<keyof HistoryTableRow>("updated_at");
  const [order, setOrder] = useState<SortOrder>(
    orderBy === "updated_at" ? "desc" : "asc"
  );

  useEffect(() => {
    // Prepare data for the table format (to ensure proper sorting)
    rows.forEach((row) => {
      row.status_name =
        row.status_name === "SUBMITTED" ? "PENDING" : row.status_name;
    });
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
          filters={filters}
          filterRows={setFilteredRows}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableHeaderSort
                  column={"updated_at"}
                  columnLabel={"Last Action"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              {appInfo.isInstructor && (
                <TableCell>
                  <TableHeaderSort
                    column={"learner_name"}
                    columnLabel={"Student Name"}
                    {...{ order, orderBy, setOrder, setOrderBy }}
                  ></TableHeaderSort>
                </TableCell>
              )}
              <TableCell>
                <TableHeaderSort
                  column={"category_name"}
                  columnLabel={"Request"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              <TableCell>
                <TableHeaderSort
                  column={"status_name"}
                  columnLabel={"Status"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} padding={"none"}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {!sortedFilteredRows.length ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <Typography>No results</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedFilteredRows.map((row, index) => (
                <TableRow
                  key={`${index}-${row.request_id}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderLeft: `5px solid ${
                        statusColors[row.status_name]
                      } !important`,
                    }}
                  >
                    {formatDbDate(row.updated_at)}
                  </TableCell>
                  {appInfo.isInstructor && (
                    <TableCell component="th" scope="row">
                      {row.learner_name}
                    </TableCell>
                  )}
                  <TableCell>{row.category_name}</TableCell>
                  <TableCell>
                    <StatusName status={row.status_name} />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => openReviewDialog(row.request_id)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default HistoryTable;
