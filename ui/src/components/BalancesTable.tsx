import {
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
import { Dispatch, SetStateAction } from "react";
import { BalancesTableRow } from "../utils/types";
import StatusName from "./StatusName";

interface BalancesTableProps {
  initialTokens: number;
  requestMap: Map<string, boolean>;
  rows: BalancesTableRow[];
  setTabPosition: Dispatch<SetStateAction<number>>;
}

/** Shows the balances of all available students */
function BalancesTable(props: BalancesTableProps) {
  const { initialTokens, requestMap, rows, setTabPosition } = props;

  const getAlert = (learnerId: string) => {
    return (
      <Box
        display={"flex"}
        minHeight={40}
        justifyContent={"center"}
        alignContent={"center"}
      >
        {/* Show the icon button only if there is a reference to the learner */}
        {requestMap.get(learnerId) && (
          <IconButton onClick={() => setTabPosition(1)}>
            <StatusName status="SUBMITTED" iconOnly={true} />
          </IconButton>
        )}
      </Box>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell align="center">Balance Remaining</TableCell>
            <TableCell align="center">Tokens Used</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!rows.length ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                <Typography>No balances yet!</Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                key={`${index}-${row.user_id}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" sx={{ maxWidth: 40 }}>
                  {getAlert(row.user_id)}
                </TableCell>
                <TableCell>{row.learner_name}</TableCell>
                <TableCell align="center">
                  {initialTokens - row.tokens_used || 0}
                </TableCell>
                <TableCell align="center">{row.tokens_used}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BalancesTable;
