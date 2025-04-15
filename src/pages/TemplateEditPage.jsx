import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import TempService from "../services/tempService";
import ExistingCategories from "../components/TemplateEditorComponents/ExistingCategories";
import CurrentCategories from "../components/TemplateEditorComponents/CurrentCategories";
import { editTempInit } from "../features/templateSlice";
import { useNavigate } from "react-router-dom";
import { ImSpinner7 } from "react-icons/im";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Toast from "../components/childrens/FloatingMessage";

function TemplateEditPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const detailedTemplate = useSelector(
    (state) => state.templates.detailedTemplate
  );
  const editTemplate = useSelector((state) => state.templates.editTemplate);

  useEffect(() => {
    if (detailedTemplate.id === id) {
      return;
    } else {
      setLoading(true);
      console.log("Sending request for detailed template");
      TempService.fetchTemplatedetail(id, dispatch)
        .catch((e) => {
          setError(e);
          console.log(e);
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, id, detailedTemplate.name]);

  // Once detailedTemplate is loaded, deep copy it into editTemplate.
  useEffect(() => {
    if (detailedTemplate.name) {
      dispatch(editTempInit());
    }
  }, [detailedTemplate, dispatch]);

  // Handle saving the edited template.
  const handleSave = () => {
    setLoading(true);
    TempService.postTemplate(editTemplate, dispatch)
      .then((data) => {
        setError(
          data?.message + ". Redirecting" || "Template saved successfully"
        );
        setShowToast(true);
        setTimeout(() => {
          navigate("/dashboard/templates");
        }, 3000);
      })
      .catch((error) => {
        console.error("Save error:", error);
        setError(
          error.response?.data?.message ||
            error.response?.data?.errors?.toString()
        );
        setShowToast(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="grid grid-cols-12">
      {/* Header */}
      <div className="col-span-12 px-8 py-2 flex justify-between items-center">
        <h1 className=" text-[12px] xs:text-sm md:text-2xl font-bold">
          {detailedTemplate.name ? detailedTemplate.name : "No Template found"}
        </h1>
        <div className="flex gap-0 xs:gap-2 sm:gap-4 flex-col xs:flex-row items-center">
          <Link
            to="/dashboard/templates"
            className="text-[12px] xs:text-sm md:text-lg py-2 flex items-center gap-1"
          >
            <KeyboardReturnIcon fontSize="small" />
            Dashboard
          </Link>
          <button
            className={`bg-sunglow hover:cursor-pointer px-2 gap-2 items-center flex rounded-lg p-2`}
            onClick={handleSave}
          >
            {loading && <ImSpinner7 className="animate-spin" />}
            {loading ? "Saving" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Left Panel: Current Editable Template */}
      <div className="col-span-12 xs:col-span-7 min-h-lvh border-r-2 border-gray-600">
        <CurrentCategories />
      </div>
      {/* Right Panel: Existing Categories */}
      <div className="col-span-5 min-h-lvh">
        <span className="text-2xl">
          <ExistingCategories />
        </span>
      </div>
      {/* floating message box */}
      {showToast && <Toast message={error} onClose={setShowToast} />}
    </div>
  );
}

export default TemplateEditPage;
