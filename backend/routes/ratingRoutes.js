const express = require("express");
const router = express.Router();
const { isAuth } = require("../config/auth");
const {
  submitRating,
  getUserRatings,
  getUserRatingStats,
  deleteRating
} = require("../controller/ratingController");

// Submit or update a rating (requires authentication)
router.post("/submit", isAuth, submitRating);

// Get all ratings for a user
// Query params: ?ratingType=landlord or ?ratingType=roommate
router.get("/user/:userId/:ratingType?", getUserRatings);

// Get rating statistics for a user
router.get("/stats/:userId", getUserRatingStats);

// Delete a rating (only by the person who submitted it)
router.delete("/:ratingId", isAuth, deleteRating);

module.exports = router;
