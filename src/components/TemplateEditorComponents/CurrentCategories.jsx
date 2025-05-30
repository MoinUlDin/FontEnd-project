import React, { useState, useRef } from "react";
import { TextField, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Stack from "@mui/material/Stack";
import AddQuestionForm from "./AddQuestionForm";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaFileImport, FaTrash } from "react-icons/fa";
import {
  addCategory,
  updateCategory,
  removeCategory,
  copyQuestionsToCategory,
} from "../../features/templateSlice";
import EditAbleList from "./EditAbleList";
import { FiDownload, FiPlus } from "react-icons/fi";
import csvToJson from "../../helpers/csvToJson";

function CurrentCategories() {
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState({ name: "", weight: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

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

  // Updated: Trigger sample file download.
  const handleDownload = async () => {
    try {
      const response = await fetch("/sampleQuestion.csv");
      const textContent = await response.text();
      const blob = new Blob([textContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sampleQuestion.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching sample file:", error);
    }
  };

  // Updated: Open file selector for bulk import.
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Updated: Process file upload to update editTemplate in Redux.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          let jsonData;
          const fileContent = event.target.result;
          if (extension === "csv" || extension === "txt") {
            // Use csvToJson for CSV or text file
            jsonData = csvToJson(fileContent);
          } else {
            throw new Error("Unsupported file format");
          }
          // Process the jsonData similar to before.
          if (jsonData.categories) {
            const currentCategories = editTemplate.categories || [];
            jsonData.categories.forEach((catData) => {
              // Check if the category already exists by comparing names.
              let existingCategory = currentCategories.find(
                (cat) =>
                  cat.name.toLowerCase() === catData.category_name.toLowerCase()
              );
              if (!existingCategory) {
                // Create a new category.
                const newCategory = {
                  id: Date.now() + Math.random(), // generate unique id
                  name: catData.category_name,
                  weight: Number(catData.category_weight),
                  questions: [],
                };
                dispatch(addCategory(newCategory));
                existingCategory = newCategory;
              }
              // Process and add questions for the category.
              const questionsToAdd = catData.questions.map((q) => ({
                ...q,
                id: Date.now() + Math.random(), // generate unique id for each question
                weight: Number(q.weight),
              }));
              dispatch(
                copyQuestionsToCategory({
                  categoryId: existingCategory.id,
                  questions: questionsToAdd,
                })
              );
            });
          }
        } catch (error) {
          console.error("Error processing imported file", error);
        }
      };
      // For Excel files we need to read as ArrayBuffer; for others as text.
      if (extension === "xls" || extension === "xlsx") {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
      e.target.value = "";
    }
  };

  // Manage editing state for inline editing of category details.
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const handleUpdateCategory = (id, newName, newWeight) => {
    // Dispatch an action to update the category.
    dispatch(updateCategory({ id, name: newName, weight: newWeight }));
    setEditingCategoryId(null);
  };

  // NEW: Manage expanded category state (only one expanded at a time).
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  return (
    <div className="px-7">
      {/* Top right buttons */}
      <div className="md:flex grid grid-cols-12 gap-3 justify-end mb-4 mt-2">
        <Button
          variant="contained"
          size="small"
          className="sm:col-span-6 col-span-12"
          onClick={() => setVisible((prev) => !prev)}
        >
          <div className="flex items-center gap-1">
            <FiPlus className="text-xl text-amber-300" />
            <span className="text-[12px]">New Category</span>
          </div>
        </Button>
        <Button
          onClick={() => setDialogOpen(true)}
          variant="contained"
          size="small"
          className="ml-2 sm:col-span-6 col-span-12"
        >
          <div className="flex items-center gap-1">
            <FiPlus className="text-xl text-amber-300" />
            <span className="text-[12px]">Add Questions</span>
          </div>
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          size="small"
          className="ml-2 sm:col-span-6 col-span-12"
        >
          <div className="flex items-center gap-2">
            <FaFileImport className="text-sm text-amber-400" />
            <span className="text-[12px]">Bulk Import</span>
          </div>
        </Button>
        <Button
          onClick={handleDownload}
          variant="contained"
          size="small"
          className="ml-2 sm:col-span-6 col-span-12"
        >
          <div className="flex items-center justify-center gap-2">
            <FiDownload className="text-sm text-amber-500" />
            <span className="text-[12px]">Sample File</span>
          </div>
        </Button>
      </div>
      {/* Hidden file input for bulk import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.txt"
        style={{ display: "none" }}
      />
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
                checkbox={false} // or pass true if needed
                editing={editingCategoryId === item.id}
                onUpdateCategory={handleUpdateCategory}
                onCancelEdit={() => setEditingCategoryId(null)}
                onRemove={() => handleRemoveCategory(item.id)}
                // NEW props to control expansion
                expanded={expandedCategoryId === item.id}
                onToggle={() =>
                  setExpandedCategoryId(
                    expandedCategoryId === item.id ? null : item.id
                  )
                }
              />
            </div>
            <FaEdit
              className="hover:text-green-500 ptr text-sunglow mt-6 text-xl hover:cursor-pointer"
              onClick={() => setEditingCategoryId(item.id)}
            />
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
