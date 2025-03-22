import React from "react";
import Navebar from "../components/Navebar";
import Footer from "../components/Footer";
import { TextField, Button } from "@mui/material";

function ContactPage() {
  return (
    <div className="">
      <Navebar />
      <div className="p-10 ">
        <h1 className="m-3 font-extrabold text-5xl text-center">
          Get in Touch
        </h1>
        <h4 className="text-center mb-2">
          Your ideas matter to us. Contact our team today and let’s build
          something amazing together.
        </h4>
        <div className="flex flex-col items-center mt-10">
          <TextField
            id="email"
            label="Your Email"
            variant="outlined"
            size="small"
            name="name"
            sx={"min-width:300px"}
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

      <Footer />
    </div>
  );
}

export default ContactPage;
