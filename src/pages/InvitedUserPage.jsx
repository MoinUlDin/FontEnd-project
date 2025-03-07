import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../services/userServices";
import { ImSpinner8 } from "react-icons/im";
import { TextField, IconButton, InputAdornment, Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Toast from "../components/childrens/FloatingMessage";

function InvitedUserPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [prefilledData, setPrefilledData] = useState({
    email: "",
    companyName: "",
    companyId: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Use consistent lower-case keys for all fields
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      companyName: "",
      firstName: "",
      lastName: "",
      password: "",
      password2: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!token) {
      setApiMessage("No token provided.");
      setToast(true);
      return;
    }
    console.log("sending get request");
    setIsLoading(true);
    UserService.verifyInvitation(token)
      .then((res) => {
        if (res.message) {
          setApiMessage(res.message);
          setToast(true);
        } else {
          // if no message, set prefilled data
          const { email, companyName, companyId } = res;
          setPrefilledData({ email, companyName, companyId });
          setValue("email", email);
          setValue("companyName", companyName);
        }
      })
      .catch((err) => {
        setApiMessage(err.message || "Error verifying invitation.");
        setToast(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, setValue]);

  const onSubmit = async (data) => {
    if (data.password !== data.password2) {
      setError("password2", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    setIsLoading(true);
    const payload = {
      token,
      first_name: data.firstName,
      last_name: data.lastName,
      password: data.password,
      email: prefilledData.email,
      companyName: prefilledData.companyName,
      companyId: prefilledData.companyId,
    };
    try {
      const response = await UserService.completeRegistration(payload);
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
      setToast(true);
      setApiMessage(response.message || "Registration successful.");
      setTimeout(() => {
        navigate("/dashboard/templates");
      }, 2000);
    } catch (err) {
      setApiMessage(err.message || "Registration failed. Please try again.");
      setToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:fixed md:inset-0 bg-slate-300 flex flex-col justify-center items-center">
      <div
        className={`shadow-2xl overflow-hidden bg-white shadow-slate-600 max-w-[700px] rounded-xl md:rounded-3xl p-2 md:p-6 flex flex-col justify-center items-center`}
      >
        {toast && (
          <Toast
            message={apiMessage}
            duration={8}
            onClose={() => setToast(false)}
          />
        )}
        <h1
          onClick={() => setToast(true)}
          className="text-lg md:text-3xl mb-4 md:mb-8"
        >
          Employer Registration Form
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col md:flex-row gap-4 ">
            <div>
              <TextField
                id="firstName"
                label="First Name"
                variant="outlined"
                margin="normal"
                size="small"
                className="w-80"
                {...register("firstName", {
                  required: "First Name is required",
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
              <TextField
                id="companyName"
                label="Company Name"
                variant="outlined"
                margin="normal"
                size="small"
                className="w-80"
                {...register("companyName", {
                  required: "Company Name is required",
                })}
                slotProps={{
                  input: { readOnly: true },
                  inputLabel: { shrink: true },
                }}
                fullWidth
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs">
                  {errors.companyName.message}
                </p>
              )}
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                margin="normal"
                size="small"
                type={showPassword ? "text" : "password"}
                className="w-80"
                {...register("password", { required: "Password is required" })}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ m: 0, p: 0 }}>
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ p: 0.5 }}
                        >
                          {showPassword ? (
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
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <TextField
                id="lastName"
                label="Last Name"
                variant="outlined"
                margin="normal"
                size="small"
                className="w-80"
                {...register("lastName", {
                  required: "Last Name is required",
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                margin="normal"
                size="small"
                className="w-80"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
              <TextField
                id="password2"
                label="Re-Enter Password"
                variant="outlined"
                margin="normal"
                size="small"
                type={showPassword2 ? "text" : "password"}
                className="w-80"
                {...register("password2", {
                  required: "Please re-enter your password",
                })}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ m: 0, p: 0 }}>
                        <IconButton
                          onClick={() => setShowPassword2(!showPassword2)}
                          edge="end"
                          sx={{ p: 0.5 }}
                        >
                          {showPassword2 ? (
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
              {errors.password2 && (
                <p className="text-red-500 text-xs">
                  {errors.password2.message}
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
              className="uppercase hover:cursor-pointer py-2 bg-blue-600 text-white rounded-xl px-8 md:px-12 mt-2 md:mt-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <ImSpinner8 className="animate-spin" />
                  <span>Creating..</span>
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

export default InvitedUserPage;
