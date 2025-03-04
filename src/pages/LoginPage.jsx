import React, { useState, useEffect, useRef } from "react";
import Logo from "../components/childrens/Logo";
import Title from "../components/childrens/Title";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/authslice";
import UserService from "../services/userServices"; // Import UserService
import { ImSpinner8 } from "react-icons/im";

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
      console.log(data);
      navigate("/dashboard/templates");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message); // Show error message from service
    } finally {
      setIsLoading(false);
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
        <TextField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          className="w-80 mb-4"
          onChange={handleChange}
          size="small"
          InputProps={{
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
          }}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <a href="#" className="self-end text-gray-500 mr-1">
          Forget Password?
        </a>

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
    </div>
  );
}

export default LoginPage;
