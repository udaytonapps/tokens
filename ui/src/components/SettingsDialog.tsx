import { Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { TokensCategory, TokensSettings } from "../utils/types";

interface SettingsDialogProps {
  handleClose: () => void;
  open: boolean;
  settings: TokensSettings | null;
}

/** Show settings form */
function SettingsDialog(props: SettingsDialogProps) {
  const { handleClose, open, settings } = props;

  const [initialTokens, setInitialTokens] = useState<number>(0);
  const [emailPref, setEmailPref] = useState<boolean>(false);
  const [categories, setCategories] = useState<TokensCategory[]>([
    { category_name: "Missed Class", token_cost: 1, dbAction: "ADD" },
    { category_name: "Late Assignment", token_cost: 1, dbAction: "ADD" },
  ]);

  useEffect(() => {
    if (settings && open) {
      setInitialTokens(settings.initial_tokens);
      setEmailPref(settings.notifications_pref);
      setCategories(_.cloneDeep(settings.categories));
    }
  }, [settings, open]);

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  const handleTokenCountChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInitialTokens(parseInt(e.target.value));
  };

  const handleEmailPrefChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmailPref(!emailPref);
  };

  const handleCategoryNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newCategories = [...categories];
    newCategories[index].category_name = e.target.value;
    newCategories[index].dbAction = getAddOrUpdateAction(newCategories[index]);
    setCategories(newCategories);
  };

  const handleCategoryTokenCountChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newCategories = [...categories];
    newCategories[index].token_cost = parseInt(e.target.value);
    newCategories[index].dbAction = getAddOrUpdateAction(newCategories[index]);
    setCategories(newCategories);
  };

  const getAddOrUpdateAction = (category: TokensCategory) => {
    if (category.category_id) {
      return "UPDATE";
    } else {
      return "ADD";
    }
  };

  /** Categories are marked for deletion */
  const handleDeleteCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories[index].dbAction = "DELETE";
    setCategories(newCategories);
  };

  const renderCategoryInputs = () => {
    return categories.map((category, i) => {
      return (
        <Box key={`category-container-${i}`}>
          {/* Categories are only shown if not marked for deletion */}
          {category.dbAction !== "DELETE" && (
            <Box display={"flex"} justifyContent={"space-between"}>
              <Box>
                <TextField
                  margin="dense"
                  id={`category-name-input-${i}`}
                  type="text"
                  placeholder="Enter category name..."
                  InputLabelProps={{ shrink: false }}
                  InputProps={{ inputProps: { style: { minWidth: 250 } } }}
                  value={category.category_name}
                  onChange={(e) => handleCategoryNameChange(e, i)}
                  //   error
                />
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <Box width={100}>
                  <TextField
                    margin="dense"
                    id={`category-token-input-${i}`}
                    type="number"
                    placeholder="0"
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      inputProps: { style: { textAlign: "center" } },
                    }}
                    value={category.token_cost}
                    onChange={(e) => handleCategoryTokenCountChange(e, i)}
                    //   error
                  />
                </Box>
                <Box ml={1}>
                  <IconButton onClick={() => handleDeleteCategory(i)}>
                    <Cancel />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      );
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        {settings && (
          <Box mb={3}>
            <DialogContentText>
              Please enter and save the settings for your token economy.
            </DialogContentText>
          </Box>
        )}
        {/* INITIAL TOKEN COUNT */}
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box mr={3}>
            <InputLabel htmlFor="token-count-input">
              <Typography fontWeight={"bold"}>
                Amount of tokens to be available for each student:
              </Typography>
            </InputLabel>
          </Box>
          <Box width={100}>
            <TextField
              autoFocus
              margin="dense"
              id="token-count-input"
              type="number"
              placeholder="0"
              InputLabelProps={{ shrink: false }}
              InputProps={{ inputProps: { style: { textAlign: "center" } } }}
              value={initialTokens}
              onChange={handleTokenCountChange}
              //   error
            />
          </Box>
        </Box>
        {/* EMAIL NOTIFICATIONS */}
        <Box display={"flex"} justifyContent={"start"} alignItems={"center"}>
          <Box mr={3}>
            <InputLabel htmlFor="email-pref-checkbox">
              <Typography fontWeight={"bold"}>Email notifications:</Typography>
            </InputLabel>
          </Box>
          <Checkbox
            checked={emailPref}
            onChange={handleEmailPrefChange}
            inputProps={{
              "aria-label": "Email notifications preference checkbox",
            }}
          />
        </Box>
        <Box mb={3}>
          <Typography variant="body2">
            Receive emails when students submit tokens.
          </Typography>
        </Box>
        {/* CATEGORY SELECTION */}
        <Box display={"flex"} flexDirection={"column"}>
          <Box mr={3}>
            <InputLabel htmlFor="category-input">
              <Typography fontWeight={"bold"}>Categories:</Typography>
            </InputLabel>
          </Box>
          <Box display={"flex"} flexDirection={"column"}>
            {renderCategoryInputs()}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleClose} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsDialog;
