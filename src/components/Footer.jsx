import React from "react";
import Logo from "./childrens/Logo";
import Primarybtn from "./childrens/Primarybtn";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div className="grid grid-cols-6 h-64 relative w-full bg-white  place-content-center py-3 px-3 md:px-12 gap-4">
      <div className="col-span-6 md:col-span-2 flex justify-center ">
        <Logo />
      </div>
      <div className="col-span-6 md:col-span-2 place-self-center">
        <Primarybtn>Contact Us Now</Primarybtn>
      </div>
      <ul className="col-span-3 mb-10  md:col-span-1 flex flex-col ">
        <Link className="listItem">BUY CREDITS</Link>
        <Link className="listItem">ABOUT US</Link>
        <Link className="listItem">SITEMAP</Link>
      </ul>
      <ul className="col-span-3  md:col-span-1 flex flex-col">
        <Link className="listItem">PRIVACY POLICY</Link>
        <Link className="listItem">TERMS OF USE</Link>
        <Link className="listItem">PATNERS</Link>
      </ul>
      <div className="col-span-6 flex items-center justify-center bg-[#28296C] absolute bottom-0 w-full h-12 uppercase text-white font-bold text-[12px]">
        <p>&#169; 2025 Copyright & Powered By Hire Me</p>
      </div>
    </div>
  );
}

export default Footer;
