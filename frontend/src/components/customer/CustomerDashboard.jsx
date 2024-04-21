import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Auctioncard from "./Auctioncard";
import Auctoinform from "./Auctoinform";
import axios from "axios";
const CustomerDashboard = () => {
  function checkUserLoggedIn() {
    const token = localStorage.getItem("token");
    let userLoggedIn = false;

    if (token) {
      userLoggedIn = true;
    }

    return userLoggedIn;
  }
  const userLoggedIn = checkUserLoggedIn();

  const navigate = useNavigate();

  const userEmail = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).email
    : "";

  const [data, setData] = useState();
  const [email, setEmail] = useState();
  const [refresh, setRefrsh] = useState();
  const [userhomedata, setuserhomedata] = useState();
  const [issue, setIssue] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/auctoin/getallauctoin"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };
  const fetchuserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/auctoin/${userEmail}`
      );
      setuserhomedata(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/login");
    }

    fetchData();
    fetchuserData();
  }, []);

  console.log(data);
  console.log(userhomedata);

  const [bidPrice, setBidPrice] = useState("");
  //const [tranxd, setTrnxd] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const submitBid = () => {
    // Add your logic to handle the bid submission
    if (bidPrice.trim() === "") {
      alert("Please enter a bid amount.");
      return;
    }
    if (bidPrice.trim() === "") {
      alert("Please enter a bid amount.");
      return;
    }

    alert(`Bid submitted! Price: ${bidPrice}`);
    closeModal();
  };

  const [searchTerm, setSearchTerm] = useState("");

  // Handle search button click
  const handleSearch = () => {
    // Perform search logic with the searchTerm
    console.log(`Searching for: ${searchTerm}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3001/api/make/report`,
        {
          email: userEmail,
          name: JSON.parse(localStorage.getItem("user")).name,
          message: issue,
        }
      );
      console.log(response.data);

      // Assuming bidPrice is a state or prop that holds the bid price
      // Update this alert message based on your application's context
      alert("Report submitted successfully!");
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report.");
    }
  };
  const buttonStyle = {
    animation:
      userhomedata?.length === 0 ? "" : "shake 0.5s ease-in-out infinite",
  };

  const isAdmin = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).isAdmin
    : "";

  return (
    <>
      <div className=" flex flex-row justify-between ml-5  mt-10 relative">
        <div className="absolute h-0.5 w-full bg-zinc-950 bottom-0"></div>
        <p className=" font-semibold text-2xl ">On Going Booking</p>
      </div>

      <div className="flex items-center mt-3 ml-5">
        <input
          type="text"
          className="px-3 py-2 border rounded-md mr-2"
          placeholder="Name of the home"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="flex flex-wrap mx-5 mt-10 gap-24 overflow-auto">
        {data?.map(
          (item, index) =>
            item.email !== userEmail && ( // Conditional rendering based on email match
              <Auctioncard
                key={index} // Assuming each item has a unique 'id'. If not, use 'index'.
                imagelink={item.image}
                homename={item.homeName}
                details={item.details}
                size={item.homeSize}
                startbid={item.startingPrice}
                id={item._id}
                edit={false}
                // timer={/* logic to calculate remaining time based on item.auctionEndTime */}
              />
            )
        )}
      </div>

      <div className="ml-5 font-semibold my-10 text-2xl relative">
        My Booking
        <div className="absolute h-0.5 w-full bg-zinc-950 bottom-0"></div>
      </div>
      <div className=" flex flex-wrap mx-5 my-10 gap-24 overflow-auto">
        <table id="bookingTable" className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-14 h-8 px-5 py-1.5 bg-white rounded shadow">
                ID
              </th>

              <th className="w-14 h-8 px-5 py-1.5 bg-white rounded shadow">
                home name{" "}
              </th>

              <th className="w-14 h-8 px-5 py-1.5 bg-white rounded shadow">
                Offer Placed
              </th>
              <th className="w-14 h-8 px-5 py-1.5 bg-white rounded shadow">
                Payment
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item1) =>
              item1.bidders?.map(
                (item2, index) =>
                  item2.bidderEmail === userEmail && ( // Conditional rendering
                    <tr key={index}>
                      <td className="pt-2">{index + 1}</td>
                      <td className="pt-2">{item1.homeName}</td>

                      <td className="pt-2">
                        <b>{item2.bidAmount}</b>
                      </td>
                      <td className="pt-2 flex justify-center">
                        <button className="rounded shadow-sm bg-green-300 text-black">
                          {item2.payment ? "Booked" : "Pending"}
                        </button>
                      </td>
                    </tr>
                  )
              )
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {/* Your modal content goes here */}
              <div className=" flex flex-col items-center p-6">
                {userhomedata?.map((item1) =>
                  item1.bidders?.map((item2, index) =>
                    // Check if item2.bidderEmail is not empty
                    item2.bidderEmail ? (
                      <p key={index} className="my-2">
                        {item2.bidderEmail} Booking on your Home.
                      </p>
                    ) : null
                  )
                )}

                {/* Show "No notifications" if the list is empty */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerDashboard;
