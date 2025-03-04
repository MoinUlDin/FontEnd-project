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

  // For copying questions, selected questions come from state.category.selected.
  const selected = useSelector((state) => state.category?.selected || []);

  // Use API data: categories from state.category.list
  const categories = useSelector((state) =>
    state.category ? state.category.list : []
  );

  // Initialize Autocomplete selected options with "All"
  const [selectedOptions, setSelectedOptions] = useState([
    { id: "all", name: "All" },
  ]);

  useEffect(() => {
    if (categories.length === 0) {
      CategoryServive.fetchCategoriesList(dispatch).catch((error) => {
        setError(error);
      });
    }
  }, [categories.length, dispatch]);

  // Build Autocomplete options: use only id and name from API data.
  const autocompleteOptions = [{ id: "all", name: "All" }, ...categories];

  // Filter categories based on Autocomplete selection.
  let filteredCategories = categories;
  if (
    selectedOptions.length > 0 &&
    !selectedOptions.find((option) => option.id === "all")
  ) {
    filteredCategories = categories.filter((cat) =>
      selectedOptions.find((option) => option.id === cat.id)
    );
  }

  // State to manage open state of copy dialog.
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="py-4 px-4">
      <div>
        <h1 className="text-center mb-3">Existing Categories Panel</h1>
        <div className="flex gap-10">
          {/* Autocomplete for filtering */}
          <div className="mb-4 grow">
            <Autocomplete
              size="small"
              multiple
              options={autocompleteOptions}
              getOptionLabel={(option) => option.name}
              value={selectedOptions}
              onChange={(event, newValue) => {
                if (newValue.find((option) => option.id === "all")) {
                  setSelectedOptions([{ id: "all", name: "All" }]);
                } else {
                  setSelectedOptions(newValue);
                }
              }}
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
