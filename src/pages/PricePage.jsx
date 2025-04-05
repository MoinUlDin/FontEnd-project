import React, { useState } from "react";
import Navebar from "../components/Navebar";
import Footer from "../components/Footer";
import { FiCheck } from "react-icons/fi";
import { Button, TextField } from "@mui/material";
import apiClient from "../services/apiClient";

function PricePage() {
  const [redeemCode, setRedeemCode] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    if (!redeemCode.trim()) {
      setMessage({ type: "error", text: "Please enter a redeem code." });
      return;
    }

    try {
      console.log("Submitting:", redeemCode);
      const response = await apiClient.post("/payments/redeeme/", {
        code: redeemCode,
      });
      setMessage({
        type: "success",
        text: response.data.message || "Code redeemed successfully!",
      });
      setRedeemCode(""); // Clear the input field
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to redeem code.",
      });
    }
  };
  return (
    <div>
      <Navebar />
      {/* main container */}
      <div>
        <h1 className="text-4xl mb-10 font-extrabold mt-12 text-blue-900 text-center">
          Explore our{" "}
          <span className="relative mx-3">
            Flexible
            <div className="absolute -z-10 -left-2 -skew-x-25 -top-1 w-39 h-12  bg-amber-400 "></div>
          </span>
          Pricing
        </h1>
        <div className="grid grid-cols-6 w-full px-3 md:px-7 py-2 md:py-8 place-content-center  bg-amber-00">
          {/* First Card */}
          <div className="col-span-2 flex flex-col m-auto gap-6 px-6 md:px-12 lg:px-20  p-3 md:p-6 ">
            <h2 className="mb-2 text-2xl font-bold">Standard</h2>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />{" "}
              <span className="text-gray-800">First Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />{" "}
              <span className="text-gray-800">Second Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />
              <span className="text-gray-800">Third Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />
              <span className="text-gray-800">Fourth Offer Offer</span>
            </p>
            <div className="flex col-span-2 ">
              <button className="bg-blue-900 text-lg m-auto text-white font-bold p-1 rounded-xl px-9 ptr hover:bg-blue-950 mt-7">
                Order Now
              </button>
            </div>
          </div>
          {/* Second Card */}
          <div className="col-span-2 flex flex-col m-auto gap-6 px-6 md:px-12 lg:px-20  p-3 md:p-6 shadow-2xl  shadow-gray-700">
            <h2 className="mb-2 text-2xl font-bold">Primium</h2>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />{" "}
              <span className="text-gray-800">First Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />{" "}
              <span className="text-gray-800">Second Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />
              <span className="text-gray-800">Third Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />
              <span className="text-gray-800">Fourth Offer Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />
              <span className="text-gray-800">5th Super Offer</span>
            </p>
            <div className="flex col-span-2 ">
              <button className="bg-blue-900 text-lg m-auto text-white font-bold p-1 rounded-xl px-9 ptr hover:bg-blue-950 mt-7">
                Order Now
              </button>
            </div>
          </div>
          {/* 3rd Card */}
          <div className="col-span-2 flex flex-col m-auto gap-6 px-6 md:px-12 lg:px-20  p-3 md:p-6">
            <h2 className="mb-2 text-2xl font-bold">Platinum</h2>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />{" "}
              <span className="text-gray-800">First Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />{" "}
              <span className="text-gray-800">Second Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />
              <span className="text-gray-800">Third Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />
              <span className="text-gray-800">Fourth Offer Offer</span>
            </p>
            <p className="flex items-center gap-4">
              <FiCheck className="text-blue-700 font-extrabold mr-3" />
              <span className="text-gray-800">Alternate Offer</span>
            </p>
            <div className="flex col-span-2 ">
              <button className="bg-blue-900 text-lg m-auto text-white font-bold p-1 rounded-xl px-9 ptr hover:bg-blue-950 mt-7">
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 justify-center w-full items-center mt-10">
        <h4>Have a Redeem Code?</h4>
        <div className="flex gap-3">
          <TextField
            label="Your Redeem Code"
            size="small"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
          />
          <Button onClick={handleSubmit} variant="contained" size="small">
            Submit
          </Button>
        </div>
        {message && (
          <p
            className={`mt-2 text-sm ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default PricePage;
