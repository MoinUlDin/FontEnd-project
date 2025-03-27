import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TempService from "../services/tempService";
import dayjs from "dayjs";

export default function NewTemplateEditPage() {
  const [activeTab, setActiveTab] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();
  const detailedTemplate = useSelector(
    (state) => state.templates.detailedTemplate
  );
  const [loading, setLoading] = useState(false);

  // Provide a default empty array for categories if it's not defined yet.
  const categories = detailedTemplate?.categories || [];
  // Format the date if available.
  const fdate = detailedTemplate?.created_at
    ? dayjs(detailedTemplate.created_at).format("D-MMM-YYYY")
    : "";

  useEffect(() => {
    setLoading(true);
    TempService.fetchTemplatedetail(id, dispatch)
      .catch((e) => console.log("Custom ", e))
      .finally(() => setLoading(false));
  }, [dispatch, id]);

  if (loading || !detailedTemplate) {
    return <div>Loading template details...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between bg-gray-100 p-4 rounded-lg">
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Template Edit
          </button>
          <button className="ml-2 bg-gray-300 px-4 py-2 rounded-lg">
            Breadcrumbs
          </button>
        </div>
        <div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Download Sample
          </button>
          <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Submit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 border-b">
        <button
          className={`px-6 py-2 ${
            activeTab === 1
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(1)}
        >
          Categories Overview
        </button>
        <button
          className={`ml-4 px-6 py-2 ${
            activeTab === 2
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(2)}
        >
          Edit Category
        </button>
        <button
          className={`ml-4 px-6 py-2 ${
            activeTab === 3
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(3)}
        >
          Bulk Import
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-4 border rounded-lg">
        {activeTab === 1 && (
          <div>
            <h2 className="text-lg font-semibold">Categories Overview</h2>
            <table className="w-full border mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Level</th>
                  <th className="border p-2">Weight</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">1</td>
                  <td className="border p-2">Medium</td>
                  <td className="border p-2">
                    <button className="text-blue-600">Edit</button> |{" "}
                    <button className="text-red-600">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <h2 className="text-lg font-semibold">Edit Category</h2>
            <form className="mt-4">
              <label className="block mb-2">Category Name:</label>
              <input type="text" className="border p-2 w-full" />

              <label className="block mt-2">Weight:</label>
              <input type="number" className="border p-2 w-full" />

              <div className="mt-4 flex space-x-4">
                <div className="w-1/2 border p-4">
                  Panel A: Select Questions
                </div>
                <div className="w-1/2 border p-4">
                  Panel B: Add Question Form
                </div>
              </div>
            </form>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <h2 className="text-lg font-semibold">Bulk Import</h2>
            <div className="mt-4">
              <input type="file" className="border p-2 w-full" />
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                Upload JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
