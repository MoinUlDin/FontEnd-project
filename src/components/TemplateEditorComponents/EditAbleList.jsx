import React, { useState, useEffect } from "react";
import QuestionItem from "../../components/childrens/QuestionItem"; // Your question component
import { useDispatch, useSelector } from "react-redux";
import CategoryService from "../../services/categoriesService";
import { FaTrash } from "react-icons/fa";
import { removeQuestion } from "../../features/templateSlice";

function EditAbleList({ title, id, weight, questions, bin, checkbox }) {
  const dispatch = useDispatch();
  const editTemplate = useSelector((state) => state.templates.editTemplate);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    console.log("rerendering");
  }, [editTemplate]);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const handleRemoveQuestion = (categoryId, questionId) => {
    dispatch(removeQuestion({ categoryId, questionId }));
  };
  return (
    <div className="md:max-w-dash-lg max-w-dash mt-templist md:mt-templist-md">
      <div
        onClick={toggleExpand}
        className="custom_grid bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:shadow-gray-400 hover:scale-x-101 hover:cursor-pointer transition-all duration-100"
      >
        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <p className="text-purple-600 font-semibold text-dash-it hover:underline">
              {title}
            </p>
          </div>
        </div>
        <div className="place-self-center text-dash-it">{weight}</div>
        <div className="place-self-center text-dash-it">
          {questions?.length}
        </div>
      </div>
      {isExpanded && (
        <div className="ml-4 mt-2">
          {questions.map((question) => (
            <div className="flex items-center gap-3" key={question.id}>
              <div className="grow">
                <QuestionItem
                  question={question}
                  fontsize="text-12"
                  margin="mt-2"
                  checkbox={checkbox}
                />
              </div>
              {bin && (
                <FaTrash
                  className="hover:text-red-500 text-lg text-blue-700 hover:cursor-pointer"
                  onClick={() => handleRemoveQuestion(id, question.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditAbleList;
