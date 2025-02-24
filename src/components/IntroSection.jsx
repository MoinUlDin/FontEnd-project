import React from "react";
import Title from "./childrens/Title";
import Paragraph from "./childrens/Paragraph";

function IntroSection() {
  return (
    <section className="grid min-h-svh gap-3 grid-cols-12 mx-6 md:mx-18 place-content-center section">
      <div className=" col-span-7 place-self-center">
        <Title>The Problem?</Title>
        <Paragraph>
          Although the recruiting process at most businesses does a great job of
          evaluating candidates on technical skills, it does not account for
          what causes most new hires to be a poor fit. In 89% of cases, the
          factors that cause new employees to fail are unrelated to technical
          skills. <br />
          <br /> It is estimated that 46% of the new employees will turn out to
          be bad hires within 18 months.
        </Paragraph>
      </div>
      <img
        className="col-span-5"
        src="https://static.wixstatic.com/media/d79df2_0dbb47b78390439ba5687ce244ea6766~mv2.png/v1/fill/w_467,h_449,fp_0.69_0.51,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Group%201000001447%20(1).png"
        alt=""
      />
    </section>
  );
}

export default IntroSection;
