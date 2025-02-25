import React, { useState } from "react";
import QuestionItem from "./QuestionItem"; // import the question component

function SecondaryListItem({ title, id, weight, questions }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <div
      key={id}
      className="md:max-w-dash-lg max-w-dash mt-templist md:mt-templist-md"
      onClick={toggleExpand}
    >
      <div className="custom_grid bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:shadow-gray-400  hover:scale-x-101   hover:cursor-pointer transition-all duration-100">
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
        <div className="place-self-center text-dash-it">{questions.length}</div>
      </div>
      {isExpanded && (
        <div className="ml-4 mt-2">
          {questions.map((question, index) => (
            <QuestionItem key={index} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SecondaryListItem;

// export default function SecondaryListItem({ title, id, weight, questions }) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const toggleExpand = () => {
//     setIsExpanded((prev) => !prev);
//   };

//   return (
//     <div className="border p-2 my-2">
//       {/* Category header */}
//       <div
//         className="flex justify-between items-center cursor-pointer"
//         onClick={toggleExpand}
//       >
//         <div className="font-semibold">{title}</div>
//         <div>
//           Weight: {weight} | Questions: {questions.length}
//         </div>
//       </div>

//       {/* Expandable list of questions */}
//       {isExpanded && (
//         <div className="ml-4 mt-2">
//           {questions.map((question, index) => (
//             <QuestionItem key={index} question={question} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
