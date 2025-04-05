import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryServive from "../../services/categoriesService";
import SecondaryListItem from "../childrens/SecondaryListItem";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CopyQuestionDialog from "../TemplateEditorComponents/CopyQuestionDialog";

function ExistingCategories() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // Selected questions
  const selected = useSelector((state) => state.category?.selected || []);

  // API categories list
  const categories = useSelector((state) => state.category?.list || []);

  // Remove "All" from the initial state
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (categories.length === 0) {
      CategoryServive.fetchCategoriesList(dispatch).catch(setError);
    }
  }, [categories.length, dispatch]);

  // Autocomplete options from API
  const autocompleteOptions = categories.map(({ id, name }) => ({ id, name }));

  // Filter categories when options are selected
  const filteredCategories =
    selectedOptions.length > 0
      ? categories.filter((cat) =>
          selectedOptions.some((option) => option.id === cat.id)
        )
      : categories; // Show all if nothing is selected

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="py-4 px-4">
      <div>
        <h1 className="text-center mb-3">Existing Categories Panel</h1>
        <div className="flex md:flex-row flex-col gap-2 md:gap-5 lg:gap-10">
          {/* Autocomplete for filtering */}
          <div className="mb-4 grow">
            <Autocomplete
              size="small"
              multiple
              options={autocompleteOptions}
              getOptionLabel={(option) => option.name}
              value={selectedOptions}
              onChange={(event, newValue) => setSelectedOptions(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Filter Categories"
                  placeholder="Select Categories"
                />
              )}
            />
          </div>
          {/* Copy Button */}
          <div>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Copy
            </Button>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div>
        <p className="text-sm text-end mr-2">
          Selected: <span>{selected.length}</span>
        </p>
        {filteredCategories.map((item) => (
          <SecondaryListItem
            key={item.id}
            id={item.id}
            title={item.name}
            weight={item.weight}
            checkbox={true}
          />
        ))}
      </div>
      <CopyQuestionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedQuestionIds={selected}
      />
    </div>
  );
}

export default ExistingCategories;
