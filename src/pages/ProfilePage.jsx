// src/components/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { FiEdit3 } from "react-icons/fi";
import apiClient from "../services/apiClient";
import Toast from "../components/childrens/FloatingMessage";
import { ImSpinner8 } from "react-icons/im";
import { FiX } from "react-icons/fi";
import { Co2Sharp, Visibility, VisibilityOff } from "@mui/icons-material";

const ProfilePage = () => {
  // Initialize profile with default empty values.
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    username: "",
    email: "",
    companyName: "",
    ownerName: "",
  });

  // Personal section edit state.
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword1, setShowNewPassword1] = useState(false);
  const [showNewPassword2, setShowNewPassword2] = useState(false);

  // Account section: password change form toggle.
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // State for reset email dialog.
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // On mount, fetch profile from API and update localStorage with key "UserProfile"
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/users/profile/update/");
        const data = response.data;
        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          phoneNumber: data.phone_number || "",
          username: data.username || "",
          email: data.email || "",
          companyName: data.company || "",
          ownerName: data.company_owner || "",
        });
        // Save profile data to localStorage with key "UserProfile"
        localStorage.setItem("UserProfile", JSON.stringify(data));
        // Set the reset email field to the current email
        setResetEmail(data.email || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle personal info field changes.
  const handlePersonalChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save personal info via API call.
  const savePersonalInfo = async () => {
    setSaveError("");
    setSaveMessage("");
    const payload = {
      username: profile.username,
      first_name: profile.firstName,
      last_name: profile.lastName,
      phone_number: profile.phoneNumber,
      default_username: false,
    };

    try {
      const response = await apiClient.put("/users/profile/update/", payload);
      setSaveMessage("Profile updated successfully.");
      setToastMessage("Profile updated successfully.");
      console.log("shoing Toast now");
      setShowToast(true);
      console.log("showTaostValue: ", showToast);
      // Update localStorage with new values in "userData" if needed.
      const storedData = localStorage.getItem("userData");
      let userData = storedData ? JSON.parse(storedData) : {};
      userData.firstName = profile.firstName;
      userData.lastName = profile.lastName;
      userData.phoneNumber = profile.phoneNumber;
      userData.userName = profile.username;
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsEditingPersonal(false);
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);

      setSaveError(
        error.response?.data?.message ||
          "Error updating profile. Please try again."
      );
    }
  };

  // Handlers for password form.
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return;
    }
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      setToastMessage("Error: All Fields are required.");
      setShowToast(true);
      return;
    }
    if (passwordData.oldPassword === passwordData.newPassword) {
      setToastMessage(
        "Error: New password must be differnt from you old password. "
      );
      setShowToast(true);
      return;
    }
    setLoading(true);
    const payload = {
      old_password: passwordData.oldPassword,
      new_password: passwordData.newPassword,
    };
    apiClient
      .patch("/users/change_password/", payload)
      .then((res) => {
        setToastMessage(res.data.message || "Password changed successfully.");
      })
      .catch((error) => {
        setToastMessage(
          error.response.data.errors?.message ||
            "Password changed successfully."
        );
      })
      .finally(() => {
        setShowToast(true);
        passwordData.oldPassword = "";
        passwordData.newPassword = "";
        passwordData.confirmNewPassword = "";
        setShowOldPassword(false);
        setShowNewPassword1(false);
        setShowNewPassword2(false);
        setLoading(false);
        setShowPasswordForm(false);
      });
  };

  // Handler for reset email confirmation.
  const handleResetEmail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post("/users/password-reset-request/", {
        email: resetEmail,
      });
      setToastMessage(response.data.message);
      setShowToast(true);
      setOpenResetDialog(false);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message ||
          "Error sending reset email. Please try again."
      );
      setShowToast(true);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 600, p: 2 }}>
      <Typography variant="h3" gutterBottom>
        Profile
      </Typography>

      {/* Personal Information Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Personal Information
          <Tooltip title="Edit Personal Info" placement="right">
            <IconButton size="small" onClick={() => setIsEditingPersonal(true)}>
              <FiEdit3 />
            </IconButton>
          </Tooltip>
        </Typography>
        <TextField
          label="First Name"
          name="firstName"
          value={profile.firstName}
          onChange={handlePersonalChange}
          fullWidth
          margin="normal"
          size="small"
          disabled={!isEditingPersonal}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={profile.lastName}
          onChange={handlePersonalChange}
          fullWidth
          margin="normal"
          size="small"
          disabled={!isEditingPersonal}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={profile.phoneNumber}
          onChange={handlePersonalChange}
          fullWidth
          margin="normal"
          size="small"
          disabled={!isEditingPersonal}
        />
        <TextField
          label="Username"
          name="username"
          value={profile.username}
          onChange={handlePersonalChange}
          fullWidth
          margin="normal"
          size="small"
          disabled={!isEditingPersonal}
        />
        {isEditingPersonal && (
          <Box sx={{ mt: 1 }}>
            <Button variant="contained" onClick={savePersonalInfo}>
              Save Personal Info
            </Button>
            <Button
              variant="text"
              onClick={() => setIsEditingPersonal(false)}
              sx={{ ml: 1 }}
            >
              Cancel
            </Button>
          </Box>
        )}
        {saveError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {saveError}
          </Typography>
        )}
        {saveMessage && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            {saveMessage}
          </Typography>
        )}
      </Box>

      {/* Account Information Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Account Information
        </Typography>
        <TextField
          label="Email"
          value={profile.email}
          fullWidth
          margin="normal"
          size="small"
          disabled
        />
        {!showPasswordForm && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={() => setOpenResetDialog(true)}
            >
              Reset Password
            </Button>
          </Box>
        )}
        {showPasswordForm && (
          <Box component="form" autoComplete="off">
            {/* Hidden dummy input to trick browser autofill */}
            <input type="password" style={{ display: "none" }} />
            <TextField
              id="oldPassword"
              label="Old Password"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ m: 0, p: 0 }}>
                      <IconButton
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        edge="end"
                        sx={{ p: 0.5 }}
                      >
                        {showOldPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              id="newPassword"
              label="New Password"
              name="newPassword"
              type={showNewPassword1 ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ m: 0, p: 0 }}>
                      <IconButton
                        onClick={() => setShowNewPassword1(!showNewPassword1)}
                        edge="end"
                        sx={{ p: 0.5 }}
                      >
                        {showNewPassword1 ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              id="confirmNewPassword"
              label="Confirm New Password"
              name="confirmNewPassword"
              type={showNewPassword2 ? "text" : "password"}
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ m: 0, p: 0 }}>
                      <IconButton
                        onClick={() => setShowNewPassword2(!showNewPassword2)}
                        edge="end"
                        sx={{ p: 0.5 }}
                      >
                        {showNewPassword2 ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ mt: 1 }}>
              <Button variant="contained" onClick={submitPasswordChange}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <ImSpinner8 className="animate-spin" />
                    <span>Saving</span>
                  </div>
                ) : (
                  "Change Password"
                )}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => setShowPasswordForm(false)}
                sx={{ ml: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Company Information Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Company Information
        </Typography>
        <TextField
          label="Company Name"
          value={profile.companyName}
          fullWidth
          margin="normal"
          size="small"
          disabled
        />
        <TextField
          label="Owner Name"
          value={profile.ownerName}
          fullWidth
          margin="normal"
          size="small"
          disabled
        />
      </Box>

      {/* Reset Email Confirmation Dialog */}
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>Confirm Your Email</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Please confirm that the email below is yours. Change if needed.
          </Typography>
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            size="small"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value.trim())}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>Cancel</Button>
          <Button onClick={handleResetEmail}>
            {loading ? (
              <div className="flex items-center gap-2">
                <ImSpinner8 className="animate-spin" />
                <span>Please wait.</span>
              </div>
            ) : (
              "Reset"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast message */}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </Box>
  );
};

export default ProfilePage;
