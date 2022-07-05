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
import { formatDbDate } from "../utils/helpers";
import { RequestsTableRow } from "../utils/types";

interface RequestsTableProps {
  rows: RequestsTableRow[];
  openReviewDialog: (requestId: string) => void;
}

/** Shows the requests of all available students */
function RequestsTable(props: RequestsTableProps) {
  const { rows, openReviewDialog } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Request Date</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>Request</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!rows.length ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                <Typography>No pending requests!</Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                key={`${index}-${row.request_id}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{formatDbDate(row.created_at)}</TableCell>
                <TableCell>{row.learner_name}</TableCell>
                <TableCell>{row.category_name}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.learner_comment}
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

export default RequestsTable;
