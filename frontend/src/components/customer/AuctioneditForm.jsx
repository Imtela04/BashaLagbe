import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

import { Link, useNavigate } from "react-router-dom";

const AuctioneditForm = ({ id, homename, size, infodetails, imagelink }) => {
  const navigate = useNavigate();
  const [homeName, sethomeName] = useState(homename);
  const [locationName, setlocationName] = useState("");
  const [homeSize, sethomeSize] = useState(size);
  const [date, setDate] = useState("");
  const [details, setDetails] = useState(infodetails);
  const [startingPrice, setStartingPrice] = useState("");
  //const [auctionStartTime, setAuctionStartTime] = useState("");
  //const [auctionEndTime, setAuctionEndTime] = useState("");
  const [image, setImage] = useState(imagelink);
  const [email, setEmail] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email
      : ""
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log({
    //   email,
    //   homeName,
    //   locationName: locationName,
    //   homeSize,
    //   date,
    //   details,
    //   startingPrice,
    //   auctionStartTime,
    //   auctionEndTime,
    //   image,
    // });

    try {
      const { data } = await axios.post(
        `http://localhost:3001/api/auctoin//editaction/${id}`,
        {
          homeName,
          homeSize,
          details,
          image: image,
        }
      );

      navigate("/admin");
      // make a page refresh
      window.location.reload();
    } catch (err) {
      alert("For Submitted due");
    }

    // Reset the form
    sethomeName("");
    setlocationName("");
    sethomeSize("");
    setDate("");
    setDetails("");
    setStartingPrice("");
    //setAuctionStartTime("");
    //setAuctionEndTime("");
    setImage(null);
  };

  return (
    <div>
      <form className="w-full max-w-lg my-10" onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="homeName"
            >
              Home Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="homeName"
              type="text"
              placeholder="new Home name"
              value={homeName}
              onChange={(e) => sethomeName(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="homeSize"
            >
              Home size
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="homeSize"
              type="text"
              placeholder="new home size"
              value={homeSize}
              onChange={(e) => sethomeSize(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-white font-bold mb-2"
              htmlFor="carDetails"
            >
              Home Details
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="carDetails"
              type="text"
              placeholder="Details of the Home"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <p className="text-white text-xs italic">
              Explain the Home best of your knowledge
            </p>
          </div>
        </div>
        <div className="w-full px-3 mt-2">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="Home-image"
          >
            Add Image
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="Home-image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <p className="text-gray-600 text-xs italic mt-2">
            Upload an image for the home
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuctioneditForm;
