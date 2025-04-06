import React, { useState, useEffect, useRef } from "react";
import Logo from "../components/childrens/Logo";
import Title from "../components/childrens/Title";
import {
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/authslice";
import UserService from "../services/userServices"; // Import UserService
import { ImSpinner8 } from "react-icons/im";
import Toast from "../components/childrens/FloatingMessage";
import apiClient from "../services/apiClient";
import { logoutAndClear } from "../features/authslice";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [reseting, setReseting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    localStorage.removeItem("userData");
  }, []);
  // Local state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill all fields.");
      return;
    }
    setIsLoading(true);
    try {
      // Call the loginUser service
      const data = await UserService.loginUser(formData);

      // Dispatch login to Redux
      dispatch(login(data));
      if (data?.role == "END_USER") {
        logoutAndClear();
        setToastMessage("End Users are not allowed to navigate to dashbaord");
        setShowToast(true);
        return;
      }
      navigate("/dashboard/templates");
    } catch (err) {
      console.log(err);
      setError(err.message); // Show error message from service
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetEmail = async () => {
    try {
      setReseting(true);
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
    } finally {
      setReseting(false);
      setOpenResetDialog(false);
    }
  };

  return (
    <div className="w-full h-lvh bg-slate-100 flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="shadow-2xl shadow-slate-600 max-w-[640px] border-2 rounded-xl md:rounded-3xl p-2 md:p-6 border-amber-700 min-h-[455px] flex flex-col items-center"
      >
        <Logo />
        <Title css="mt-2">Login</Title>
        {/* Email Input with added bottom margin */}
        <TextField
          id="email"
          label="Email"
          type="email"
          className="w-80"
          onChange={handleChange}
          size="small"
          margin="normal"
          inputRef={emailInputRef}
        />

        {/* Password Input with visibility toggle and added bottom margin */}
        <div className="mt-3">
          <TextField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            className="w-80 mb-4"
            onChange={handleChange}
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <p
          onClick={() => setOpenResetDialog(true)}
          className="self-end text-gray-500 ptr mr-1 mt-2"
        >
          Forget Password?
        </p>
        {error && <p className="text-red-500  mt-2">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="uppercase hover:cursor-pointer py-2 md:py-3 bg-blue-600 text-white rounded-xl px-8 md:px-18 mt-2 md:mt-6 hover:-translate-y-1.5 transition-all duration-500"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <ImSpinner8 className="animate-spin" />
              <span>Login</span>
            </span>
          ) : (
            "Login"
          )}
        </button>

        <p className="mt-4 md:mt-8 text-[14px] text-gray-600">
          Don't have an account? Click{" "}
          <a className="text-blue-500 hover:underline" href="/register">
            here
          </a>{" "}
          to signup
        </p>
      </form>

      {/* Reset Email Confirmation Dialog */}
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>Enter Your Email</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ width: 300 }}
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
          <Button variant="contained" onClick={handleResetEmail}>
            {reseting ? (
              <div className="flex items-center gap-2">
                <ImSpinner8 className="animate-spin" />
                <span>Pleas wait</span>
              </div>
            ) : (
              "Reset"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Window popup message */}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default LoginPage;
