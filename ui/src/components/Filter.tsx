import { ExpandMore, FilterList } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Popover,
  TextField,
} from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";

interface FilterProps {
  rows: any[];
  filters: any[];
  filterRows: (rows: any[]) => void;
  buttonLabel?: string;
}

type FilterEnumerableReference = Record<string, Record<string, boolean>>;
type FilterActiveReference = Record<string, Record<string, boolean>>;

/** Filters data */
function Filter(props: FilterProps) {
  const { rows, filters, filterRows, buttonLabel } = props;
  //   const [filteredRows, setFilteredRows] = useState(rows);
  const [enumReference, setEnumReference] = useState<FilterEnumerableReference>(
    {}
  );
  const [activeReference, setActiveReference] = useState<FilterActiveReference>(
    {}
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;

  useEffect(() => {
    // Assemble data for the filter capability
    const newEnumReference: FilterEnumerableReference = {};
    const newActiveReference: FilterActiveReference = {};
    rows.forEach((row) => {
      filters.forEach((filter) => {
        // Add each distinct column/row value to the map
        addReference(newEnumReference, filter.column, row);
        // Set the active state for the rows that are passed in
        addReference(newActiveReference, filter.column, row);
      });
    });
    setActiveReference(newActiveReference);
    setEnumReference(newEnumReference);
  }, [rows, filters]);

  const addReference = (
    reference: FilterEnumerableReference | FilterActiveReference,
    col: any,
    row: any[]
  ) => {
    if (reference[col]) {
      reference[col][row[col]] = true;
    } else {
      reference[col] = {
        [row[col]]: true,
      };
    }
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //   const handleFilterTextChange = (
  //     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //     col: string
  //   ) => {
  //     console.log(e.target.value);
  //   };

  const toggleCheckbox = (col: string, key: string) => {
    activeReference[col][key] = !activeReference[col][key];
    setActiveReference({ ...activeReference });
    applyFilters();
  };

  //   const toggleAllCheckbox = (col: string) => {
  //     // Need to either select or deselect all
  //     // If all are already selected, deselect all
  //     // If any are deselected, select all
  //   };

  //   const handleClickApply = () => {
  //     handleClose();
  //     applyFilters();
  //   };

  const applyFilters = () => {
    let filteredRows: any[] = rows;
    for (const filter of filters) {
      filteredRows = filteredRows.filter((row) => {
        if (filter.type === "enum") {
          const filterOut = !activeReference[filter.column][row[filter.column]];
          if (filterOut) {
            return false;
          }
        }
        return true;
      });
    }
    filterRows(filteredRows);
  };

  return (
    <Box display={"flex"} justifyContent={"end"}>
      {buttonLabel ? (
        <Button
          aria-describedby={id}
          endIcon={<FilterList />}
          variant="outlined"
          onClick={handleClick}
        >
          Filters
        </Button>
      ) : (
        <IconButton disableRipple aria-describedby={id} onClick={handleClick}>
          {<FilterList />}
        </IconButton>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box display={"flex"} flexWrap={"wrap"}>
          {filters.map((filter, i) => {
            return (
              <Accordion
                key={`${filter.column}-${i}`}
                defaultExpanded={true}
                disableGutters
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`filter-panel-${i}`}
                  id={`filter-panel-${i}`}
                >
                  <FormLabel>{filter.label}</FormLabel>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Need to first check if enumReference[filter.column] exists */}
                  {/* <Autocomplete
                    blurOnSelect
                    size="small"
                    disablePortal
                    id={`${filter.column}-autocomplete`}
                    options={Object.keys(enumReference[filter.column]).map(
                      (key) => key
                    )}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Movie" />
                    )}
                  /> */}
                  {filter.type === "enum" ? (
                    <Box display={"flex"}>
                      {enumReference[filter.column] && (
                        <FormGroup>
                          {/* All or none option */}
                          {/* <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                color="default"
                                checked={true}
                                onClick={() => toggleAllCheckbox(filter.column)}
                              />
                            }
                            label={
                              <Typography fontWeight={"bold"}>
                                Select all
                              </Typography>
                            }
                          /> */}
                          {Object.keys(enumReference[filter.column]).map(
                            (key, i) => {
                              return (
                                <Box key={`${filter.column}-${i}-${key}`}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        size="small"
                                        color="default"
                                        checked={
                                          activeReference[filter.column][
                                            key
                                          ] === true
                                        }
                                        onClick={() =>
                                          toggleCheckbox(filter.column, key)
                                        }
                                      />
                                    }
                                    label={
                                      filter.valueMapping
                                        ? filter.valueMapping(key)
                                        : key
                                    }
                                  />
                                </Box>
                              );
                            }
                          )}
                        </FormGroup>
                      )}
                    </Box>
                  ) : (
                    <Box>
                      <TextField size="small" type={filter.type} />
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
        {/* <Box display={"flex"} justifyContent={"end"} pr={1} pb={1}>
          <Button sx={{ mr: 1 }} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleClickApply}>
            Apply
          </Button>
        </Box> */}
      </Popover>
    </Box>
  );
}

export default Filter;
