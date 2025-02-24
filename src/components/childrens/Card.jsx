import React from "react";
import Primarybtn from "./Primarybtn";

function Card({ title, paragraph, btntext, imageLink, css = "" }) {
  return (
    <div
      className={`${css} flex shadow-2xl shadow-gray-600 bg-white border-1 border-b-black       p-2 md:p-6 rounded-2xl mt-8 md:mt-20`}
    >
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold mb-2 md:mb-6">{title}</h3>
        <p className="mb-4 md:mb-8">{paragraph}</p>
        <div className="max-w-[80%] m-0">
          <Primarybtn children={btntext} />
        </div>
      </div>
      <img className="items-end w-40" src={imageLink} alt="" />
    </div>
  );
}

export default Card;
