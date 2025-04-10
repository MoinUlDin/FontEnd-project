import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import UserService from "../../services/userServices";
import { ImSpinner4, ImSpinner5, ImSpinner6, ImSpinner8 } from "react-icons/im";

const InviteUserForm = ({ setApiResponse, onClose, setShowToast = none }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    setLoading(true);
    UserService.inviteUser({ email: data.email })
      .then((res) => {
        setApiResponse({ errors: true, message: "User Invited Successfully" });
        reset();
        onClose();
        setShowToast ? setShowToast(true) : "";
        UserService.fetchUserList(dispatch);
      })
      .catch((error) => {
        let errorMessage = error?.message || "Error inviting user";
        setApiResponse({
          error: true,
          message: errorMessage,
        });
        setShowToast ? setShowToast(true) : "";
        console.error("Error inviting user:", setApiResponse);
      })
      .finally(() => {
        setLoading(false);
        reset();
        onClose();
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 drop-shadow-2xl shadow-black">
      {/* Overlay that closes the form on click */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      <div className="bg-white relative border-2 border-amber-600 rounded-3xl overflow-hidden">
        <div className="flex justify-between text-white font-bold bg-gray-800 py-4 px-2">
          <h2>User Invitation Form</h2>
          <FiX onClick={onClose} className="text-2xl ptr hover:text-red-800" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 md:min-w-90 min-h-48 mt-5"
        >
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                label="Enter Email"
                size="small"
                fullWidth
                error={!!error}
                helperText={error ? error.message : ""}
                {...field}
              />
            )}
          />
          <div className="flex justify-end mt-5">
            <Button type="submit" variant="contained">
              {loading ? (
                <span className="flex items-center gap-2">
                  <ImSpinner5 className="animate-spin" />
                  Inviting
                </span>
              ) : (
                "Invite"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserForm;
