import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TempService from "../services/tempService";
import { useDispatch, useSelector } from "react-redux";
import SecondaryListItem from "../components/childrens/SecondaryListItem";
import dayjs from "dayjs";

export default function TemplateDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const detailedTemplate = useSelector(
    (state) => state.templates.detailedTemplate
  );
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="px-4">
      <header className="w-full px-4 pb-1 border-b">
        <div className="w-full flex justify-between mb-1">
          <h1 className="font-bold text-2xl">{detailedTemplate.name}</h1>
          <div className="flex gap-2">
            <span className="text-dash-it">CreatedBy: </span>
            <span className="text-dash-it">{detailedTemplate.created_by}</span>
          </div>
        </div>
        <div className="w-full flex justify-between">
          <p className="text-[10px]">{detailedTemplate.description}</p>
          <span>{fdate}</span>
        </div>
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
            //questions={item.questions.length}
          />
        ))}
      </div>
    </div>
  );
}
