import React, { useState } from "react";
import axios from "axios";

const Auctoinform = () => {
  const [homeName, sethomeName] = useState("");
  const [locationName, setlocationName] = useState("");
  const [homeSize, sethomeSize] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  //const [auctionStartTime, setAuctionStartTime] = useState("");
  //const [auctionEndTime, setAuctionEndTime] = useState("");
  const [image, setImage] = useState("");
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
        "http://localhost:3001/api/auctoin/createauction",
        {
          homeName,
          email,
          locationName: locationName,
          homeSize,
          date,
          details,
          startingPrice,
          //auctionStartTime,
          //auctionEndTime,
          image: image,
        }
      );

      alert("Form Submited");
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
              placeholder="Villa"
              value={homeName}
              onChange={(e) => sethomeName(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="locationName"
            >
              Home Location
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="locationName"
              type="text"
              placeholder="Dhanmondi"
              value={locationName}
              onChange={(e) => setlocationName(e.target.value)}
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
              placeholder="2000"
              value={homeSize}
              onChange={(e) => sethomeSize(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="startPrice"
            >
              Start Price
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="startPrice"
              type="text"
              placeholder="1.2 Cr."
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
            />
          </div>
          
          <div className="w-full px-3 mt-2">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              htmlFor="car-image"
            >
              Add Image
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="car-image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <p className="text-gray-600 text-xs italic mt-2">
              Upload an image for the car
            </p>
          </div>
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

export default Auctoinform;
