import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import apiClient from "../services/apiClient";
import { login } from "../features/authslice";

export default function ConfirmEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Confirming your email...");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Send a GET request to the confirmation endpoint
        const response = await apiClient.get(`users/confirm-email/${token}/`);
        const data = response.data;
        // Dispatch login action to update Redux store.
        // Ensure keys match what your auth slice expects.
        dispatch(
          login({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            user_name: data.username, // Map API "username" to "user_name"
            email: data.email,
            company: data.company || null,
            role: data.role,
          })
        );
        // Save user data in localStorage using keys similar to your auth slice
        const userData = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: {
            userName: data.username,
            email: data.email,
            company: data.company || null,
            role: data.role,
          },
        };
        localStorage.setItem("userData", JSON.stringify(userData));

        setStatus("Email confirmed successfully! Logging you in...");
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard/templates");
        }, 2000);
      } catch (error) {
        console.error("Email confirmation error:", error);
        setStatus("Failed to confirm email. Please try again.");
      }
    };

    if (token) {
      confirmEmail();
    }
  }, [token, navigate, dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  );
}
