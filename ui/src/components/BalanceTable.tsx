import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { BalanceTableRow } from "../utils/types";

interface BalanceTableProps {
  rows: BalanceTableRow[];
}

/** Shows the balances of all available students */
function BalanceTable(props: BalanceTableProps) {
  const { rows } = props;
  // TODO get config token balance and use to calculate balance in table

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell align="center">Token Balance</TableCell>
            <TableCell align="center">Tokens Used</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`${index}-${row.user_id}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.learner_name}
              </TableCell>
              <TableCell align="center">???</TableCell>
              <TableCell align="center">{row.tokens_used}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BalanceTable;
