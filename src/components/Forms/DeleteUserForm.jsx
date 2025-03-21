import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Autocomplete, TextField, Button } from "@mui/material";
import userServices from "../../services/userServices"; // Adjust the import as needed
import { FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";

const DeleteUserForm = ({ userList, emailList, onClose, setApiResponse }) => {
  const dispatch = useDispatch();
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
    let id = null;
    userList.map((item) => {
      if (item.email === data.email) {
        id = item.id;
      }
    });
    // Call your invite API endpoint
    userServices
      .deleteUser(id, dispatch)
      .then(() => {
        setApiResponse({ error: true, message: "User Deleted Successfully" });
        reset();
        onClose();
      })
      .catch((error) => {
        setApiResponse({ error: true, message: error });
        console.error("Error inviting user:", error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 drop-shadow-2xl shadow-black">
      {/* Overlay closes the form when clicked */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>
      <div className="bg-white relative border-2 border-amber-600 rounded-3xl overflow-hidden ">
        <div className="flex justify-between text-white font-bold bg-gray-800 py-4 px-2">
          <h2>User Deletion Form</h2>
          <FiX
            onClick={onClose}
            className="text-2xl ptr hover:text-red-800"
          ></FiX>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 min-w-90 min-h-48 mt-5"
        >
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                options={emailList}
                value={field.value}
                onChange={(event, newValue) => field.onChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Email"
                    size="small"
                    fullWidth
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" variant="contained">
              Delete
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteUserForm;
