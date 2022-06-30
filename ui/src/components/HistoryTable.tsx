import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { HistoryTableRow } from "../utils/types";
import { DateTime } from "luxon";
import { DB_DATE_TIME_FORMAT } from "../utils/contants";
import StatusName from "./StatusName";

interface HistoryTableProps {
  rows: HistoryTableRow[];
  openReviewDialog: (requestId: string) => void;
}

/** Shows the history of requests of all available students */
function HistoryTable(props: HistoryTableProps) {
  const { rows, openReviewDialog } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Last Action</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>Request</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!rows.length ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                <Typography>No requests on record yet!</Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                key={`${index}-${row.request_id}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {DateTime.fromFormat(
                    row.updated_at,
                    DB_DATE_TIME_FORMAT
                  ).toLocaleString(DateTime.DATETIME_MED)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.learner_name}
                </TableCell>
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
  );
}

export default HistoryTable;
