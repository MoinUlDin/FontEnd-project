import React from "react";
import Navebar from "../components/Navebar";
import HeroSection from "../components/HeroSection";
import IntroSection from "../components/IntroSection";
import ReportSection from "../components/ReportSection";
import Footer from "../components/Footer";
import ResultSection from "../components/ResultSection";
import SolutionSection from "../components/SolutionSection";

function HomePage() {
  return (
    <div>
      <Navebar />
      <div>
        <HeroSection />
        <IntroSection />
        <ReportSection />
        <ResultSection />
        <SolutionSection />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
