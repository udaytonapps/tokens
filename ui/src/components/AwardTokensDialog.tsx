import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { getComparator, stableSort } from "../utils/helpers";
import { BalancesTableRow } from "../utils/types";

interface AwardTokensDialogProps {
  handleClose: () => void;
  handleConfirm: (count: number, comment: string) => void;
  selectedRows: BalancesTableRow[];
  open: boolean;
}

export default function AwardTokensDialog(props: AwardTokensDialogProps) {
  const { handleClose, handleConfirm, open, selectedRows } = props;
  const [comment, setComment] = useState("");
  const [count, setCount] = useState<number>(1);

  const sortedRows = stableSort(
    selectedRows,
    getComparator("asc", "learner_name")
  );

  useEffect(() => {
    // Clear comment/count whenever dialog is opened/closed
    setComment("");
    setCount(1);
  }, [open]);

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const commentVal = e.target.value;
    setComment(commentVal);
  };

  const handleCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const countVal = Number(e.target.value);
    setCount(countVal);
  };

  /** Handles submission of the form data */
  const onSubmit = (e: any) => {
    e.preventDefault();
    handleConfirm(count, comment);
  };

  return (
    <div>
      <Dialog
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <form onSubmit={onSubmit}>
          <DialogTitle id="confirmation-dialog-title">Award Tokens</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirmation-dialog-description">
              Give additional Tokens to learners selected in the Balances Table
            </DialogContentText>

            <Box display={"flex"} mt={2} alignItems={"center"}>
              <Box minWidth={300} width={300} mr={2} mt={1}>
                <InputLabel htmlFor="token-count" sx={{ whiteSpace: "normal" }}>
                  <Typography fontWeight={"bold"}>
                    Amount of tokens to be awarded:
                  </Typography>
                </InputLabel>
              </Box>
              <Box minWidth={150} width={150}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  size="small"
                  id="token-count"
                  type="number"
                  value={count}
                  InputLabelProps={{ shrink: false }}
                  InputProps={{
                    inputProps: {
                      min: 1,
                      style: { textAlign: "center" },
                    },
                  }}
                  onChange={handleCountChange}
                />
              </Box>
            </Box>
            <Box mb={2} pt={2}>
              <FormLabel>
                <Typography fontWeight={"bold"}>Note:</Typography>
              </FormLabel>
            </Box>
            <Box pl={2}>
              <TextField
                fullWidth
                required={true}
                aria-label="An input for the instructor to comment on the Token award"
                multiline
                rows={4}
                value={comment}
                onChange={handleCommentChange}
              />
            </Box>
            <Box mb={2} pt={4}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="recipient-content"
                  id="recipient-header"
                >
                  <Typography>Recipients</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <TableContainer>
                      <Table aria-label="recipient table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Recipient Name</TableCell>
                            <TableCell align="center">
                              Original Balance
                            </TableCell>
                            <TableCell align="center">
                              Balance After Award
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sortedRows.map((row, index) => (
                            <TableRow key={`recipient-${index}-${row.user_id}`}>
                              <TableCell>{row.learner_name}</TableCell>
                              <TableCell align="center">
                                {row.balance || 0}
                              </TableCell>
                              <TableCell align="center">
                                {(row.balance || 0) + count}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" autoFocus variant={"contained"}>
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
