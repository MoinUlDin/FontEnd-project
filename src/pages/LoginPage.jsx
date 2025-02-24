import React, { useState } from "react";
import Logo from "../components/childrens/Logo";
import Title from "../components/childrens/Title";
import InputField from "../components/childrens/InputField";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/authslice";
import UserService from "../services/userServices"; // Import UserService

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Fixed typo from "navegate"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

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

    try {
      // Call the loginUser service
      const data = await UserService.loginUser(formData);

      // Dispatch login to Redux
      dispatch(login(data));
      navigate("/dashboard/templates");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message); // Show error message from service
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

        <InputField
          id="email"
          clable="Email"
          css="w-80"
          ctype="email"
          onChange={handleChange}
        />

        <InputField
          id="password"
          clable="Password"
          css="w-80"
          ctype="password"
          onChange={handleChange}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <a href="#" className="self-end text-gray-500 mr-1">
          Forget Password?
        </a>

        <button
          type="submit"
          className="uppercase hover:cursor-pointer py-2 md:py-3 bg-blue-600 text-white rounded-xl px-8 md:px-18 mt-2 md:mt-6 hover:-translate-y-1.5 transition-all duration-500"
        >
          Login
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
