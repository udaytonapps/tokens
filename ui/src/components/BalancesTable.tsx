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
import { FILTERS } from "../utils/constants";
import { BalancesTableRow, SortOrder } from "../utils/types";
import Filter from "./Filter";

interface BalancesTableProps {
  initialTokens: number;
  rows: BalancesTableRow[];
  setTabPosition: Dispatch<SetStateAction<number>>;
}

/** Shows the balances of all available students */
function BalancesTable(props: BalancesTableProps) {
  const { initialTokens, rows, setTabPosition } = props;
  const [filteredRows, setFilteredRows] = useState(rows);
  const [order, setOrder] = useState<SortOrder>("asc");
  const [orderBy, setOrderBy] =
    useState<keyof BalancesTableRow>("learner_name");

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  return (
    <Box>
      <Box mb={1}>
        <Filter
          buttonLabel="Filters"
          rows={rows}
          filters={FILTERS.INSTRUCTOR.BALANCES}
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
                  <TableCell align="center">
                    <Box
                      display={"flex"}
                      minHeight={35}
                      justifyContent={"center"}
                      alignContent={"center"}
                    >
                      {/* Show the icon button only if there is a reference to the learner */}
                      {row.pendingRequests && (
                        <IconButton
                          onClick={() => setTabPosition(1)}
                          disableRipple={true}
                        >
                          <Badge
                            badgeContent={row.pendingRequests}
                            color="warning"
                          ></Badge>
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
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
