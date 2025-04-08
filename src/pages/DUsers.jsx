// src/components/DUsers.jsx
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Tooltip, IconButton, Button } from "@mui/material";
import { FiTrash, FiUserX } from "react-icons/fi";
import dayjs from "dayjs";
import Toast from "../components/childrens/FloatingMessage";
import profile_img from "../assets/profile_img.png";
import { useSelector, useDispatch } from "react-redux";
import userServices from "../services/userServices";
import InviteUserForm from "../components/Forms/InviteUserForm";
import FilterBy from "../components/childrens/FilterBy";
import WarningDialog from "../components/Forms/WarningDialog";
import UserService from "../services/userServices";
import { Mail } from "@mui/icons-material";
import { deleteUser } from "../features/authslice";

const DUsers = () => {
  const dispatch = useDispatch();
  const [inviteVisible, setInviteVisible] = useState(false);
  const [apiResponse, setApiResponse] = useState({ error: false, message: "" });
  const [showToast, setShowToast] = useState(false);
  const userList = useSelector((state) => state.auth.list) || [];
  const [selectedEmail, setSelectedEmail] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);
  const [inactiveUser, setInactiveUser] = useState(null);
  const [confirmBtnText, setConfirmBtnText] = useState("Yes, Delete");

  // Build email list from userList for filtering
  const emailList = userList.map((item) => item.email);

  // Fetch user list if not available
  useEffect(() => {
    const fetchData = async () => {
      if (userList.length === 0) {
        try {
          const response = await userServices.fetchUserList(dispatch);
          console.log("response User", response);
        } catch (error) {
          console.log("Error Fetching User", error);
        }
      }
    };
    fetchData();
  }, [dispatch, userList.length]);

  // Filter user list based on selected email (if any)
  const filteredUsers = selectedEmail
    ? userList.filter((user) => user.email === selectedEmail)
    : userList;

  // Prepare rows for DataGrid; ensure each row has a unique id.
  const rows = filteredUsers.map((user, index) => ({
    id: user.id || index,
    username: user.username || user.userName, // ensure we get the correct field
    email: user.email,
    company: user.company,
    role: user.role,
    is_active: user.is_active, // assuming you have this field
    joined_at: user.joined_at,
  }));

  const handleInactiveUser = (user) => {
    setConfirmBtnText("Yes, Toggle");
    setInactiveUser(user);
    setWarningMessage(`Are you sure you want to disable ${user.email}?`);
    setShowWarning(true);
  };

  const handleDeleteAction = (user) => {
    setDeleteUser(user);
    setWarningMessage(`Are you sure you want to delete ${user.email}?`);
    setShowWarning(true);
  };

  const handleWarningConfirmed = () => {
    if (inactiveUser) {
      console.log("Inactive", inactiveUser.id);
      handleInactiveUserConfirmed();
    }
    if (deleteUser) {
      handleDeleteUser();
    }
  };
  const handleWarningCanceled = () => {
    setDeleteUser(null);
    setInactiveUser(null);
    setShowWarning(false);
  };
  const handleInactiveUserConfirmed = async () => {
    const payload = { id: inactiveUser.id };
    console.log("calling userService");
    userServices
      .toggleInactive(payload, dispatch)
      .then(() => {
        setApiResponse({ error: true, message: "Action Successfull" });
        setInactiveUser(null);
        setShowWarning(false);
        setShowToast(true);
      })
      .catch((error) => {
        setApiResponse({ error: true, message: error?.message });
        setShowToast(true);
      })
      .finally(() => {
        setInactiveUser(null);
        setShowWarning(false);
      });
  };
  // Delete handler for a specific user row.
  const handleDeleteUser = async () => {
    const id = deleteUser.id;
    userServices
      .deleteUser(id, dispatch)
      .then(() => {
        setApiResponse({ error: true, message: "User Deleted Successfully" });
        setDeleteUser(null);
        setShowWarning(false);
        setShowToast(true);
      })
      .catch((error) => {
        setApiResponse({ error: true, message: error.message });
        setShowToast(true);
      })
      .finally(() => {
        setDeleteUser(null);
        setShowWarning(false);
      });
  };

  // Define columns with left alignment and minimum widths.
  const columns = [
    {
      field: "user",
      headerName: "User",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => {
        const row = params.row;
        return (
          <div className="flex items-center gap-2">
            <img
              src={profile_img}
              alt="profile"
              className="rounded-full h-8 w-8"
            />
            <div>
              <div className="text-xs font-bold text-purple-700 capitalize">
                {row.username || "-"}
              </div>
              <div className="text-10">{row.email || "-"}</div>
            </div>
          </div>
        );
      },
    },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <span>{params.value || "-"}</span>,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <span>{params.value || "-"}</span>,
    },
    {
      field: "is_active",
      headerName: "Active",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "joined_at",
      headerName: "Joined At",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        params.value ? dayjs(params.value).format("D-MMM-YY") : "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <div className="flex gap-2 items-center">
            <Tooltip
              title="Toggle between Disable and Enable User"
              placement="top"
            >
              <IconButton
                size="small"
                onClick={() => handleInactiveUser(params.row)}
              >
                <FiUserX className="text-gray-600" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <IconButton
                size="small"
                onClick={() => handleDeleteAction(params.row)}
              >
                <FiTrash color="red" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      {/* Header with filter and invite button */}
      <div className="flex justify-between items-center mb-4">
        <FilterBy list={emailList} onSelect={setSelectedEmail} />
        <Button variant="contained" onClick={() => setInviteVisible(true)}>
          <div className="flex gap-2 items-center">
            <Mail fontSize="small" />
            <p>Invite User</p>
          </div>
        </Button>
      </div>

      {/* DataGrid */}
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          sx={{
            border: "none",
            ".MuiDataGrid-cell": {
              borderBottom: "1px solid #e0f0e0",
              whiteSpace: "normal",
              lineHeight: "1.4",
              textAlign: "left",
              paddingLeft: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "600",
              textAlign: "left",
            },
          }}
        />
      </div>

      {showToast && (
        <Toast
          message={apiResponse.message}
          onClose={() => setShowToast(false)}
        />
      )}
      {showWarning && (
        <WarningDialog
          onConfirm={handleWarningConfirmed}
          onCancel={handleWarningCanceled}
          confirmbtnText={confirmBtnText}
          message={warningMessage}
        />
      )}

      {inviteVisible && (
        <InviteUserForm
          onClose={() => setInviteVisible(false)}
          setShowToast={setShowToast}
          setApiResponse={setApiResponse}
        />
      )}
    </div>
  );
};

export default DUsers;
