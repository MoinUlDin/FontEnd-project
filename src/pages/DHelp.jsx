import React from "react";
import { TextField, Button } from "@mui/material";

function DHelp() {
  return (
    <div>
      <div className=" ">
        <h1 className="m-3 font-semibold md:font-extrabold text-lg  md:text-2xl lg:text-5xl text-center">
          Have any Question?
        </h1>
        <h6 className="text-center mb-2 text-sm md:text-lg">
          Share your thought with us, our active team will reach you soon{" "}
        </h6>
        <div className="flex flex-col items-center mt-10">
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            size="small"
            name="name"
          />
          <TextField
            label="Your Message"
            multiline
            rows={4}
            variant="outlined"
            sx={"margin-top: 20px; min-width:225px"}
          />
          <Button variant="contained" sx={"margin-top: 20px;"}>
            {" "}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DHelp;
