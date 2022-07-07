import {
  Box,
  Button,
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
import { HistoryTableRow } from "../utils/types";
import StatusName from "./StatusName";
import { formatDbDate, getStatusColors } from "../utils/helpers";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/context";
import Filter from "./Filter";

interface HistoryTableProps {
  rows: HistoryTableRow[];
  filters: any[];
  openReviewDialog: (requestId: string) => void;
}

/** Shows the history of requests of all available students */
function HistoryTable(props: HistoryTableProps) {
  const { rows, filters, openReviewDialog } = props;
  const appInfo = useContext(AppContext);
  const [filteredRows, setFilteredRows] = useState(rows);
  const statusColors = getStatusColors(useTheme());

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

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
              <TableCell>Last Action</TableCell>
              {appInfo.isInstructor && <TableCell>Student Name</TableCell>}
              <TableCell>Request</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!filteredRows.length ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <Typography>No requests on record yet!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, index) => (
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
