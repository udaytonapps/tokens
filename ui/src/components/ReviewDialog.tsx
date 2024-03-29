import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/context";
import { formatDbDate } from "../utils/helpers";
import {
  RequestsTableRow,
  RequestStatus,
  RequestUpdateData,
} from "../utils/types";
import StatusName from "./StatusName";
import TokenGraphic from "./TokenGraphic";

interface ReviewDialogProps {
  handleClose: (event?: object, reason?: string) => void;
  handleSave: (submission: RequestUpdateData) => void;
  open: boolean;
  requestRow: RequestsTableRow | null;
}

/** Show settings form */
function ReviewDialog(props: ReviewDialogProps) {
  const { handleClose, handleSave, open, requestRow } = props;
  const appInfo = useContext(AppContext);

  const [actionStatus, setActionStatus] = useState<RequestStatus>();
  const [comment, setComment] = useState<string>();
  const [readonly, setReadonly] = useState<boolean>(true);

  useEffect(() => {
    if (open) {
      setActionStatus(undefined);
      setComment("");
    }
  }, [open]);

  useEffect(() => {
    if (requestRow?.status_name) {
      setReadonly(
        !appInfo.isInstructor ||
          !["PENDING", "SUBMITTED"].includes(requestRow?.status_name)
      );
    }
  }, [appInfo, requestRow]);

  /** Handles submission of the form data */
  const onSubmit = (e: any) => {
    e.preventDefault();
    if (requestRow && actionStatus) {
      const submission: RequestUpdateData = {
        request_id: requestRow.request_id,
        status_name: actionStatus,
      };
      if ((comment?.length || 0) > 0) {
        submission.instructor_comment = comment;
      }
      handleSave(submission);
    }
  };

  const handleActionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.value as RequestStatus;
    setActionStatus(newStatus);
  };

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const commentVal = e.target.value;
    setComment(commentVal);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      {requestRow && (
        <Box p={2}>
          <form onSubmit={onSubmit}>
            <DialogTitle>Review Request</DialogTitle>
            <DialogContent>
              <Box mb={3}>
                <DialogContentText>
                  Review or take action on a token request.
                </DialogContentText>
              </Box>
              {/* LEARNER NAME */}
              <Box display={"flex"} mt={1} mb={2} alignItems={"center"}>
                <Box mr={2}>
                  <FormLabel>
                    <Typography fontWeight={"bold"}>Requester:</Typography>
                  </FormLabel>
                </Box>
                <Typography>{requestRow.learner_name}</Typography>
              </Box>
              {/* REQUEST DATE */}
              <Box display={"flex"} mt={1} mb={2} alignItems={"center"}>
                <Box mr={2}>
                  <FormLabel>
                    <Typography fontWeight={"bold"}>Date:</Typography>
                  </FormLabel>
                </Box>
                <Typography>{formatDbDate(requestRow.created_at)}</Typography>
              </Box>
              {/* REQUEST TYPE */}
              <Box display={"flex"} mt={1} mb={2} alignItems={"center"}>
                <Box mr={2}>
                  <FormLabel>
                    <Typography fontWeight={"bold"}>Type:</Typography>
                  </FormLabel>
                </Box>
                <Typography>{requestRow.category_name}</Typography>
                <Box ml={1}>
                  <TokenGraphic size="small" count={requestRow.token_cost} />
                </Box>
              </Box>
              {/* REQUESTER COMMENT */}
              <Box display={"flex"} flexDirection={"column"} mt={1} mb={2}>
                <Box mb={2}>
                  <FormLabel>
                    <Typography fontWeight={"bold"}>
                      Requester Description:
                    </Typography>
                  </FormLabel>
                </Box>
                <Box pl={2}>
                  <TextField
                    fullWidth
                    aria-label="Description of request as made by the requester"
                    value={requestRow.learner_comment || ""}
                    multiline
                    minRows={1}
                    maxRows={6}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </Box>
              {/* INSTRUCTOR ACTION CHOICE */}
              {readonly ? (
                <Box>
                  {/* DISPLAY ACTION TAKEN */}
                  <Box display={"flex"} mt={1} mb={2} alignItems={"center"}>
                    <Box mr={2}>
                      <FormLabel>
                        <Typography fontWeight={"bold"}>
                          Instructor Action:
                        </Typography>
                      </FormLabel>
                    </Box>
                    <StatusName status={requestRow.status_name} />
                  </Box>
                  {/* DISPLAY ACTION TAKEN */}
                  {requestRow.status_name !== "SUBMITTED" && (
                    <Box display={"flex"} mt={1} mb={2} alignItems={"center"}>
                      <Box mr={2}>
                        <FormLabel>
                          <Typography fontWeight={"bold"}>
                            Action Date:
                          </Typography>
                        </FormLabel>
                      </Box>
                      <Typography>
                        {formatDbDate(requestRow.status_updated_at)}
                      </Typography>
                    </Box>
                  )}
                  {requestRow.instructor_comment && (
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      mt={1}
                      mb={2}
                    >
                      {/* INSTRUCTOR COMMENT */}
                      <Box mb={2}>
                        <FormLabel>
                          <Typography fontWeight={"bold"}>
                            Instructor Comment:
                          </Typography>
                        </FormLabel>
                      </Box>
                      <Box pl={2}>
                        <TextField
                          fullWidth
                          aria-label="A comment on the request made by the instructor"
                          value={requestRow.instructor_comment || ""}
                          multiline
                          minRows={1}
                          maxRows={6}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box>
                  <FormControl>
                    <FormLabel>
                      <Typography fontWeight={"bold"}>
                        Instructor Action:
                      </Typography>
                    </FormLabel>
                    <Box pl={2}>
                      <RadioGroup
                        id="instructor-action"
                        name="instructor-action"
                        aria-labelledby="instructor-action"
                        onChange={handleActionChange}
                      >
                        <FormControlLabel
                          value="ACCEPTED"
                          control={<Radio required />}
                          label="Accept"
                        />
                        <FormControlLabel
                          value="REJECTED"
                          control={<Radio required />}
                          label="Reject"
                        />
                      </RadioGroup>
                    </Box>
                  </FormControl>
                  <Box display={"flex"} flexDirection={"column"} mt={1} mb={2}>
                    <Box mb={2}>
                      <FormLabel>
                        <Typography fontWeight={"bold"}>
                          Instructor Comment
                          {actionStatus === "REJECTED" ? " (Required)" : ""}:
                        </Typography>
                      </FormLabel>
                    </Box>
                    <Box pl={2}>
                      <TextField
                        fullWidth
                        required={actionStatus === "REJECTED"}
                        aria-label="An input for the instructor to comment on the request"
                        multiline
                        rows={6}
                        value={comment}
                        onChange={handleCommentChange}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                {readonly ? "Close" : "Cancel"}
              </Button>
              {!readonly && (
                <Button variant="contained" type="submit">
                  Save
                </Button>
              )}
            </DialogActions>
          </form>
        </Box>
      )}
    </Dialog>
  );
}

export default ReviewDialog;
