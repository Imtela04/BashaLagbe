import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Auctioncard from "./Auctioncard";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const MyAccommodations = () => {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).email
    : "";

  const userType = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).userType
    : "";

  useEffect(() => {
    // Redirect if not a landlord
    if (userType !== 'landlord') {
      navigate('/customer');
      return;
    }

    fetchMyAccommodations();
  }, []);

  const fetchMyAccommodations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/auction/${userEmail}`
      );
      setAccommodations(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      try {
        await axios.delete(`${API_URL}/api/auction/${id}`);
        alert("Accommodation deleted successfully!");
        fetchMyAccommodations(); // Refresh the list
      } catch (error) {
        console.error("Error deleting accommodation:", error);
        alert("Failed to delete accommodation");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Accommodations</h1>
        <button
          onClick={() => navigate('/post-accommodation')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Post New Accommodation
        </button>
      </div>

      {accommodations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">You haven't posted any accommodations yet.</p>
          <button
            onClick={() => navigate('/post-accommodation')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Post Your First Accommodation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accommodations.map((item) => (
            <div key={item._id} className="relative">
              <Auctioncard
                imagelink={item.image}
                homename={item.homeName}
                details={item.details}
                size={item.homeSize}
                startbid={item.startingPrice}
                id={item._id}
                edit={true}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/edit-accommodation/${item._id}`)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccommodations;
