// src/pages/AssessmentDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import AssessmentService from "../services/assessmentService";
import duration from "dayjs/plugin/duration";
import { useParams } from "react-router-dom";
import profile_img from "../assets/profile_img.png";
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

  // Fetch assessment details once when the component mounts (or when id changes)
  useEffect(() => {
    if (id) {
      setLoading(true);
      console.log(
        "calling AssessmentService to fetch assessment details. ID:",
        id
      );
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
    <div className="p-4">
      <div className="flex items-center justify-between px-5 p-3 max-w-[80%] bg-gray-300 rounded-full">
        {/* Candidate Information */}
        <div className="flex items-center gap-3">
          <img className="h-14 w-14 rounded-full" src={profile_img} alt="" />
          <div>
            <p className="text-lg capitalize">{candidate.userName}</p>
            <p className="text-12">{candidate.email}</p>
          </div>
        </div>
        {/* Started */}
        <div>
          <p className="text-14">Test Started </p>
          <p className="text-12 mt-2">
            {start_time ? dayjs(start_time).format("D-MMM-YYYY HH:mm") : "-"}
          </p>
        </div>
        {/* Ens */}
        <div>
          <p className="text-14">Test Duration</p>
          <p className="text-12 mt-2">{durationStr ? durationStr : "n/a"}</p>
        </div>
        {/* Scoring */}
        <div>
          <p className="text-14">Final Score</p>
          <p className="text-12 mt-2">
            {final_score ? `${final_score}%` : "-"}
          </p>
        </div>
      </div>

      {/* Category Percentages */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Category Percentages</h2>
        <ul>
          {Object.entries(catPercentages).map(([key, value]) => (
            <li key={key} className="text-lg">
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>

      {/* Questions and Answers */}
      <div>
        <h2 className="text-xl font-bold mb-2">Questions and Answers</h2>
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
