import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    city: currentUser?.city || "",
    country: currentUser?.country || "",
    bio: currentUser?.bio || "",
    image: currentUser?.image || "",
    profileVisibility: currentUser?.profileVisibility || "public",
    userType: currentUser?.userType || "tenant",
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/customer/${currentUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local storage with new user data
      const updatedUser = {
        ...currentUser,
        ...response.data,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", response.data.token);

      setSuccess("Profile updated successfully!");
      setLoading(false);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        if (currentUser.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/customer");
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., +880 1234567890"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Dhaka"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., Bangladesh"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                User Type
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="tenant">Tenant (Looking for accommodation)</option>
                <option value="landlord">Landlord (Property owner)</option>
                <option value="roommate">Roommate (Looking for roommates)</option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell others about yourself..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Profile Image URL */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/your-image.jpg"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Profile Visibility */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Profile Visibility
              </label>
              <select
                name="profileVisibility"
                value={formData.profileVisibility}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="public">Public - Anyone can view</option>
                <option value="private">Private - Limited information shown</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
