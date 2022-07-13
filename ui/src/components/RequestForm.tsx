import { Box, Button, TextField, Typography } from "@mui/material";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { addRequest } from "../utils/api-connector";
import { tokensAreExpired } from "../utils/helpers";
import { TokensCategory, TokensSettings } from "../utils/types";
import ConfirmationDialog from "./ConfirmationDialog";
import TokenGraphic from "./TokenGraphic";

interface RequestFormProps {
  balance: number;
  categories: TokensCategory[];
  updateBalance: Dispatch<SetStateAction<number>>;
  resetBalance: () => void;
  refreshData: () => Promise<void>;
  settings: TokensSettings;
}

/** Show learner's token request form */
function RequestForm(props: RequestFormProps) {
  const {
    balance,
    categories,
    updateBalance,
    resetBalance,
    refreshData,
    settings,
  } = props;
  const sortedCategories = categories.sort((a, b) => {
    return a.sort_order - b.sort_order;
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<TokensCategory>();
  const [learnerComment, setLearnerComment] = useState<string>("");

  const handleSelectCategory = (category: TokensCategory) => {
    updateBalance(balance - category.token_cost);
    setSelectedCategory(category);
  };

  const handleCancelRequest = () => {
    setSelectedCategory(undefined);
    resetBalance();
  };

  const handleSubmitRequest = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirmDialog = async () => {
    if (selectedCategory?.category_id && learnerComment) {
      setOpenDialog(false);
      // API call to submit request - it will ensure it does not result in negative balance
      await addRequest(selectedCategory.category_id, learnerComment);
      // Refresh the data (rows at learner view level)
      await refreshData();
      // This will make a submission message appear that the learner can dismiss
      setSubmitted(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDismissConfirmation = () => {
    setSelectedCategory(undefined);
    setSubmitted(false);
  };

  return (
    <Box>
      {!selectedCategory ? (
        <>
          <Box mb={4}>
            <Typography fontSize={30}>Request</Typography>
          </Box>
          <Box mb={4}>
            <Typography>
              Use tokens by selecting one of the requests below.
            </Typography>
          </Box>
          <Box display={"flex"} flexDirection={"column"}>
            {sortedCategories.map((category) => (
              <Button
                disabled={
                  balance - category.token_cost < 0 ||
                  (settings && tokensAreExpired(settings))
                }
                key={`category-${category.category_id}`}
                size="large"
                sx={{ mb: 2 }}
                variant="contained"
                onClick={() => handleSelectCategory(category)}
              >
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  width={"100%"}
                  alignItems={"center"}
                >
                  <Typography textTransform={"none"}>
                    {category.category_name}
                  </Typography>
                  <TokenGraphic
                    count={category.token_cost}
                    size="small"
                    disabled={
                      balance - category.token_cost < 0 ||
                      (settings && tokensAreExpired(settings))
                    }
                  />
                </Box>
              </Button>
            ))}
          </Box>
        </>
      ) : (
        <>
          {!submitted ? (
            <form onSubmit={handleSubmitRequest}>
              <Box mb={4}>
                <Typography fontSize={30}>Request</Typography>
              </Box>
              <Box mb={4}>
                <Box display={"flex"} alignItems={"center"} mb={2}>
                  <Typography sx={{ mr: 2 }} variant="h6">
                    {selectedCategory.category_name}
                  </Typography>
                  <TokenGraphic
                    count={selectedCategory.token_cost}
                    size="small"
                  />
                </Box>
                <Typography>
                  Please list the details of the activity on which you plan to
                  use your token{selectedCategory.token_cost > 1 && "s"}:
                </Typography>
              </Box>
              <Box display={"flex"} flexDirection={"column"}>
                <TextField
                  fullWidth
                  required
                  aria-label="Details about the request to be submitted"
                  multiline
                  rows={4}
                  onChange={(e) => setLearnerComment(e.target.value)}
                />
              </Box>
              <Box display={"flex"} justifyContent={"end"} pt={2}>
                <Button
                  onClick={handleCancelRequest}
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </form>
          ) : (
            <>
              <Box mb={4}>
                <Typography fontSize={30}>Submitted</Typography>
              </Box>
              <Box mb={4}>
                <Box display={"flex"} alignItems={"center"} mb={2}>
                  <Typography sx={{ mr: 2 }} variant="h6">
                    {selectedCategory.category_name}
                  </Typography>
                  <TokenGraphic
                    count={selectedCategory.token_cost}
                    size="small"
                  />
                </Box>
                <Typography sx={{ mb: 2 }}>
                  Your request has been submitted to the instructor for review.
                </Typography>
                <Typography>
                  If they have any further questions about your request, they
                  will reach out via email.
                </Typography>
              </Box>
              <Box display={"flex"} justifyContent={"end"} pt={2}>
                <Button onClick={handleDismissConfirmation} variant="contained">
                  Dismiss
                </Button>
              </Box>
            </>
          )}
        </>
      )}
      <ConfirmationDialog
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDialog}
        open={openDialog}
      />
    </Box>
  );
}

export default RequestForm;
