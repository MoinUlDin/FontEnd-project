import React from "react";
import Logo from "./childrens/Logo";
import Primarybtn from "./childrens/Primarybtn";
import ListItem from "./childrens/ListItem";

function Footer() {
  return (
    <div className="grid h-64 relative w-full bg-white grid-cols-6 place-content-center py-3 px-3 md:px-12 gap-4">
      <div className="col-span-2 ">
        <Logo />
      </div>
      <div className="col-span-2 ">
        <Primarybtn>Contact Us Now</Primarybtn>
      </div>
      <ul className="col-span-1 flex flex-col">
        <ListItem>BUY CREDITS</ListItem>
        <ListItem>ABOUT US</ListItem>
        <ListItem>SITEMAP</ListItem>
      </ul>
      <ul className="col-span-1 flex flex-col">
        <ListItem>PRIVACY POLICY</ListItem>
        <ListItem>TERMS OF USE</ListItem>
        <ListItem>PATNERS</ListItem>
      </ul>
      <div className="col-span-6 flex items-center justify-center bg-[#28296C] absolute bottom-0 w-full h-12 uppercase text-white font-bold text-[12px]">
        <p>&#169; 2025 Copyright & Powered By Hire Me</p>
      </div>
    </div>
  );
}

export default Footer;
