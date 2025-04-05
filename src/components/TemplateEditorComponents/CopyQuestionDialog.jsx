import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setCopiedCategory,
  clearSelectedQuestion,
} from "../../features/categorySlice";

import { copyQuestionsToCategory } from "../../features/templateSlice";

const CopyQuestionDialog = ({ open, onClose, selectedQuestionIds }) => {
  const dispatch = useDispatch();

  // Extract categories from editTemplate (which follows the given structure)
  const editTemplate = useSelector((state) => state.templates.editTemplate);
  const categories = (editTemplate && editTemplate.categories) || [];

  // Build autocomplete options: each option has only id and name
  const autocompleteOptions = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  // Also, get details (for looking up questions by ID)
  const details = useSelector((state) => state.category.details);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleConfirm = () => {
    if (!selectedCategory) return;

    // For each selected question ID, look up the question from the details object.
    const selectedQuestions = selectedQuestionIds.flatMap((qid) =>
      Object.values(details).flatMap((categoryData) =>
        (categoryData.questions || []).filter((q) => q.id === qid)
      )
    );

    // Dispatch an action to copy these questions into the selected category of editTemplate.
    dispatch(
      copyQuestionsToCategory({
        categoryId: selectedCategory.id,
        questions: selectedQuestions,
      })
    );

    dispatch(clearSelectedQuestion());
    handleDialogClose();
  };

  const handleDialogClose = () => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>Copy Selected Questions</DialogTitle>
      <DialogContent>
        <Autocomplete
          className="mt-4"
          options={autocompleteOptions}
          getOptionLabel={(option) => option.name}
          value={selectedCategory}
          size="small"
          onChange={(event, newValue) => setSelectedCategory(newValue)}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Select Category" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" size="small">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyQuestionDialog;
