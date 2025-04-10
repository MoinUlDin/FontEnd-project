import React, { useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { FiEdit, FiEye, FiMail, FiTrash } from "react-icons/fi";
import WarningDialog from "../Forms/WarningDialog";
import { useDispatch } from "react-redux";
import TempService from "../../services/tempService";

function PrimaryListItem({
  id,
  title,
  createdat,
  createdby,
  onInvite,
  setShowToast,
  setApiResponse,
  setToastbarColor,
}) {
  const fDate = dayjs(createdat).format("D-MMM-YYYY");
  const [showWarning, setShowWarning] = useState(false);
  const dispatch = useDispatch();
  const handleInviteClick = (e) => {
    e.preventDefault();
    onInvite(id);
  };

  const handleDelete = () => {
    setShowWarning(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      const response = await TempService.deleteTemplate(id);
      TempService.fetchTemplates(dispatch);
      setApiResponse("Template Deleted Successfully");

      setShowToast(true);
    } catch (error) {
      console.log("errror occurs", error);
      setApiResponse(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Unknown error "
      );
      setShowToast(true);
      setToastbarColor("bg-red-600");
    }
  };

  return (
    <div
      key={id}
      className="md:max-w-dash-lg max-w-dash mt-templist md:mt-templist-md"
    >
      <div className="grid grid-cols-5 gap-4 items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:shadow-gray-400  hover:scale-x-101   hover:cursor-pointer transition-all duration-100">
        {/* Name and Actions */}
        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="text-purple-600 font-semibold text-dash-it hover:underline"
            >
              {title}
            </a>
          </div>
          <div className="flex gap-3 text-sm text-gray-500 mt-2 md:mt-3">
            <Link
              onClick={handleInviteClick}
              to=""
              className="hover:text-purple-600 text-dash-i flex gap-1 items-center"
            >
              <FiMail /> Invite
            </Link>
            <Link
              to={`/dashboard/template/${id}`}
              className="hover:text-purple-600 text-dash-i flex gap-1 items-center"
            >
              <FiEye />
              Preview
            </Link>
            <Link
              to={`/tempate/edit-template/${id}`}
              className="hover:text-purple-600 text-dash-i flex gap-1 items-center"
            >
              <FiEdit />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="hover:text-purple-600 ptr text-dash-i flex gap-1 items-center"
            >
              <FiTrash />
              Delete
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:block place-self-center text-dash-it">
          {fDate}
        </div>
        <div className=" place-self-center text-dash-it">{createdby}</div>
      </div>
      {showWarning && (
        <WarningDialog
          message="Are you Sure to delele? You can not revert this actions later. "
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowWarning(false);
          }}
        />
      )}
    </div>
  );
}

export default PrimaryListItem;
