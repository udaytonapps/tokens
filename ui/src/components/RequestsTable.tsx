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
import { RequestsTableRow } from "../utils/types";

interface RequestsTableProps {
  rows: RequestsTableRow[];
}

/** Shows the requests of all available students */
function RequestsTable(props: RequestsTableProps) {
  const { rows } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student Name</TableCell>
            <TableCell>Request</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`${index}-${row.request_id}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.learner_name}
              </TableCell>
              <TableCell>{row.category_name}</TableCell>
              <TableCell>{row.learner_comment}</TableCell>
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

export default RequestsTable;
