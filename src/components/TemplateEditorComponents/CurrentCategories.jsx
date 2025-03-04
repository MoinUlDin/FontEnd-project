import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Stack from "@mui/material/Stack";
import SecondaryListItem from "../../components/childrens/SecondaryListItem";
import AddQuestionForm from "./AddQuestionForm";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addCategory, removeCategory } from "../../features/templateSlice";
import EditAbleList from "./EditAbleList";

function CurrentCategories() {
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState({ name: "", weight: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();

  // Left panel: use the editTemplate from Redux.
  const editTemplate = useSelector((state) => state.templates.editTemplate);

  // Calculate total weight from current editTemplate categories.
  const currentSum = editTemplate.categories
    ? editTemplate.categories.reduce((acc, cat) => acc + Number(cat.weight), 0)
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.name || !category.weight) {
      alert("Both fields are required!");
      return;
    }
    const weightValue = Number(category.weight);
    if (weightValue < 10 || weightValue > 100) {
      alert("Category weight must be between 10 and 100.");
      return;
    }
    if (currentSum + weightValue > 100) {
      alert(
        `Adding this category would exceed the total weight of 100. Current total: ${currentSum}`
      );
      return;
    }
    const newId = Date.now();
    dispatch(
      addCategory({
        id: newId,
        name: category.name,
        weight: weightValue,
        questions: [],
      })
    );
    setCategory({ name: "", weight: "" });
    setVisible(false);
  };

  const handleRemoveCategory = (id) => {
    dispatch(removeCategory({ id }));
  };
  const onclose = () => setDialogOpen(false);

  return (
    <div className="px-7">
      {/* Top right buttons */}
      <div className="flex gap-3 justify-end mb-4 mt-2">
        <Button
          variant="outlined"
          size="small"
          onClick={() => setVisible((prev) => !prev)}
        >
          Add New Category
        </Button>
        <Button
          onClick={() => setDialogOpen(true)}
          variant="outlined"
          size="small"
          className="ml-2"
        >
          Add Questions
        </Button>
      </div>
      {/* Form to add new category (conditionally rendered) */}
      {visible && (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col px-3">
            <div className="text-2xl m-5 flex gap-3">
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                margin="normal"
                size="small"
                value={category.name}
                onChange={(e) =>
                  setCategory({ ...category, name: e.target.value })
                }
              />
              <TextField
                id="weight"
                label="Weight"
                variant="outlined"
                margin="normal"
                size="small"
                type="number"
                value={category.weight}
                onChange={(e) =>
                  setCategory({ ...category, weight: e.target.value })
                }
              />
              <Stack className="mt-5">
                <Button
                  type="submit"
                  startIcon={<SaveIcon />}
                  size="small"
                  variant="contained"
                >
                  Save
                </Button>
              </Stack>
            </div>
          </div>
        </form>
      )}

      {/* Conditionally render the add question form only if dialogOpen is true */}
      {dialogOpen && (
        <div className="mt-4">
          <AddQuestionForm
            onClose={onclose}
            onSubmitSuccess={() => setDialogOpen(false)}
          />
        </div>
      )}

      {/* Render the list of categories from editTemplate */}
      <div>
        {editTemplate.categories?.map((item) => (
          <div className="flex gap-3" key={item.id}>
            <div className="grow">
              <EditAbleList
                id={item.id}
                title={item.name}
                weight={item.weight}
                questions={item.questions}
                bin={true}
                onRemove={() => handleRemoveCategory(item.id)}
              />
            </div>
            <FaTrash
              className="hover:text-red-500 text-sunglow mt-6 text-xl hover:cursor-pointer"
              onClick={() => handleRemoveCategory(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentCategories;
