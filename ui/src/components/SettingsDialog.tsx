import {
  Add,
  Cancel,
  InfoOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import { useCallback, useContext, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { DB_DATE_TIME_FORMAT } from "../utils/constants";
import { AppContext } from "../utils/context";
import { TokensSettings } from "../utils/types";

interface SettingsDialogProps {
  handleClose: (event?: object, reason?: string) => void;
  handleSave: (newSettings: TokensSettings) => void;
  open: boolean;
  settings: TokensSettings | null;
}

/** Show settings form */
function SettingsDialog(props: SettingsDialogProps) {
  const { handleClose, handleSave, open, settings } = props;

  const appInfo = useContext(AppContext);

  // Form management
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TokensSettings>();
  const { fields, append, move, update, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "categories", // unique name for your Field Array
  });

  const pref = watch("notifications_pref", true);

  const setDefaultCategories = useCallback(() => {
    setValue("categories", [
      {
        category_name: "Missed Class",
        token_cost: 1,
        dbAction: "ADD",
        sort_order: 0,
        is_used: false,
      },
      {
        category_name: "Late Assignment",
        token_cost: 1,
        dbAction: "ADD",
        sort_order: 1,
        is_used: false,
      },
    ]);
  }, [setValue]);

  useEffect(() => {
    if (settings && open) {
      const formattedDate = DateTime.fromFormat(
        settings.use_by_date,
        DB_DATE_TIME_FORMAT
      ).toISODate();
      setValue("configuration_id", settings.configuration_id);
      setValue("initial_tokens", settings.initial_tokens);
      setValue("notifications_pref", settings.notifications_pref);
      setValue("use_by_date", formattedDate);
      if (settings.categories.length) {
        setValue("categories", settings.categories);
      } else {
        setDefaultCategories();
      }
    } else if (open) {
      setDefaultCategories();
    }
  }, [settings, open, setDefaultCategories, setValue]);

  const moveCategoryUp = (i: number) => {
    move(i, i - 1);
  };

  const moveCategoryDown = (i: number) => {
    move(i, i + 1);
  };

  /** Append a new empty category to the form */
  const handleAddCategory = () => {
    append({ sort_order: fields.length });
  };

  /** Indicates whether less than the minimum number of categories exists */
  const onlyOneCategoryExists = () => {
    const validCategories = fields.filter((category) => {
      return category.dbAction !== "DELETE";
    });
    return validCategories.length <= 1;
  };

  /** Marks a category for deletion */
  const handleDeleteCategory = (index: number) => {
    if (fields[index].category_id) {
      fields[index].dbAction = "DELETE";
      update(index, {
        ...fields[index],
        dbAction: "DELETE",
      });
    } else {
      remove(index);
    }
  };

  /** Handles submission of the form data */
  const onSubmit = (data: TokensSettings) => {
    // Assemble main data
    const settingsToSubmit: TokensSettings = {
      configuration_id: settings?.configuration_id,
      initial_tokens:
        typeof data.initial_tokens === "number"
          ? data.initial_tokens
          : parseInt(data.initial_tokens),
      use_by_date: data.use_by_date,
      notifications_pref: data.notifications_pref,
      categories: data.categories,
    };
    // Update any category dbActions and sortOrder
    settingsToSubmit.categories.forEach((category, i) => {
      category.sort_order = i;
      if (category.category_id && !category.dbAction) {
        category.dbAction = "UPDATE";
      } else if (!category.category_id && !category.dbAction) {
        category.dbAction = "ADD";
      }
    });
    handleSave(settingsToSubmit);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box p={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Instructor Settings</DialogTitle>
          <DialogContent>
            {settings && (
              <Box mb={3}>
                <DialogContentText>
                  View or update the settings for your token economy.
                </DialogContentText>
              </Box>
            )}
            {/* INITIAL TOKEN COUNT */}
            <Box display={"flex"} mt={1} mb={2}>
              <Box minWidth={300} width={300} mr={2} mt={1}>
                <InputLabel htmlFor="token-count" sx={{ whiteSpace: "normal" }}>
                  <Typography fontWeight={"bold"}>
                    Amount of tokens to be available for each student:
                  </Typography>
                </InputLabel>
              </Box>
              <Box minWidth={150} width={150}>
                <TextField
                  autoFocus
                  margin="dense"
                  size="small"
                  id="token-count"
                  type="number"
                  error={!!errors.initial_tokens}
                  InputLabelProps={{ shrink: false }}
                  InputProps={{
                    inputProps: {
                      style: { textAlign: "center" },
                    },
                  }}
                  {...register("initial_tokens", {
                    required: true,
                    pattern: /^[0-9]+$/,
                    min: 1,
                  })}
                  helperText={
                    errors.initial_tokens && "Must be a positive whole number"
                  }
                />
              </Box>
            </Box>
            {/* EXPIRATION / USE BY DATE */}
            <Box display={"flex"} mb={2}>
              <Box minWidth={300} mr={2} mt={2}>
                <InputLabel htmlFor="use-by-date">
                  <Typography fontWeight={"bold"}>
                    Date that tokens must be used by:
                  </Typography>
                </InputLabel>
              </Box>
              <Box>
                <TextField
                  margin="dense"
                  size="small"
                  id="use-by-date"
                  type="date"
                  error={!!errors.use_by_date}
                  InputLabelProps={{ shrink: false }}
                  {...register("use_by_date", {
                    required: true,
                  })}
                  helperText={errors.use_by_date && "Must be a valid date"}
                />
              </Box>
            </Box>
            {/* EMAIL NOTIFICATIONS */}
            <Box mb={2}>
              <Box
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <Box mr={3}>
                  <InputLabel htmlFor="email-pref">
                    <Typography fontWeight={"bold"}>
                      Email notifications for {appInfo.username}:
                    </Typography>
                  </InputLabel>
                </Box>
                <Checkbox
                  color="default"
                  // Make sure it is a boolean or it will change between defined/undefined (uncontrolled)
                  checked={!!pref}
                  inputProps={{
                    "aria-label": "Email notifications preference checkbox",
                  }}
                  {...register("notifications_pref")}
                />
              </Box>
              <Box mb={1}>
                <Typography variant="body2">
                  Receive emails when students use tokens.
                </Typography>
              </Box>
            </Box>
            {/* CATEGORY SELECTION */}
            <Box display={"flex"} flexDirection={"column"}>
              <Box display={"flex"}>
                <Box minWidth={330} mr={2}>
                  <InputLabel htmlFor="category-name-input-0">
                    <Typography fontWeight={"bold"}>Categories:</Typography>
                  </InputLabel>
                </Box>
                <Box
                  minWidth={150}
                  width={150}
                  display={"flex"}
                  alignItems={"center"}
                >
                  <Tooltip
                    title="The amount of tokens a student would need to spend."
                    placement="top"
                  >
                    <InfoOutlined sx={{ mr: 1 }} fontSize="small" />
                  </Tooltip>
                  <InputLabel htmlFor="category-token-input-0">
                    <Typography fontWeight={"bold"}>Token Cost:</Typography>
                  </InputLabel>
                </Box>
              </Box>
              <Box display={"flex"} flexDirection={"column"}>
                {fields.map((category, i) => {
                  return (
                    <Box key={category.id}>
                      {/* Categories are only shown if not marked for deletion */}
                      {category.dbAction !== "DELETE" && (
                        <Box display={"flex"}>
                          <Box>
                            <IconButton
                              size="small"
                              disabled={i === 0}
                              disableRipple
                              onClick={() => moveCategoryUp(i)}
                            >
                              <KeyboardArrowUp fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              disabled={i === fields.length - 1}
                              disableRipple
                              onClick={() => moveCategoryDown(i)}
                            >
                              <KeyboardArrowDown fontSize="small" />
                            </IconButton>
                          </Box>
                          <Box minWidth={300} mr={2}>
                            <TextField
                              margin="dense"
                              size="small"
                              id={`category-name-${i}`}
                              type="text"
                              placeholder="Enter category name..."
                              InputLabelProps={{ shrink: false }}
                              InputProps={{
                                inputProps: { style: { minWidth: 250 } },
                              }}
                              helperText={
                                errors.categories?.[i]?.category_name &&
                                "A category name is required"
                              }
                              //   error
                              error={!!errors.categories?.[i]?.category_name}
                              {...register(`categories.${i}.category_name`, {
                                required: true,
                              })}
                            />
                          </Box>
                          <Box
                            display={"flex"}
                            alignItems={"start"}
                            minWidth={200}
                          >
                            <Box minWidth={150} width={150}>
                              <TextField
                                disabled={category.is_used}
                                margin="dense"
                                size="small"
                                id={`category-token-${i}`}
                                type="number"
                                InputLabelProps={{ shrink: false }}
                                InputProps={{
                                  inputProps: {
                                    style: { textAlign: "center" },
                                  },
                                }}
                                error={!!errors.categories?.[i]?.token_cost}
                                helperText={
                                  errors.categories?.[i]?.token_cost &&
                                  "Must be a positive whole number"
                                }
                                {...register(`categories.${i}.token_cost`, {
                                  required: true,
                                  pattern: /^[0-9]+$/,
                                  min: 1,
                                })}
                              />
                            </Box>
                            <Box ml={1} mt={1}>
                              <Tooltip
                                title={
                                  category.is_used
                                    ? "Category is associated with a request and cannot be deleted"
                                    : ""
                                }
                              >
                                <div>
                                  <IconButton
                                    disabled={
                                      category.is_used ||
                                      onlyOneCategoryExists()
                                    }
                                    onClick={() => handleDeleteCategory(i)}
                                  >
                                    <Cancel />
                                  </IconButton>
                                </div>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
              <Box mt={2}>
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
            {settings?.configuration_id && (
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
            )}
            <Button variant="contained" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
}

export default SettingsDialog;
