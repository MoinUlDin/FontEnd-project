import React from "react";
import InputField from "../components/childrens/InputField";
function RegisterPage() {
  const cardbackground = "bg-slate-200";
  return (
    <div className="w-full h-svh  bg-slate-300 flex flex-col justify-center items-center">
      <div
        className={`shadow-2xl shadow-slate-600 max-w-[640px] rounded-xl md:rounded-3xl p-2 md:p-6 max-h-[455px] flex flex-col items-center ${cardbackground}`}
      >
        <h1 className="text-lg md:text-3xl mb-4 md:mb-8">
          Employer Registration Form
        </h1>
        <div className="flex flex-col md:flex-row gap-4 ">
          <div>
            <InputField
              ctype="text"
              id="rFirstName"
              clable="First Name"
              css1={cardbackground}
            />
            <InputField
              ctype="text"
              id="rCompanyName"
              clable="Company Name"
              css="mt-6"
              css1={cardbackground}
            />
            <InputField
              ctype="password"
              id="rpassword"
              clable="Password"
              css="mt-6"
              css1={cardbackground}
            />
          </div>
          <div>
            <InputField
              ctype="text"
              id="rLastName"
              clable="Last Name"
              css1={cardbackground}
            />
            <InputField
              ctype="text"
              id="rEmail"
              clable="Email"
              css="mt-6"
              css1={cardbackground}
            />
            <InputField
              ctype="password"
              id="rpassword2"
              clable="Re-Enter Password"
              css="mt-6"
              css1={cardbackground}
            />
          </div>
        </div>
        <p className="text-[12px] my-2 md:mt-4">
          BY REGISTERING, YOU AGREE TO OUR{" "}
          <a className="text-blue-600 font-semibold mx-1" href="">
            PRIVACY POLICY
          </a>{" "}
          AND
          <a className="text-blue-600 font-semibold mx-1" href="">
            TERMS AND CONDITIONS
          </a>
        </p>

        <button className="uppercase hover:cursor-pointer py-2 md:py-3 bg-blue-600 text-white rounded-xl px-8 md:px-14 mt-2 md:mt-6">
          Submit
        </button>
        <a className="mt-2 md:mt-6 font-bold text-blue-600" href="/login">
          Back to login
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
