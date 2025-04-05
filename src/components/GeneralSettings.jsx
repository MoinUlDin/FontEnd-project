// src/components/GeneralSettings.jsx
import {
  fetchSettingsStart,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  updateSettingsSuccess,
} from "../features/settingsSlice";
import {
  TextField,
  Autocomplete,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import apiClient from "../services/apiClient";
import Toast from "./childrens/FloatingMessage";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ImSpinner10 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";

// Helper function: parse a duration string "HH:MM:SS" into seconds.
const parseDurationString = (durationStr) => {
  if (typeof durationStr !== "string") return 0;
  const parts = durationStr.split(":");
  if (parts.length !== 3) return 0;
  const [hours, minutes, seconds] = parts;
  return (
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10)
  );
};

const GeneralSettings = () => {
  const dispatch = useDispatch();
  // Get the settings object from Redux store.
  const settingsStore = useSelector((state) => state.settings.settings);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      default_difficulty_level: "Easy",
      rejection_threshold: 35,
      safe_blur_time: "00:00:10", // string format
      test_creation_time_delay: "00:30:00", // string format
      test_negative_factor: "0.25",
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const difficultyOptions = ["Easy", "Medium", "Hard", "Include"];

  // Fetch settings on mount and store them in Redux.
  useEffect(() => {
    setLoading(true);
    dispatch(fetchSettingsStart());
    apiClient
      .get("/company/settings/")
      .then((response) => {
        const data = response.data;
        // Dispatch the fetched settings to Redux.
        dispatch(fetchSettingsSuccess(data));
        reset({
          default_difficulty_level: data.default_difficulty_level || "Easy",
          rejection_threshold: data.rejection_threshold || 33,
          safe_blur_time: data.safe_blur_time || "00:00:10",
          test_creation_time_delay: data.test_creation_time_delay || "00:30:00",
          test_negative_factor: data.test_negative_factor || "0.25",
        });
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || err.message;
        dispatch(fetchSettingsFailure(errMsg));
        setFetchError(errMsg);
      })
      .finally(() => setLoading(false));
  }, [dispatch, reset]);

  const onSubmit = (data) => {
    // Get the settings id from Redux store.
    const id = settingsStore?.id;
    if (!id) {
      setSaveError("Settings not found.");
      return;
    }
    setSaving(true);
    setSaveError("");
    setMessage("");
    // Send PATCH request to the detail endpoint using the id.
    apiClient
      .patch(`/company/settings/${id}/`, data)
      .then((response) => {
        dispatch(updateSettingsSuccess(response.data));
        setMessage("Settings updated successfully.");
        setToastMessage("Settings updated successfully.");
        setShowToast(true);
      })
      .catch((err) => {
        setToastMessage(
          err.response?.data?.message || "Error updating settings."
        );
        setSaveError(err.response?.data?.message || "Error updating settings.");
        setShowToast(true);
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <ImSpinner10 className="animate-spin mr-2" />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 space-y-4">
      {fetchError && <p className="text-red-500">{fetchError}</p>}
      {saveError && <p className="text-red-500">{saveError}</p>}
      {message && <p className="text-green-500">{message}</p>}

      {/* Default Difficulty Level */}
      <h2 className="text-2xl font-bold mb-8 text-blue-950">
        General Settings
      </h2>
      <div className="flex items-center">
        <Tooltip placement="top" title="Default difficulty level for tests.">
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Controller
          name="default_difficulty_level"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              onChange={(event, newValue) => field.onChange(newValue)}
              options={difficultyOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Default Difficulty Level"
                  variant="outlined"
                  fullWidth
                />
              )}
              className="w-full"
              value={field.value || ""}
            />
          )}
        />
      </div>

      {/* Rejection Threshold */}
      <div className="flex items-center">
        <Tooltip
          placement="top"
          title="If final marks are below this threshold, the candidate is marked as rejected."
        >
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Controller
          name="rejection_threshold"
          control={control}
          rules={{ required: true, min: 30, max: 65 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Rejection Threshold"
              type="number"
              variant="outlined"
              fullWidth
              className="ml-2"
              error={!!errors.rejection_threshold}
              helperText={
                errors.rejection_threshold && "Value must be between 30 and 65"
              }
            />
          )}
        />
      </div>

      {/* Safe Blur Time */}
      <div className="flex items-center">
        <Tooltip
          placement="top"
          title="Time allowed for safe blur (in seconds). If exceeded, the test will be submitted. (Min: 10, Max: 90)"
        >
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Controller
          name="safe_blur_time"
          control={control}
          rules={{
            required: true,
            pattern: {
              value: /^\d{2}:\d{2}:\d{2}$/,
              message: "Must be in HH:MM:SS format",
            },
            validate: (value) => {
              const seconds = parseDurationString(value);
              if (seconds < 10 || seconds > 90) {
                return "Value must be between 10 and 90 seconds";
              }
              return true;
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Safe Blur Time (HH:MM:SS)"
              variant="outlined"
              fullWidth
              className="ml-2"
              error={!!errors.safe_blur_time}
              helperText={errors.safe_blur_time?.message}
            />
          )}
        />
      </div>

      {/* Test Creation Time Delay */}
      <div className="flex items-center">
        <Tooltip
          placement="top"
          title="Delay time before a candidate can be invited again for the same test. (Min: 600 seconds, Max: 259200 seconds)"
        >
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Controller
          name="test_creation_time_delay"
          control={control}
          rules={{
            required: true,
            pattern: {
              value: /^\d{2}:\d{2}:\d{2}$/,
              message: "Must be in HH:MM:SS format",
            },
            validate: (value) => {
              const seconds = parseDurationString(value);
              if (seconds < 600 || seconds > 259200) {
                return "Value must be between 600 and 259200 seconds";
              }
              return true;
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Test Creation Time Delay (HH:MM:SS)"
              variant="outlined"
              fullWidth
              className="ml-2"
              error={!!errors.test_creation_time_delay}
              helperText={errors.test_creation_time_delay?.message}
            />
          )}
        />
      </div>

      {/* Test Negative Factor */}
      <div className="flex items-center">
        <Tooltip
          placement="top"
          title="Negative marking factor (e.g., 0.25 means 25% deduction for a wrong answer)."
        >
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Controller
          name="test_negative_factor"
          control={control}
          rules={{ required: true, min: 0, max: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Test Negative Factor"
              type="number"
              variant="outlined"
              fullWidth
              className="ml-2"
              inputProps={{ step: "0.01" }}
              error={!!errors.test_negative_factor}
              helperText={
                errors.test_negative_factor && "Value must be between 0 and 1"
              }
            />
          )}
        />
      </div>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </form>
  );
};

export default GeneralSettings;
