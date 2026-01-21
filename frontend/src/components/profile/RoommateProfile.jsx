import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const RoommateProfile = () => {
  const { userId } = useParams();
  const [roommate, setRoommate] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    fetchRoommateData();
  }, [userId]);

  const fetchRoommateData = async () => {
    try {
      setLoading(true);
      
      // Fetch roommate profile
      const profileResponse = await axios.get(`${API_URL}/api/customer/${userId}`);
      setRoommate(profileResponse.data);
      
      // Check if this is the current user's profile
      setIsOwnProfile(currentUser && currentUser._id === userId);

      // Fetch roommate ratings
      const ratingsResponse = await axios.get(`${API_URL}/api/rating/user/${userId}/roommate`);
      setRatings(ratingsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching roommate data:", error);
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
          ratingType: "roommate",
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
      fetchRoommateData(); // Refresh data
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

  if (!roommate) {
    return <div className="flex justify-center items-center min-h-screen">Roommate not found</div>;
  }

  const isPublicView = roommate.profileVisibility === 'public' || isOwnProfile;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            <img
              src={roommate.image || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
              alt={roommate.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{roommate.name}</h1>
                  <p className="text-gray-600 mt-1">Looking for Roommates</p>
                </div>
                {!isOwnProfile && currentUser && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Rate Roommate
                  </button>
                )}
              </div>
              
              {/* Rating Display */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {renderStars(roommate.roommateRating?.averageRating || 0)}
                </div>
                <span className="text-lg font-semibold">
                  {roommate.roommateRating?.averageRating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-gray-600">
                  ({roommate.roommateRating?.totalRatings || 0} reviews)
                </span>
              </div>

              {isPublicView && (
                <>
                  {roommate.bio && (
                    <p className="mt-4 text-gray-700">{roommate.bio}</p>
                  )}
                  <div className="mt-4 space-y-2">
                    {roommate.phone && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Phone:</span> {roommate.phone}
                      </p>
                    )}
                    {roommate.address && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Address:</span> {roommate.address}
                      </p>
                    )}
                    {roommate.email && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Email:</span> {roommate.email}
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
            <h2 className="text-2xl font-bold mb-4">Rate this Roommate</h2>
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

export default RoommateProfile;
