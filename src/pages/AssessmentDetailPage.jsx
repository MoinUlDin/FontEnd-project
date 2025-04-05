// src/pages/AssessmentDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import AssessmentService from "../services/assessmentService";
import duration from "dayjs/plugin/duration";
import { useParams } from "react-router-dom";
import profile_img from "../assets/profile_img.png";
import { BsClockHistory } from "react-icons/bs";
import { CgSandClock } from "react-icons/cg";
import { VscWorkspaceTrusted } from "react-icons/vsc";
dayjs.extend(duration);

export default function AssessmentDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

  // Get assessment details from Redux store.
  // (Assuming that the details are stored once fetched in state.assessment.details)
  const assessment = useSelector((state) => state.assessment.details);
  console.log("Assessment Details", assessment);
  // Fetch assessment details once when the component mounts (or when id changes)
  useEffect(() => {
    if (id) {
      setLoading(true);
      AssessmentService.fetchAssessmentDetail(id, dispatch)
        .catch((err) => {
          setError(true);
          setApiResponse(
            err.message || "Error occurred while fetching details."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading assessment details...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4">
        <p>Error: {apiResponse}</p>
      </div>
    );
  }

  // Destructure with safe defaults:
  const {
    candidate = {},
    start_time,
    end_time,
    final_score,
    category_percentages = {},
    selected_questions = [],
    answers = [],
  } = assessment || {};

  // Use safe defaults for our local variables
  const catPercentages = category_percentages || {};
  const selQuestions = selected_questions || [];
  const ans = answers || [];
  // Compute duration if test is finished (end_time exists)
  let durationStr = "";
  if (start_time && end_time) {
    const diffMs = new Date(end_time) - new Date(start_time);
    const testDuration = dayjs.duration(diffMs);
    durationStr = testDuration.format("HH:mm:ss");
  }

  // Utility function: for a given question, find its corresponding answer.
  // We now check if mcq_question is an object and compare its text.
  const getAnswerForQuestion = (question) => {
    return ans.find((ansItem) => {
      if (ansItem.mcq_question && typeof ansItem.mcq_question === "object") {
        return ansItem.mcq_question.text === question.text;
      }
      return false;
    });
  };

  return (
    <div
      className={`overflow-scroll md:h-[calc(100svh-140px)] h-[calc(100svh-110px)]`}
    >
      <div className="grid grid-cols-9 justify-items-center space-y-4 px-2 md:px-5 py-2 mb-3 md:mb-6 md:py-4 bg-gray-400 rounded-lg md:rounded-[1.5rem] max-w-[90svw] mx-auto md:max-w-[70svw]">
        {/* Candidate Information */}
        <div className="flex items-center gap-3 col-span-9 xs:col-span-5">
          <img
            className="size-8 md:size-12 lg:size-14 rounded-full"
            src={profile_img}
            alt=""
          />
          <div>
            <p className="w-[calc(85px+5vw)] sm:w-auto text-sm md:text-lg truncate capitalize">
              {candidate.userName}
            </p>
            <div className="w-[calc(85px+5vw)] sm:w-auto">
              <p className="text-[8px] md:text-12 truncate">
                {candidate.email}
              </p>
            </div>
          </div>
        </div>
        {/* Started */}
        <div className="col-span-9 xs:col-span-4 flex gap-3 items-center">
          <CgSandClock className="text-xl sm:text-2xl md:text-3xl  text-blue-800" />
          <div>
            <p className="text-sm md:text-14">Test Started </p>
            <p className="text-10 md:text-12 mt-2">
              {start_time ? dayjs(start_time).format("D-MMM-YYYY HH:mm") : "-"}
            </p>
          </div>
        </div>
        {/* Ens */}
        <div className="flex items-center gap-3 col-span-9 xs:col-span-5 ">
          <BsClockHistory className="text-xl sm:text-2xl md:text-4xl  text-blue-800" />
          <div>
            <p className="text-sm md:text-14">Test Duration</p>
            <p className="text-12 mt-2">{durationStr ? durationStr : "n/a"}</p>
          </div>
        </div>
        {/* Scoring */}
        <div className="flex items-center gap-5 xs:gap-3 col-span-9 xs:col-span-4">
          <VscWorkspaceTrusted className="text-xl md:text-3xl  text-blue-800" />
          <div>
            <p className="text-sm md:text-14">Final Score</p>
            <p className="text-12 md:text-12 mt-2">
              {final_score ? `${final_score}%` : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Category Percentages */}
      <div className="mt-10 md:mt-18 lg:mt-22 mb-3 p-3 md:mb-15 md:p-5 bg-gray-600 lg:rounded-tl-[5rem]  lg:rounded-br-[5rem] rounded-br-2xl rounded-tl-3xl md:rounded-br-4xl md:rounded-tl-4xl flex flex-col items-center text-blue-200 max-w-[90svw] mx-auto md:max-w-[70svw]">
        <h2 className="text-lg sm:text-xl md:text-2xl  font-bold mb-2 pb-2 border-b border-gray-500">
          Category Percentages
        </h2>
        <div className="mx-auto min-w-[80%] md:min-w-[90%] px-2 text-[10px] xs:text-sm sm:text-xl md:text-2xl">
          <div className="grid grid-cols-3 content-center text-gray-200 w-full font-bold">
            <p>Name</p>
            <p>Questions</p>
            <p>Score</p>
          </div>
          {Object.entries(catPercentages).map(([categoryName, stats]) => (
            <div key={categoryName} className="grid grid-cols-3 w-full ">
              <p className="">{categoryName}</p>
              <p className="">{stats.total_questions}</p>
              <p className="">
                {parseInt((stats.score / stats.weight) * 100)} %
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Questions and Answers */}
      <div>
        <h2 className="xs:text-sm md:text-xl font-bold m-2 mt-10 md:mt-18 lg:mt-22 md:m-4">
          Questions and Answers
        </h2>
        {selQuestions.map((question) => {
          const answerObj = getAnswerForQuestion(question);
          const candidateAnswer = answerObj ? answerObj.answer_text : null;
          // Get the correct answer from the answer object if available; otherwise, default to empty string.
          const correctAnswer =
            answerObj && answerObj.mcq_question
              ? answerObj.mcq_question.correct_answer
              : "";
          return (
            <div key={question.id} className="border p-4 mb-4">
              <p className="font-bold mb-2">{question.text}</p>
              <div>
                {Object.entries(question.options || {}).map(
                  ([optionKey, optionText]) => {
                    let bgColor = "";
                    if (
                      candidateAnswer === optionKey &&
                      candidateAnswer === correctAnswer
                    ) {
                      bgColor = "bg-green-500";
                    } else if (
                      candidateAnswer === optionKey &&
                      candidateAnswer !== correctAnswer
                    ) {
                      bgColor = "bg-red-300";
                    } else if (
                      optionKey === correctAnswer &&
                      candidateAnswer !== correctAnswer
                    ) {
                      bgColor = "bg-blue-500";
                    }
                    return (
                      <p key={optionKey} className={`p-2 ${bgColor}`}>
                        {optionKey}: {optionText}
                      </p>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
