import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import Toast from "../components/childrens/FloatingMessage";

const PasswordRestLandingPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [toast, showToast] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleToggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    const { newPassword, confirmNewPassword } = passwords;

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, and one digit."
      );
      return;
    }

    try {
      const response = await apiClient.post(
        `/users/password-reset-confirm/${token}/`,
        {
          new_password: newPassword,
        }
      );

      setSuccessMessage(response.data.message);
      showToast(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {successMessage && (
        <Typography color="success.main">{successMessage}</Typography>
      )}

      <TextField
        label="New Password"
        name="newPassword"
        type={showPassword.newPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        value={passwords.newPassword}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => handleToggleVisibility("newPassword")}
                edge="end"
              >
                {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm New Password"
        name="confirmNewPassword"
        type={showPassword.confirmNewPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        value={passwords.confirmNewPassword}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => handleToggleVisibility("confirmNewPassword")}
                edge="end"
              >
                {showPassword.confirmNewPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Reset Password
      </Button>

      {toast && <Toast message={successMessage} />}
    </Box>
  );
};

export default PasswordRestLandingPage;
