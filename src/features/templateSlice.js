import { createSlice } from "@reduxjs/toolkit";

const templatesSlice = createSlice({
  name: "templates",
  initialState: {
    list: [],
    detailedTemplate: {},
    editTemplate: {},
  },
  reducers: {
    setTemplates(state, action) {
      state.list = action.payload;
    },
    setDetailedTemplate(state, action) {
      state.detailedTemplate = action.payload;
    },
    editTempInit(state) {
      // Deep copy the detailedTemplate into editTemplate
      console.log("tempinit get called");
      state.editTemplate = JSON.parse(JSON.stringify(state.detailedTemplate));
    },
    addCategory(state, action) {
      console.log("addCategory get called");
      // Ensure categories exists on editTemplate
      if (!state.editTemplate.categories) {
        state.editTemplate.categories = [];
      }
      // Action payload should match: { id, name, weight, questions: [] }
      state.editTemplate.categories.push(action.payload);
    },
    // Remove a category from editTemplate.categories by its id
    removeCategory(state, action) {
      console.log("addCategory get called");
      const id = action.payload.id;
      if (state.editTemplate.categories) {
        state.editTemplate.categories = state.editTemplate.categories.filter(
          (cat) => cat.id !== id
        );
      }
    },

    addQuestion(state, action) {
      const { categoryId, question, sender } = action.payload;
      console.log("addCategory get called", sender);
      // Find the matching category in editTemplate.categories
      const category = state.editTemplate.categories.find(
        (cat) => cat.id === categoryId
      );
      if (category) {
        // Ensure the questions array exists before adding
        if (!category.questions) {
          category.questions = [];
        }
        category.questions.push(question);
      }
    },

    removeQuestion(state, action) {
      const { categoryId, questionId } = action.payload;
      console.log(
        `removeQuestion called. Category: ${categoryId} Question: ${questionId}`
      );
      const category = state.editTemplate.categories.find(
        (cat) => cat.id === categoryId
      );
      if (category && category.questions) {
        category.questions = category.questions.filter(
          (q) => q.id !== questionId
        );
      }
    },

    copyQuestionsToCategory(state, action) {
      const { categoryId, questions } = action.payload;
      const category = state.editTemplate.categories.find(
        (cat) => cat.id === categoryId
      );
      if (category) {
        if (!category.questions) {
          category.questions = [];
        }
        category.questions = [...category.questions, ...questions];
      }
    },
  },
});

export const {
  setTemplates,
  setDetailedTemplate,
  editTempInit,
  addCategory,
  removeCategory,
  addQuestion,
  removeQuestion,
  copyQuestionsToCategory,
} = templatesSlice.actions;
export default templatesSlice.reducer;
