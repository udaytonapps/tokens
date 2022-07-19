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
} from "@mui/material";
import { useEffect, useState } from "react";
import { FILTERS } from "../utils/constants";
import { formatDbDate, getComparator, stableSort } from "../utils/helpers";
import { RequestsTableRow, SortOrder } from "../utils/types";
import Filter from "./Filter";
import TableHeaderSort from "./TableHeaderSort";

interface RequestsTableProps {
  rows: RequestsTableRow[];
  openReviewDialog: (requestId: string) => void;
}

/** Shows the requests of all available students */
function RequestsTable(props: RequestsTableProps) {
  const { rows, openReviewDialog } = props;
  const [filteredRows, setFilteredRows] = useState(rows);
  const [orderBy, setOrderBy] = useState<keyof RequestsTableRow>("created_at");
  const [order, setOrder] = useState<SortOrder>(
    // orderBy === "created_at" ? "desc" : "asc"
    "asc"
  );

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  /** The filteredRows are automatically sorted each render */
  const sortedFilteredRows = stableSort(
    filteredRows,
    getComparator(order, orderBy)
  );

  return (
    <Box>
      <Box mb={1}>
        <Filter
          buttonLabel="Filters"
          rows={rows}
          filters={FILTERS.INSTRUCTOR.REQUESTS}
          filterRows={setFilteredRows}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableHeaderSort
                  column={"created_at"}
                  columnLabel={"Request Date"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              <TableCell>
                <TableHeaderSort
                  column={"learner_name"}
                  columnLabel={"Student Name"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              <TableCell>
                <TableHeaderSort
                  column={"category_name"}
                  columnLabel={"Request"}
                  {...{ order, orderBy, setOrder, setOrderBy }}
                ></TableHeaderSort>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!sortedFilteredRows.length ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                  <Typography>No results</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedFilteredRows.map((row, index) => (
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
    </Box>
  );
}

export default RequestsTable;
