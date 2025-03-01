import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputField from "../components/childrens/InputField";
import UserService from "../services/userServices"; // Service for API calls
import { ImSpinner8 } from "react-icons/im"; // Import spinner icon

function RegisterPage() {
  const navigate = useNavigate();
  const cardbackground = "bg-slate-200";
  const [isLoading, setIsLoading] = useState(false);
  // For API messages
  const [apiMessage, setApiMessage] = useState("");

  // Initialize useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    // Check password match
    if (data.rpassword !== data.rpassword2) {
      setError("rpassword2", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    setIsLoading(true);
    // Prepare the payload for your API endpoint
    const payload = {
      first_name: data.rFirstName,
      last_name: data.rLastName,
      company: data.rCompanyName,
      email: data.rEmail,
      password: data.rpassword,
    };

    try {
      // Call your registration API via your service
      const response = await UserService.registerUser(payload);
      // Assume API sends back { message: "Your registration ...", ... }
      setApiMessage(response.message || "Registration successful.");
      // Optionally, after a delay, navigate to login
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (err) {
      console.error("Registration error:", err);
      // If the API provides a message, display it.
      setApiMessage(err.message || "Registration failed. Please try again.   ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-svh bg-slate-300 flex flex-col justify-center items-center">
      <div
        className={`shadow-2xl shadow-slate-600 min-w-[640px] rounded-xl md:rounded-3xl p-2 md:p-6 min-h-[455px] flex flex-col items-center ${cardbackground}`}
      >
        <h1 className="text-lg md:text-3xl mb-4 md:mb-8">
          Employer Registration Form
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col md:flex-row gap-4 ">
            <div>
              <InputField
                ctype="text"
                id="rFirstName"
                clable="First Name"
                css1={cardbackground}
                {...register("rFirstName", {
                  required: "First Name is required",
                })}
              />
              {errors.rFirstName && (
                <p className="text-red-500 text-xs">
                  {errors.rFirstName.message}
                </p>
              )}
              <InputField
                ctype="text"
                id="rCompanyName"
                clable="Company Name"
                css="mt-6"
                css1={cardbackground}
                {...register("rCompanyName", {
                  required: "Company Name is required",
                })}
              />
              {errors.rCompanyName && (
                <p className="text-red-500 text-xs">
                  {errors.rCompanyName.message}
                </p>
              )}
              <InputField
                ctype="password"
                id="rpassword"
                clable="Password"
                css="mt-6"
                css1={cardbackground}
                {...register("rpassword", { required: "Password is required" })}
              />
              {errors.rpassword && (
                <p className="text-red-500 text-xs">
                  {errors.rpassword.message}
                </p>
              )}
            </div>
            <div>
              <InputField
                ctype="text"
                id="rLastName"
                clable="Last Name"
                css1={cardbackground}
                {...register("rLastName", {
                  required: "Last Name is required",
                })}
              />
              {errors.rLastName && (
                <p className="text-red-500 text-xs">
                  {errors.rLastName.message}
                </p>
              )}
              <InputField
                ctype="text"
                id="rEmail"
                clable="Email"
                css="mt-6"
                css1={cardbackground}
                {...register("rEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.rEmail && (
                <p className="text-red-500 text-xs">{errors.rEmail.message}</p>
              )}
              <InputField
                ctype="password"
                id="rpassword2"
                clable="Re-Enter Password"
                css="mt-6"
                css1={cardbackground}
                {...register("rpassword2", {
                  required: "Please re-enter your password",
                })}
              />
              {errors.rpassword2 && (
                <p className="text-red-500 text-xs">
                  {errors.rpassword2.message}
                </p>
              )}
            </div>
          </div>
          {errors.general && (
            <p className="text-red-500 my-2 md:mt-4">
              {errors.general.message}
            </p>
          )}
          {apiMessage && (
            <p className="text-red-500 max-w-[80%] text-[12px] my-2 md:mt-4 mx-auto text-center">
              {apiMessage}
            </p>
          )}
          <div className="flex flex-col items-center justify-center">
            <p className="text-[12px] my-2 md:mt-4">
              BY REGISTERING, YOU AGREE TO OUR{" "}
              <a className="text-blue-600 font-semibold mx-1" href="">
                PRIVACY POLICY
              </a>{" "}
              AND{" "}
              <a className="text-blue-600 font-semibold mx-1" href="">
                TERMS AND CONDITIONS
              </a>
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="uppercase hover:cursor-pointer py-2 md:py-3 bg-blue-600 text-white rounded-xl px-8 md:px-14 mt-2 md:mt-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <ImSpinner8 className="animate-spin" />
                  <span>Registering...</span>
                </span>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <a className="mt-2 md:mt-6 font-bold text-blue-600" href="/login">
          Back to login
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
