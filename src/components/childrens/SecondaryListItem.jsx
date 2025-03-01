import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem"; // Your question component
import { useDispatch, useSelector } from "react-redux";
import CategoryService from "../../services/categoriesService";

function SecondaryListItem({ title, id, weight, questions = [] }) {
  const dispatch = useDispatch();

  const [localQuestions, setLocalQuestions] = useState(questions);

  const [isExpanded, setIsExpanded] = useState(false);

  // Selector to get any cached detailed data for this category from Redux.
  // Our store is set up so that detailed category data is stored in state.category.details keyed by id.
  const storedDetail = useSelector((state) => state.category.details[id]);

  // When the item is expanded and there are no questions yet,
  // check if we have data in the store; if not, fetch from the API.
  useEffect(() => {
    if (isExpanded && localQuestions.length === 0) {
      if (
        storedDetail &&
        storedDetail.questions &&
        storedDetail.questions.length > 0
      ) {
        setLocalQuestions(storedDetail.questions);
      } else {
        CategoryService.fetchDetailedCategory(dispatch, id).catch((error) => {
          console.error("Error fetching category details: ", error);
        });
      }
    }
  }, [isExpanded, localQuestions, storedDetail, dispatch, id]);

  useEffect(() => {
    if (
      storedDetail &&
      storedDetail.questions &&
      storedDetail.questions.length > 0
    ) {
      setLocalQuestions(storedDetail.questions);
    }
  }, [storedDetail]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      key={id}
      className="md:max-w-dash-lg max-w-dash mt-templist md:mt-templist-md"
    >
      <div
        onClick={toggleExpand}
        className="custom_grid bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:shadow-gray-400  hover:scale-x-101   hover:cursor-pointer transition-all duration-100"
      >
        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="text-purple-600 font-semibold text-dash-it hover:underline"
            >
              {title}
            </a>
          </div>
        </div>

        <div className="place-self-center text-dash-it">{weight}</div>
        <div className="place-self-center text-dash-it">
          {localQuestions.length}
        </div>
      </div>
      {isExpanded && (
        <div className="ml-4 mt-2">
          {localQuestions.map((question, index) => (
            <QuestionItem
              key={index}
              question={question}
              fontsize="text-12"
              margin="mt-2"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SecondaryListItem;
