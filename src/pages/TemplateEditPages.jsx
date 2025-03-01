import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TemplatesService from "../services/templatesService";
import ExistingCategories from "../components/TemplateEditorComponents/ExistingCategories";
import CurrentCategories from "../components/TemplateEditorComponents/CurrentCategories";

function TemplateEditPages() {
  const { id } = useParams(); // Get template ID from URL
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const detailedTemplate = useSelector(
    (state) => state.templates.detailedTemplate
  );

  useEffect(() => {
    if (!detailedTemplate.name) {
      setLoading(true);
      console.log("we are sending request");
      TemplatesService.fetchTemplatedetail(id, dispatch)
        .catch((e) => {
          setError(e);
          console.log(e);
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, id]);

  return (
    <div className="grid grid-cols-12">
      <div className=" col-span-12 px-8 py-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold ">
          {detailedTemplate.name ? detailedTemplate.name : "No Template found"}
        </h1>
        <button className="bg-sunglow hover:cursor-pointer rounded-lg p-2">
          Save Changes
        </button>
      </div>

      <div className="col-span-6 min-h-lvh bg-emerald-500">
        <CurrentCategories />
      </div>
      <div className="col-span-6 min-h-lvh bg-amber-700">
        <span className="text-2xl">
          <ExistingCategories />
        </span>
      </div>
    </div>
  );
}

export default TemplateEditPages;
