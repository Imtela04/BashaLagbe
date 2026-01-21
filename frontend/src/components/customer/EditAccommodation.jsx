import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuctioneditForm from "./AuctioneditForm";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const EditAccommodation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccommodation();
  }, [id]);

  const fetchAccommodation = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auction/getauction/${id}`);
      setAccommodation(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accommodation:", error);
      alert("Failed to load accommodation");
      navigate('/my-accommodations');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Accommodation not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Accommodation</h1>
      <AuctioneditForm
        id={accommodation._id}
        homename={accommodation.homeName}
        size={accommodation.homeSize}
        infodetails={accommodation.details}
        imagelink={accommodation.image}
      />
    </div>
  );
};

export default EditAccommodation;
