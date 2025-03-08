import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import userServices from "../services/userServices";
import FilterBy from "../components/childrens/FilterBy";
import dayjs from "dayjs";
import { CiMail } from "react-icons/ci";
import { FiTrash } from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";
import DeleteUserForm from "../components/Forms/DeleteUserForm";
import InviteUserForm from "../components/Forms/InviteUserForm";
import Toast from "../components/childrens/FloatingMessage";
import profile_img from "../assets/profile_img.png";
function DUsers() {
  const dispatch = useDispatch();
  const [inviteVisible, setInviteVisible] = useState(false);
  const [deleteVisible, setdeleteVisible] = useState(false);
  const [apiResponse, setApiResponse] = useState({ error: false, message: "" });
  const [apiResponsei, setApiResponsei] = useState({
    error: false,
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const userList = useSelector((state) =>
    state.auth.list ? state.auth.list : []
  );
  const [emailList, setEmailList] = useState([]);

  const [selectedEmail, setSelectedEmail] = useState("");

  useEffect(() => {
    if (userList.length === 0) {
      userServices.fetchUserList(dispatch);
    } else {
      setEmailList(userList.map((item) => item.email));
    }
  }, [dispatch, userList]);

  useEffect(() => {
    if (apiResponse.error) {
      setShowToast(true);
    }
  }, [apiResponse]);

  const filteredUsers = selectedEmail
    ? userList.filter((user) => user.email === selectedEmail)
    : userList;

  const onSelect = (option) => {
    setSelectedEmail(option);
  };
  const onClose = () => {
    setInviteVisible(false);
    setdeleteVisible(false);
  };
  return (
    <div>
      {/*Main Header */}
      <div className="Header flex justify-between px-4 mb-4">
        <FilterBy list={emailList} onSelect={onSelect} />
        <div className="flex gap-3">
          <Tooltip
            onClick={() => setInviteVisible(true)}
            title="Invite"
            placement="top"
          >
            <button className="btn text-lg hover:text-blue-600 flex items-center  gap-2 py-1 px-4 border-b-2 border-gray-100 hover:border-b-blue-600">
              <CiMail />
            </button>
          </Tooltip>
          <Tooltip
            onClick={() => setdeleteVisible(true)}
            title="Delete"
            placement="top"
          >
            <button className="btn text-lg  hover:text-red-600 flex items-center  gap-2 py-1 px-4 border-b-2 border-gray-100 hover:border-b-red-600">
              <FiTrash />
            </button>
          </Tooltip>
        </div>
      </div>
      {/* body */}
      <div className="bg-white h-svh  overflow-scroll">
        {/* body header */}
        <div className="grid grid-cols-10 sticky top-0 shadow-lg shadow-slate-500 font-semibold text-slate-800  bg-gray-300 py-2 md:py-3 px-1 md:px-2 mb-2 md:mb-3  text-sm uppercase">
          <p className="col-span-3">User</p>
          <p className="col-span-2">Company</p>
          <p className="col-span-2">Role</p>
          <p className="col-span-1">Active</p>
          <p className="col-span-2">Joined At</p>
        </div>
        {/* contant */}
        <div className="grid grid-cols-10 gap-5 font-semibold text-slate-800 alter_bg y-2 md:py-3 px-1 md:px-2 mb-2 md:mb-3 text-12">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user.id || index}
                className="grid grid-cols-10 col-span-10 py-3 px-2"
              >
                <div className="col-span-3 flex gap-3">
                  <img
                    src={profile_img}
                    className="rounded-full max-h-8"
                    alt="profile"
                  />
                  <div>
                    <p className="text-12 font-bold text-purple-700 capitalize">
                      {user.username}
                    </p>
                    <p className="text-10">{user.email}</p>
                  </div>
                </div>

                <p className="col-span-2">{user.company}</p>
                <p className="col-span-2">{user.role}</p>
                <p className="col-span-1">{user.is_active ? "Yes" : "No"}</p>
                <p className="col-span-2">
                  {dayjs(user.joined_at).format("D-MMM-YY")}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-12">
              {" "}
              <h1 className="text-2xl font-bold">You didn't add any users</h1>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div>
          <Toast message={apiResponse.message} onClose={setShowToast} />
        </div>
      )}
      {/* User Invitation Form */}
      {deleteVisible && (
        <DeleteUserForm
          emailList={emailList}
          userList={userList}
          onClose={onClose}
          setApiResponse={setApiResponse}
        />
      )}
      {/* User Invitation Form */}
      {inviteVisible && (
        <InviteUserForm onClose={onClose} setApiResponse={setApiResponse} />
      )}
    </div>
  );
}

export default DUsers;
