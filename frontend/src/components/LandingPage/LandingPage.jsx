import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Image from "../assets/black_bg.png";

const Landingpage = () => {
  useEffect(() => {
    document.addEventListener("click", (event) => {
      document.getElementById("Audio")?.play();
    });
  }, []);
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 overflow-hidden">
        {/* <video
          className="w-full h-full object-cover"
          src={Video} // Replace with video file path
        ></video> */}
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="imagename"
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>
      {/* Text in the Middle */}
      <div className="flex flex-col gap-2 absolute inset-0 items-center justify-center">
        <div className="text-white tex-center">
          <img className="w-[400px] h-[400px]" src={Image} alt="imagename" />
        </div>
        <Link to="/customer">
          <button className="rounded-md shadow-sm bg-zinc-950 hover:bg-gray-900">
            Explore
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Landingpage;
