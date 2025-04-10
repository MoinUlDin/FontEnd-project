import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TempService from "../services/tempService";
import { useDispatch, useSelector } from "react-redux";
import SecondaryListItem from "../components/childrens/SecondaryListItem";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

export default function TemplateDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detailedTemplate = useSelector(
    (state) => state.templates.detailedTemplate
  );
  const [loading, setLoading] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  // Provide a default empty array for categories if it's not defined yet.
  const categories = detailedTemplate.categories || [];
  // Format the date if available.
  const fdate = detailedTemplate.created_at
    ? dayjs(detailedTemplate.created_at).format("D-MMM-YYYY")
    : "";

  useEffect(() => {
    setLoading(true);
    TempService.fetchTemplatedetail(id, dispatch)
      .catch((e) => console.log("Custom ", e))
      .finally(() => setLoading(false));
  }, [dispatch, id]);

  // Optionally, render a loading state until data is available.
  if (loading || !detailedTemplate.created_at) {
    return <div>Loading template details...</div>;
  }
  const handleEditClick = () => {
    const URL = `/tempate/edit-template/${id}`;
    console.log("ID: ", id);
    navigate(URL);
  };
  return (
    <div className="px-4">
      <header className="w-full px-4 pb-1 border-b">
        <div className="w-full flex justify-between mb-1">
          <div className="flex flex-col">
            <h1 className="font-bold text-sm sm:text-xl md:text-2xl">
              {detailedTemplate.name}
            </h1>
            <p className="text-[10px]">{detailedTemplate.description}</p>
          </div>
          <button
            onClick={handleEditClick}
            className="flex cursor-pointer gap-2 items-center p-1 px-4 hover:border rounded-xl border-blue-700"
          >
            <FiEdit className="text-blue-500" />
            <span className="font-bold">Edit</span>
          </button>
          <div className="sm:flex flex-col gap-2 hidden ">
            <div className="flex gap-2">
              <span className="text-dash-it">CreatedBy: </span>
              <span className="text-dash-it font-bold">
                {detailedTemplate.created_by}
              </span>
            </div>

            <span className="text-[10px]">{fdate}</span>
          </div>
        </div>
        {/* remove */}
      </header>
      <div className="md:max-w-dash-lg max-w-dash">
        <div className="custom_grid text-10 mt-2 md:mt-3">
          <span className="ml-2">Name</span>
          <span>Weight</span>
          <span>Questions</span>
        </div>
        {categories.map((item) => (
          <SecondaryListItem
            key={item.id}
            title={item.name}
            id={item.id}
            weight={item.weight}
            questions={item.questions}
            // NEW: Pass expanded state based on the parent's expandedCategoryId.
            expanded={expandedCategoryId === item.id}
            // NEW: Pass callback to toggle expansion. If item is already expanded, collapse it;
            // otherwise, set it as expanded.
            onToggle={() =>
              setExpandedCategoryId(
                expandedCategoryId === item.id ? null : item.id
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
