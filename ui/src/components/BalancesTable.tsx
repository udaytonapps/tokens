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
import { BalancesTableRow } from "../utils/types";
import Filter from "./Filter";

interface BalancesTableProps {
  initialTokens: number;
  requestMap: Map<string, number>;
  rows: BalancesTableRow[];
  setTabPosition: Dispatch<SetStateAction<number>>;
}

const balancesFilters = [
  {
    column: "learner_name",
    label: "Learner Name",
    type: "enum",
  },
];

/** Shows the balances of all available students */
function BalancesTable(props: BalancesTableProps) {
  const { initialTokens, requestMap, rows, setTabPosition } = props;
  const [filteredRows, setFilteredRows] = useState(rows);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  const getAlert = (learnerId: string) => {
    return (
      <Box
        display={"flex"}
        minHeight={35}
        justifyContent={"center"}
        alignContent={"center"}
      >
        {/* Show the icon button only if there is a reference to the learner */}
        {requestMap.get(learnerId) && (
          <IconButton onClick={() => setTabPosition(1)} disableRipple={true}>
            <Badge
              badgeContent={requestMap.get(learnerId)}
              color="warning"
            ></Badge>
          </IconButton>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box mb={1}>
        <Filter
          buttonLabel="Filters"
          rows={rows}
          filters={balancesFilters}
          filterRows={setFilteredRows}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" width={160}>
                Pending Requests
              </TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell align="center">Tokens Used</TableCell>
              <TableCell align="center">Balance Remaining</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!filteredRows.length ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                  <Typography>No balances yet!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, index) => (
                <TableRow
                  key={`${index}-${row.user_id}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{getAlert(row.user_id)}</TableCell>
                  <TableCell>{row.learner_name}</TableCell>
                  <TableCell align="center">{row.tokens_used}</TableCell>
                  <TableCell align="center">
                    {initialTokens - row.tokens_used || 0}
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

export default BalancesTable;
