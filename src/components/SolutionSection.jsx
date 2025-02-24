import React from "react";
import Title from "./childrens/Title";
import Paragraph from "./childrens/Paragraph";

function SolutionSection() {
  return (
    <section className=" flex flex-col md:flex-row p-3 px-6 md:px-14 lg:px-20 md:p-6 justify-between items-center section">
      <div>
        <Title css="leading-[4rem]">
          What We Assess to <br /> Get the Best <br /> Candidates
        </Title>
        <Paragraph>
          RightHire’s assessment system analyzes the mental and behavioral
          attributes that are critical to success and contribute to the majority
          of bad hires if they are measured poorly or not at all. These
          important attributes are job-specific cognitive abilities and work
          personality characteristics. We have pre-built assessments for over
          950 job types or you can use our system to create custom assessments
          for your jobs quickly and cost-effectively.
        </Paragraph>
      </div>
      <div className="mx-2 md:mx-4"></div>
      <img
        src="https://static.wixstatic.com/media/24f075_53a77dfc4de446be8d9540fdc00e44aa~mv2.jpg/v1/fill/w_562,h_469,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/24f075_53a77dfc4de446be8d9540fdc00e44aa~mv2.jpg"
        alt=""
      />
    </section>
  );
}

export default SolutionSection;
