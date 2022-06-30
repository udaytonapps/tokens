import { Error } from "@mui/icons-material";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BalancesTableRow, RequestsTableRow } from "../utils/types";

interface BalancesTableProps {
  initialTokens: number;
  requests: RequestsTableRow[];
  rows: BalancesTableRow[];
  setTabPosition: Dispatch<SetStateAction<number>>;
}

/** Shows the balances of all available students */
function BalancesTable(props: BalancesTableProps) {
  const { initialTokens, requests, rows, setTabPosition } = props;

  const [requestMap, setRequestMap] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    // Set map of requests for notification purposes
    const newRequestMap = new Map();
    requests.forEach((request) => {
      newRequestMap.set(request.user_id, true);
    });
    setRequestMap(newRequestMap);
  }, [requests]);

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
            <Error color="primary" />
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
