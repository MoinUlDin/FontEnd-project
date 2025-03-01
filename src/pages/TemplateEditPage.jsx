import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TemplatesService from "../services/templatesService";
import TemplateQuestionCard from "../components/TemplateEditorComponents/TemplateQuestionCard";
import CategoryCard from "../components/TemplateEditorComponents/CategoryCard";
import ExistingQuestionsPanel from "../components/TemplateEditorComponents/ExistingQuestionsPanel";

function TemplateEditPage() {
  const { id } = useParams(); // Get template ID from URL
  const dispatch = useDispatch();
  const detailedTemplate = useSelector(
    (state) => state.templates.detailedTemplate
  );
  const [loading, setLoading] = useState(true);

  // Template state with default empty arrays
  const [template, setTemplate] = useState({
    name: "",
    categories: [],
    questions: [],
  });

  // Form states
  const [newCategory, setNewCategory] = useState({ name: "", weight: "" });
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "mcq",
    options: ["", "", "", ""],
    correctAnswer: "",
    weight: "",
    category: "",
  });

  // Drag-and-drop state
  const [activeId, setActiveId] = useState(null);
  const [showExistingQuestions, setShowExistingQuestions] = useState(false);

  // Fetch template details on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!detailedTemplate) {
          await TemplatesService.fetchTemplatedetail(id, dispatch);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading template:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, detailedTemplate]);

  // Initialize template state with fetched data,
  // ensuring categories and questions are set as arrays
  useEffect(() => {
    if (detailedTemplate) {
      setTemplate({
        ...detailedTemplate,
        categories: detailedTemplate.categories || [],
        questions: detailedTemplate.questions || [],
      });
    }
  }, [detailedTemplate]);

  // Add a new category
  const handleAddCategory = () => {
    if (newCategory.name && newCategory.weight) {
      setTemplate((prev) => ({
        ...prev,
        categories: [
          ...prev.categories,
          {
            id: `category-${Date.now()}`,
            ...newCategory,
            weight: parseInt(newCategory.weight),
          },
        ],
      }));
      setNewCategory({ name: "", weight: "" });
    }
  };

  // Add a new question
  const handleAddQuestion = () => {
    if (newQuestion.text && newQuestion.weight && newQuestion.category) {
      setTemplate((prev) => ({
        ...prev,
        questions: [
          ...prev.questions,
          {
            id: `question-${Date.now()}`,
            ...newQuestion,
            weight: parseInt(newQuestion.weight),
          },
        ],
      }));
      setNewQuestion({
        text: "",
        type: "mcq",
        options: ["", "", "", ""],
        correctAnswer: "",
        weight: "",
        category: "",
      });
    }
  };

  // Handle drag-and-drop reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTemplate((prev) => ({
      ...prev,
      questions: arrayMove(
        prev.questions,
        prev.questions.findIndex((q) => q.id === active.id),
        prev.questions.findIndex((q) => q.id === over.id)
      ),
    }));
  };

  // Delete a question
  const handleDeleteQuestion = (questionId) => {
    setTemplate((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  // Save template changes
  const handleSaveTemplate = async () => {
    try {
      await TemplatesService.updateTemplate(id, template, dispatch);
      alert("Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save template. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading template details...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{template.name}</h1>
        <button
          onClick={handleSaveTemplate}
          className="mt-4 bg-sunglow text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Categories */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>

          {/* Add Category Form */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Category Name"
                className="p-2 border rounded"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Weight (%)"
                className="p-2 border rounded"
                value={newCategory.weight}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, weight: e.target.value })
                }
              />
            </div>
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {template.categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onRemove={() =>
                  setTemplate((prev) => ({
                    ...prev,
                    categories: prev.categories.filter(
                      (c) => c.id !== category.id
                    ),
                  }))
                }
              />
            ))}
          </div>
        </div>

        {/* Right Column - Questions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button
              onClick={() => setShowExistingQuestions(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Existing Question
            </button>
          </div>

          {/* Question Form */}
          <div className="mb-6 space-y-4">
            <select
              className="w-full p-2 border rounded"
              value={newQuestion.category}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {template.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Question Text"
              className="w-full p-2 border rounded"
              value={newQuestion.text}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, text: e.target.value })
              }
            />

            <select
              className="w-full p-2 border rounded"
              value={newQuestion.type}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, type: e.target.value })
              }
            >
              <option value="mcq">Multiple Choice</option>
              <option value="open">Open Ended</option>
            </select>

            {newQuestion.type === "mcq" && (
              <div className="space-y-2">
                {newQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className="w-full p-2 border rounded"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                  />
                ))}
                <select
                  className="w-full p-2 border rounded"
                  value={newQuestion.correctAnswer}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      correctAnswer: e.target.value,
                    })
                  }
                >
                  <option value="">Select Correct Answer</option>
                  {newQuestion.options.map((option, index) => (
                    <option key={index} value={option}>
                      Option {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <input
              type="number"
              placeholder="Weight"
              className="w-full p-2 border rounded"
              value={newQuestion.weight}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, weight: e.target.value })
              }
            />

            <button
              onClick={handleAddQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Add Question
            </button>
          </div>

          {/* Questions List */}
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={template.questions}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {template.questions.map((question) => (
                  <TemplateQuestionCard
                    key={question.id}
                    question={question}
                    categories={template.categories}
                    onDelete={() => handleDeleteQuestion(question.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Existing Questions Modal */}
      {showExistingQuestions && (
        <ExistingQuestionsPanel
          onClose={() => setShowExistingQuestions(false)}
          onSelect={(selectedQuestions) => {
            setTemplate((prev) => ({
              ...prev,
              questions: [...prev.questions, ...selectedQuestions],
            }));
          }}
        />
      )}
    </div>
  );
}

export default TemplateEditPage;
