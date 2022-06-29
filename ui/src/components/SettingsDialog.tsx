import { Add, Cancel } from "@mui/icons-material";
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
  handleSave: (newSettings: TokensSettings) => void;
  open: boolean;
  settings: TokensSettings | null;
}

/** Show settings form */
function SettingsDialog(props: SettingsDialogProps) {
  const { handleClose, handleSave, open, settings } = props;

  const [initialTokens, setInitialTokens] = useState<number | string>("");
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
    const count = e.target.value ? parseInt(e.target.value) : "";
    setInitialTokens(count);
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
    newCategories[index].token_cost = e.target.value
      ? parseInt(e.target.value)
      : "";
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

  const handleAddCategory = () => {
    const newCategories: TokensCategory[] = [
      ...categories,
      {
        category_name: "",
        token_cost: "",
        dbAction: "ADD",
      },
    ];
    setCategories(newCategories);
  };

  /** Categories are marked for deletion */
  const handleDeleteCategory = (index: number) => {
    const categoryToDelete = categories[index];
    if (categoryToDelete.category_id) {
      // If it has an id, it exists in the db must be marked for deletion
      categoryToDelete.dbAction = "DELETE";
    } else {
      // Otherwise, it can simple be spliced from the array
      categories.splice(index, 1);
    }
    const newCategories = [...categories];
    setCategories(newCategories);
  };

  const handleClickSave = () => {
    const newSettings: TokensSettings = {
      initial_tokens: Number(initialTokens),
      notifications_pref: emailPref,
      categories,
    };
    handleSave(newSettings);
  };

  const renderCategoryInputs = () => {
    // Headers for inputs - tooltip for cost explanation
    return categories.map((category, i) => {
      return (
        <Box key={`category-container-${i}`}>
          {/* Categories are only shown if not marked for deletion */}
          {category.dbAction !== "DELETE" && (
            <Box display={"flex"} justifyContent={"space-between"}>
              <Box minWidth={300} width={"70%"}>
                <TextField
                  margin="dense"
                  size="small"
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
              <Box
                display={"flex"}
                alignItems={"center"}
                minWidth={150}
                width={"30%"}
              >
                <Box width={75} minWidth={75}>
                  <TextField
                    margin="dense"
                    size="small"
                    id={`category-token-input-${i}`}
                    type="number"
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
      <Box p={2}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          {settings && (
            <Box mb={3}>
              <DialogContentText>
                View or update the settings for your token economy.
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
            <Box width={75} minWidth={75}>
              <TextField
                autoFocus
                margin="dense"
                size="small"
                id="token-count-input"
                type="number"
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
                <Typography fontWeight={"bold"}>
                  Email notifications:
                </Typography>
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
              Receive emails when students use tokens.
            </Typography>
          </Box>
          {/* CATEGORY SELECTION */}
          <Box display={"flex"} flexDirection={"column"}>
            <Box display={"flex"}>
              <Box pr={3} minWidth={300} width={"70%"}>
                <InputLabel htmlFor="category-name-input-0">
                  <Typography fontWeight={"bold"}>Categories:</Typography>
                </InputLabel>
              </Box>
              <Box minWidth={150} width={"30%"}>
                <InputLabel htmlFor="category-token-input-0">
                  <Typography fontWeight={"bold"}>Token Cost:</Typography>
                </InputLabel>
              </Box>
            </Box>
            <Box display={"flex"} flexDirection={"column"}>
              {renderCategoryInputs()}
            </Box>
            <Box pt={1}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddCategory}
              >
                New Category
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleClickSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default SettingsDialog;
