import React from "react";
import Title from "./childrens/Title";
import logo from "../assets/react.svg";
import Paragraph from "./childrens/Paragraph";
import Primarybtn from "./childrens/Primarybtn";
import PrimaryShellbtn from "./childrens/PrimaryShellbtn";
import Logo from "./childrens/Logo";
import bgImage from "../assets/bg.svg";

function HeroSection() {
  return (
    <header
      style={{ backgroundImage: `url(${bgImage})` }}
      className="flex flex-col-reverse mb-20 md:grid min-h-svh gap-3 md:grid-cols-12 mx-6 md:mx-18 md:place-content-center section"
    >
      <div className="col-span-8 place-self-center px-8">
        <div className="flex gap-1 items-center">
          <h2 className="text-xl font-semibold text-[#FAA53D]">
            Best Practice
          </h2>{" "}
          <Logo />
        </div>

        <Title>First Time, Every Time</Title>
        <Paragraph>
          RightHire’s scientific breakthroughs have been lauded by experts as
          revolutionary and game-changing in the field of pre-employment
          assessments. Our system helps you predict the future job performance
          of your candidates with higher accuracy than other methods, no matter
          the occupation. Our assessments are legally-defensible, easy to use,
          and will save you time and money.
        </Paragraph>
        <div className="flex ">
          <Primarybtn chref="/register">Sign Up</Primarybtn>
          <PrimaryShellbtn chref="/register">Contact Us</PrimaryShellbtn>
        </div>
      </div>

      <img
        className="col-span-4 my-14"
        src="https://static.wixstatic.com/media/24f075_05ea70d7c5e64c37ba9ac07adeedd4fa~mv2.png/v1/fill/w_371,h_462,fp_0.51_0.18,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/24f075_05ea70d7c5e64c37ba9ac07adeedd4fa~mv2.png"
      />
    </header>
  );
}

export default HeroSection;
