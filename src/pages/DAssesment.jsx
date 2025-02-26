import React from "react";
import FilterBy from "../components/childrens/FilterBy";

function DAssesment() {
  return (
    <div>
      <FilterBy list={["name", "age"]} />
      <h1 className="text-2xl font-bold mb-4">Dashboard Assesments</h1>
      <p>Assesments list goes here</p>
    </div>
  );
}

export default DAssesment;
