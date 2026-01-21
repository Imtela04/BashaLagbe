import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const ManageBids = () => {
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
    if (userType !== 'landlord') {
      navigate('/customer');
      return;
    }

    fetchAccommodationsWithBids();
  }, []);

  const fetchAccommodationsWithBids = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/auction/${userEmail}`);
      // Filter accommodations that have bids
      const withBids = response.data.filter(acc => acc.bidders && acc.bidders.length > 0);
      setAccommodations(withBids);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      setLoading(false);
    }
  };

  const handleBidStatus = async (auctionId, bidderId, status) => {
    try {
      await axios.put(
        `${API_URL}/api/auction/${auctionId}/bid/${bidderId}/status`,
        { status }
      );
      alert(`Bid ${status} successfully!`);
      fetchAccommodationsWithBids(); // Refresh the data
    } catch (error) {
      console.error("Error updating bid status:", error);
      alert("Failed to update bid status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
      <h1 className="text-3xl font-bold mb-8">Manage Bids</h1>

      {accommodations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No bids received yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {accommodations.map((accommodation) => (
            <div key={accommodation._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                {accommodation.image && (
                  <img
                    src={accommodation.image}
                    alt={accommodation.homeName}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-semibold">{accommodation.homeName}</h2>
                  <p className="text-gray-600">{accommodation.locationName}</p>
                  <p className="text-gray-500">Starting Price: ৳{accommodation.startingPrice}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">
                Bids ({accommodation.bidders.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Bidder Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Bid Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Payment</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accommodation.bidders.map((bidder) => (
                      <tr key={bidder._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{bidder.bidderName}</td>
                        <td className="px-4 py-3">{bidder.bidderEmail}</td>
                        <td className="px-4 py-3 font-semibold">৳{bidder.bidAmount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bidder.status || 'pending')}`}>
                            {(bidder.status || 'pending').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            bidder.payment ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {bidder.payment ? 'PAID' : 'UNPAID'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {(bidder.status || 'pending') === 'pending' && (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleBidStatus(accommodation._id, bidder._id, 'accepted')}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleBidStatus(accommodation._id, bidder._id, 'rejected')}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {(bidder.status || 'pending') !== 'pending' && (
                            <div className="text-center text-sm text-gray-500">
                              {(bidder.status || 'pending') === 'accepted' ? 'Accepted' : 'Rejected'}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBids;
