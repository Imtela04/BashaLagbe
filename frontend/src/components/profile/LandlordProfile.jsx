import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const LandlordProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [landlord, setLandlord] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    fetchLandlordData();
  }, [userId]);

  const fetchLandlordData = async () => {
    try {
      setLoading(true);
      
      // Fetch landlord profile
      const profileResponse = await axios.get(`${API_URL}/api/customer/${userId}`);
      setLandlord(profileResponse.data);
      
      // Check if this is the current user's profile
      setIsOwnProfile(currentUser && currentUser._id === userId);

      // Fetch landlord ratings
      const ratingsResponse = await axios.get(`${API_URL}/api/rating/user/${userId}/landlord`);
      setRatings(ratingsResponse.data);

      // Fetch properties owned by landlord
      const propertiesResponse = await axios.get(`${API_URL}/api/auction/${profileResponse.data.email}`);
      setProperties(propertiesResponse.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching landlord data:", error);
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/rating/submit`,
        {
          ratedUserId: userId,
          ratingType: "landlord",
          rating: newRating,
          comment: ratingComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      alert("Rating submitted successfully!");
      setShowRatingModal(false);
      setRatingComment("");
      fetchLandlordData(); // Refresh data
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit rating");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!landlord) {
    return <div className="flex justify-center items-center min-h-screen">Landlord not found</div>;
  }

  const isPublicView = landlord.profileVisibility === 'public' || isOwnProfile;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            <img
              src={landlord.image || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
              alt={landlord.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{landlord.name}</h1>
                  <p className="text-gray-600 mt-1">Landlord</p>
                </div>
                {!isOwnProfile && currentUser && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Rate Landlord
                  </button>
                )}
              </div>
              
              {/* Rating Display */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {renderStars(landlord.landlordRating?.averageRating || 0)}
                </div>
                <span className="text-lg font-semibold">
                  {landlord.landlordRating?.averageRating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-gray-600">
                  ({landlord.landlordRating?.totalRatings || 0} reviews)
                </span>
              </div>

              {isPublicView && (
                <>
                  {landlord.bio && (
                    <p className="mt-4 text-gray-700">{landlord.bio}</p>
                  )}
                  <div className="mt-4 space-y-2">
                    {landlord.phone && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Phone:</span> {landlord.phone}
                      </p>
                    )}
                    {landlord.address && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Address:</span> {landlord.address}
                      </p>
                    )}
                    {landlord.email && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Email:</span> {landlord.email}
                      </p>
                    )}
                  </div>
                </>
              )}
              
              {!isPublicView && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    This profile is set to private. Limited information is available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Properties ({properties.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <div
                key={property._id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/customer`)}
              >
                <img
                  src={property.image || "https://via.placeholder.com/300x200"}
                  alt={property.homeName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{property.homeName}</h3>
                  <p className="text-gray-600 text-sm">{property.locationName}</p>
                  <p className="text-blue-600 font-semibold mt-2">
                    BDT {property.startingPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {properties.length === 0 && (
            <p className="text-gray-500 text-center py-8">No properties listed yet</p>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Reviews ({ratings.length})</h2>
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating._id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={rating.ratedBy?.image || "https://via.placeholder.com/40"}
                    alt={rating.ratedBy?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{rating.ratedBy?.name}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(rating.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {rating.comment && (
                  <p className="text-gray-700 ml-12">{rating.comment}</p>
                )}
              </div>
            ))}
          </div>
          {ratings.length === 0 && (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Rate this Landlord</h2>
            <form onSubmit={handleSubmitRating}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating (1-5 stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="text-3xl"
                    >
                      {star <= newRating ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Comment (optional)</label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  rows="4"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit Rating
                </button>
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordProfile;
