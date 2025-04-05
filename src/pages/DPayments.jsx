import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchList } from "../features/companySlice";
import apiClient from "../services/apiClient";
import CompanyListItem from "../components/childrens/CompanyListItem";
import Toast from "../components/childrens/FloatingMessage";

function DPayments() {
  const [redeemCode, setRedeemCode] = useState("");
  const [message, setMessage] = useState(null);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(""); // initially empty
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const companies = useSelector((state) => state.company.list);
  const [showToast, setShowToast] = useState(false);

  const fetchcompanylist = () => {
    setLoading(true);
    apiClient
      .get("company/")
      .then((res) => {
        dispatch(fetchList(res.data));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const closeToast = () => {
    setShowToast(false);
  };
  useEffect(() => {
    if (companies.length == 0) {
      fetchcompanylist();
    }
  }, [dispatch]);
  const handleChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setCredits("");
      return;
    }
    const numberValue = Number(value);

    if (numberValue < 1) {
      setCredits(1);
    } else {
      setCredits(numberValue);
    }
  };

  const active1 = "shadow-2xl shadow-gray-300 bg-blue-800 text-gray-100";
  const handleSubmit = async () => {
    if (!redeemCode.trim()) {
      setMessage({ type: "error", text: "Please enter a redeem code." });
      return;
    }

    try {
      const response = await apiClient.post("/payments/redeeme/", {
        code: redeemCode,
      });
      setMessage({
        type: "success",
        text: response.data.message || "Code redeemed successfully!",
      });
      fetchcompanylist();
      setRedeemCode("");
      setShowToast(true);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to redeem code.",
      });
    }
  };

  // Check if the user is admin or super-admin (case-insensitive)
  if (user && user.role.toLowerCase().includes("admin")) {
    return (
      <div className="">
        <h1 className="md:text-3xl text-gray-800 font-extrabold text-center mb-8 ">
          For Admin View Only
        </h1>

        {/*Main content */}
        <div className="">
          <ul className="grid grid-cols-9 px-4 text-gray-900 py-3 md:px-6 md:text-xl font-bold bg-gray-400">
            <li className="col-span-3">Company</li>
            <li className="col-span-3">Owner</li>
            <li className="col-span-1 place-self-center">Credites</li>
            <li className="col-span-2 place-self-center">Actions</li>
          </ul>
        </div>
        {/* List Items */}
        <div className="pt-4">
          {companies.map((item) => (
            <CompanyListItem
              key={item.id}
              name={item.name}
              id={item.id}
              owner={item.ownerName}
              email={item.ownerEmail}
              credits={item.credits}
              fn={fetchcompanylist}
              showToast={setShowToast}
            />
          ))}
          <div className="mt-24"></div>
        </div>

        {showToast && (
          <Toast message={"Action successfull"} onClose={closeToast} />
        )}
      </div>
    );
  }
  return (
    <div>
      {/* main container */}
      <div>
        <h1 className="text-4xl mb-10 font-extrabold md:mt-2 text-blue-900 text-center">
          Explore our{" "}
          <span className="relative mx-3">
            Flexible
            <div className="absolute -z-10 -left-2 -skew-x-25 -top-1 w-39 h-12  bg-amber-400 "></div>
          </span>
          Pricing
        </h1>
        <div className="flex items-center flex-col">
          <div className="max-w-[350px]:text-[8px] text-10 md:text-xl min-w-[225px]">
            <button
              onClick={() => setActive(true)}
              className={` relative font-bold rounded-tl-3xl ptr py-3 md:py-4 px-4 md:px-8 ${
                active ? active1 : "bg-blue-600 text-black"
              }`}
            >
              Pay Per Assessment
              {active && (
                <div className="absolute -bottom-3 h-[2px] w-full bg-blue-800 right-0"></div>
              )}
            </button>
            <button
              onClick={() => setActive(false)}
              className={`relative font-bold rounded-tr-3xl  ptr py-3 md:py-4 px-4 md:px-8 ${
                active ? "bg-blue-600 text-black" : active1
              }`}
            >
              Annual Plan
              {!active && (
                <div className="absolute -bottom-2 h-[2px] w-full bg-blue-800 right-0"></div>
              )}
            </button>
          </div>
          <div className="mt-6 md:min-w-[350px] min-w-[225] ">
            <TextField
              id="credits"
              label={active ? "Credits" : "Candidates / Year"}
              variant="outlined"
              margin="normal"
              size="medium"
              type="number"
              value={credits}
              fullWidth
              onChange={handleChange}
              slotProps={{ input: { min: 1 } }}
            />
          </div>
          <button className="my-8 ptr bg-amber-600 hover:font-bold hover:bg-amber-700 p-2 md:p-4 md:px-12 px-6 rounded-xl">
            Purchase
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 justify-center w-full items-center mt-10">
        <h4>Have a Redeem Code?</h4>
        {message && (
          <p
            className={`mt-2 text-sm ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
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
      </div>
      <div className="mt-20"></div>
    </div>
  );
}

export default DPayments;
