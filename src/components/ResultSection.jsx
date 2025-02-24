import React from "react";
import Title from "./childrens/Title";
import Paragraph from "./childrens/Paragraph";
import Primarybtn from "./childrens/Primarybtn";
import PrimaryShellbtn from "./childrens/PrimaryShellbtn";

function ResultSection() {
  return (
    <div className="bg-bgresult flex flex-col md:flex-row p-3 px-6 md:px-14 lg:px-20 md:p-6 justify-between items-center section">
      <div>
        <Title>A Bad Hire Costs a Company</Title>
        <Title css="text-[#FAA53D]">$40,000 at least</Title>
        <Paragraph>
          Choose RightHire and make the right hire the first time
        </Paragraph>
        <div className="flex flex-col md:flex-row">
          <Primarybtn chref="/register">Sign Up</Primarybtn>
          <PrimaryShellbtn chref="/contact">Contact Us</PrimaryShellbtn>
        </div>
      </div>
      <img
        src="https://static.wixstatic.com/media/24f075_db4e24ffac6d44b7840d38f74c236fcf~mv2.png/v1/fill/w_474,h_298,fp_0.49_0.63,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Rectangle%2086.png"
        alt=""
      />
    </div>
  );
}

export default ResultSection;
