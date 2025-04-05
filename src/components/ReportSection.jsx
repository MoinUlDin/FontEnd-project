import React from "react";
import Card from "./childrens/Card";
import sideimg from "../assets/report.avif";

function ReportSection() {
  return (
    <section className="section">
      <div className="flex flex-col lg:flex-row gap-8 mx-4 md:mx-6 mb-30 relative">
        <div className="absolute -z-100 hidden lg:block bg-amber-700 w-sm h-70 rotate-12 left-80 top-24"></div>
        <Card
          title="Candidate Selection Report"
          paragraph="We measure job-specific cognitive abilities and work personality using two different online tests. The results of these assessments are compiled into a candidate selection report."
          btntext="Get Assessment Report"
          imageLink={sideimg}
        />
        <Card
          title="Structured Interview Guide"
          paragraph="This guide enables you to further probe work personality characteristics that are important to perform the job well, but where the candidate has done poorly, to ensure job fit."
          btntext="Sample Structured Interview Guide"
          imageLink="https://static.wixstatic.com/media/d79df2_fecc7c0eeacf4aacbcce6ae25e2cea10~mv2.png/v1/fill/w_173,h_290,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20(3).png"
        />
      </div>
    </section>
  );
}

export default ReportSection;
