import React from "react";
import { TextField, Button } from "@mui/material";

function DHelp() {
  return (
    <div>
      <div className="p-10 ">
        <h1 className="m-3 font-extrabold text-5xl text-center">
          Have any Question?
        </h1>
        <h4 className="text-center mb-2">
          Share your thought with us, our active team will reach you soon{" "}
        </h4>
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
            sx={"margin-top: 20px; min-width:300px"}
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
