import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Tablecom from "./Tablecom";
import Auctioncard from "../customer/Auctioncard";
import axios from "axios";
import Auctoinform from "../customer/Auctoinform";
import {FaSearch} from 'react-icons/fa';  

const AdminDashboard = () => {
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

  const isAdmin = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).isAdmin
    : "";

  const name = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).name
    : "";

  const userimage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).image
    : "";

  const [action, setAction] = useState("");
  const [image, setImage] = useState("");
  const [data, setData] = useState([]);
  const [reprots, setReport] = useState([]);

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

  const fetchReport = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/report");
      setReport(response.data);
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
    fetchReport();
  }, []);

  console.log(data);

  function changeStatus(obj_id, email, trxnid) {
    console.log(obj_id, email, trxnid);
    axios
      .put(`http://localhost:3001/api/auctoin/bid/pay/${obj_id}`, {
        email,
        trxnid,
      })
      .then((response) => {
        console.log("Success:", response.data);
        // Reload the page after the request is successful
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchQuery3, setSearchQuery3] = useState("");
  const [searchQuery4, setSearchQuery4] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearch2 = (event) => {
    setSearchQuery2(event.target.value);
  };
  const handleSearch3 = (event) => {
    setSearchQuery3(event.target.value);
  };
  const handleSearch4 = (event) => {
    setSearchQuery4(event.target.value);
  };

  // Filter data based on the search query
  const filteredData = data?.filter((item) =>
    item.homeName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredData2 = data?.filter((item) =>
    item.homeName.toLowerCase().includes(searchQuery2.toLowerCase())
  );
  const filteredData3 = data?.filter((item) =>
    item.homeName.toLowerCase().includes(searchQuery3.toLowerCase())
  );
  const filteredData4 = reprots?.filter((item) =>
    item.email.toLowerCase().includes(searchQuery4.toLowerCase())
  );

  return (
    <>
      {isAdmin ? (
        <div className="flex flex-col">
          <div className="flex flex-col items-center mt-[100px]">
            <img
              className="rounded-full shadow-sm shadow-gray-800 h-36 w-36"
              src={
                userimage
                  ? ""
                  : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
              }
              alt="profile pic"
            />
            <h1 className="font-bold text-2xl mt-4">Welcome, {name}!</h1>
            <div className="mt-2 h-0.5 w-[200px] bg-zinc-950"></div>
          </div>

          <div className="my-10">
            <div className="flex fle-row gap-4 items-center">
              <h1 className="font-bold text-2xl ml-4">All Booking</h1>
              <input
                className="border-2 border-gray-800 p-3 rounded-md px-2 flex items-start focus: outline-none"
                type="search"
                placeholder="Search By Home Name"
                value={searchQuery}
                onChange={handleSearch}
              />
              <FaSearch className = 'text-slate-600'/>
            </div>
            <div className="mt-2 h-0.5 w-full bg-zinc-950"></div>
            <div className="mt-10 mx-4">
              <div className="flex flex-wrap mx-5 mt-10 gap-24 overflow-auto">
                {filteredData?.map((item, index) => (
                  // Conditional rendering based on email match
                  <Auctioncard
                    key={index} // Assuming each item has a unique 'id'. If not, use 'index'.
                    imagelink={item.image}
                    homename={item.homeName}
                    size={item.homeSize}
                    details={item.details}
                    startbid={item.startingPrice}
                    id={item._id}
                    placebid={false}
                    edit={true}
                    // timer={/* logic to calculate remaining time based on item.auctionEndTime */}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center bg-gray-900 rounded-[50px] shadow-lg">
            <Auctoinform />
          </div>
          <div className="my-10">
            <div className="flex fle-row gap-4 items-center">
              <h1 className="font-bold text-2xl ml-4">All Bookings</h1>
              <input
                className="border-2 border-gray-800 p-3 rounded-md px-2 flex items-start focus: outline-none"
                type="search"
                placeholder="Search By Home Name"
                value={searchQuery}
                onChange={handleSearch}
              />
              <FaSearch className = 'text-slate-600'/>
            </div>
            <div className="mt-2 h-0.5 w-full bg-zinc-950"></div>
            <div className="mt-10 mx-4">
              <table>
                <thead>
                  <tr>
                    <th className="bg-zinc-950 text-white text-center rounded-md">
                      ID
                    </th>
                    <th className="bg-zinc-950 text-white text-center rounded-md">
                      Home Name
                    </th>

                    <th className="bg-zinc-950 text-white text-center rounded-md">
                      Booking Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData2?.map((item1) =>
                    item1.bidders?.map((item2, index) => (
                      <tr>
                        <td>1</td>
                        <td>{item1.homeName}</td>
                        <td>{item2.bidAmount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="my-10">
            <div className="flex fle-row gap-4 items-center">
              <h1 className="font-bold text-2xl ml-4">All Payments</h1>
              <input
                className="border-2 border-gray-800 p-3 rounded-md px-2 flex items-start focus: outline-none"
                type="search"
                placeholder="Search By Home Name"
                value={searchQuery}
                onChange={handleSearch}
              />
              <FaSearch className = 'text-slate-600'/>
            </div>
            <div className="mt-2 h-0.5 w-full bg-zinc-950"></div>
            <div className="mt-10 mx-4">
              <table>
                <thead>
                  <tr>
                    <th className="bg-zinc-950 text-white text-center rounded-md">
                      ID
                    </th>
                    <th className="bg-zinc-950 text-white text-center rounded-md">
                      Home Name
                    </th>

                    <th className="bg-zinc-950 text-white text-center rounded-md">
                      Booking Amount
                    </th>
                    <th className="bg-zinc-950 text-white text-center rounded-md">
                      Email
                    </th>
                    <th className="bg-zinc-950 text-white text-center rounded-md">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData3?.map((item1) =>
                    item1.bidders?.map(
                      (item2, index) =>
                        item2.payment === false && (
                          <tr>
                            <td>1</td>
                            <td>{item1.homeName}</td>
                            <td>{item2.bidAmount}</td>
                            <td>{item2.bidderEmail}</td>
                            <td className="flex flex-row items-center justify-around">
                              <button
                                className="rounded shadow-sm bg-teal-600 hover:bg-teal-800"
                                value={"approve"}
                                onClick={() =>
                                  changeStatus(
                                    item1._id,
                                    item2.bidderEmail,
                                    item2.bidtrnx
                                  )
                                }
                              >
                                Approve
                              </button>
                            </td>
                          </tr>
                        )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <h1>You are not an admin</h1>
      )}
    </>
  );
};

export default AdminDashboard;
