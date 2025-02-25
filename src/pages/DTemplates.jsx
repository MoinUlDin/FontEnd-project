import React, { useState, useEffect } from "react";
import PrimaryListItem from "../components/childrens/PrimaryListItem";
import PrimaryListHeader from "../components/childrens/PrimaryListHeader";
import { useDispatch, useSelector } from "react-redux";
import TemplatesService from "../services/templatesService";

function DTemplates() {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.templates.list);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    TemplatesService.fetchTemplates(dispatch)
      .catch((e) => console.log("Custom ", e))
      .finally(() => setLoading(false));
  }, [dispatch]);

  console.log(templates);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Template</h1>
      <div className="max-w-dash-lg mt-8 ">
        <PrimaryListHeader title="name"></PrimaryListHeader>
        {templates.map((item) => (
          <PrimaryListItem
            id={item.id}
            title={item.name}
            createdat={item.created_at}
            createdby={item.created_by}
          />
        ))}
      </div>
    </div>
  );
}

export default DTemplates;
