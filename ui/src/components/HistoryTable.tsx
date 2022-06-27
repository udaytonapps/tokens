import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { HistoryTableRow } from "../utils/types";
import { DateTime } from "luxon";

interface HistoryTableProps {
  rows: HistoryTableRow[];
}

/** Shows the history of requests of all available students */
function HistoryTable(props: HistoryTableProps) {
  const { rows } = props;

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
          {rows.map((row, index) => (
            <TableRow
              key={`${index}-${row.request_id}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">
                {DateTime.fromFormat(
                  row.updated_at,
                  "yyyy-MM-dd HH:mm:ss"
                ).toLocaleString(DateTime.DATETIME_MED)}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.learner_name}
              </TableCell>
              <TableCell>{row.category_name}</TableCell>
              <TableCell>{row.status_name}</TableCell>
              <TableCell align="center">
                <Button variant="contained">Review</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default HistoryTable;
